import type { Server, Socket } from 'socket.io';
import type {
  ClientToServerEvents, ServerToClientEvents, SocketData, RoomId, CharacterId
} from '@ephemera/shared';
import { asRoomId, asCharacterId } from '@ephemera/shared';
import { getRoomWithOccupants, getExitTarget } from '../../../db/postgres/repositories/room.repository.js';
import { atomicRoomTransfer }                  from '../../../db/redis/roomTransfer.js';
import type { CommandHandler }                 from '../registry.js';

type IO   = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;
type Sock = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

// Socket registry — needed to update socket.data.roomId and switch Socket.io rooms
// Injected at registration time so the handler stays testable
export function makeMoveHandler(io: IO, getSocket: (characterId: string) => Sock | undefined): CommandHandler {
  return async (command, context) => {
    if (command.type !== 'move') return;

    const { characterId, roomId } = context;
    const { direction }           = command;

    // 1. Resolve exit
    const toRoomId = await getExitTarget(roomId as RoomId, direction);
    if (!toRoomId) {
      io.to(`player:${characterId}`).emit('player:message', {
        message: `You cannot go ${direction} from here.`,
        type:    'warning',
      });
      return;
    }

    const fromRoomId = roomId as RoomId;
    const destRoomId = asRoomId(toRoomId);
    const charId     = asCharacterId(characterId);

    // 2. Atomic Redis transfer — marks character dirty for write-behind flush
    await atomicRoomTransfer(charId, fromRoomId, destRoomId);

    // 5. Switch Socket.io rooms
    const socket = getSocket(characterId);
    if (socket) {
      await socket.leave(`room:${fromRoomId}`);
      await socket.join(`room:${destRoomId}`);
      socket.data.roomId = destRoomId;
    }

    // 6. Broadcast departure to old room
    io.to(`room:${fromRoomId}`).emit('room:message', {
      from:    characterId,
      message: `leaves to the ${direction}.`,
      type:    'system',
    });

    // 7. Broadcast arrival to new room (before auto-look so others see them arrive)
    io.to(`room:${destRoomId}`).emit('room:message', {
      from:    characterId,
      message: 'arrives.',
      type:    'system',
    });

    // 8. Auto-look in new room
    const room = await getRoomWithOccupants(destRoomId);
    if (room) {
      io.to(`player:${characterId}`).emit('room:describe', {
        roomId:      destRoomId,
        name:        room.name,
        description: room.description,
        exits:       room.exits,
        occupants:   room.occupants,
      });
    }
  };
}
