import type { Server } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, SocketData, RoomId } from '@ephemera/shared';
import { getRoomWithOccupants } from '../../../db/postgres/repositories/room.repository.js';
import type { CommandHandler } from '../registry.js';

type IO = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

export function makeLookHandler(io: IO): CommandHandler {
  return async (_command, context) => {
    const room = await getRoomWithOccupants(context.roomId as RoomId);

    if (!room) {
      io.to(`player:${context.characterId}`).emit('player:message', {
        message: 'You are nowhere. This should not happen.',
        type:    'error',
      });
      return;
    }

    io.to(`player:${context.characterId}`).emit('room:describe', {
      roomId:      room.id as RoomId,
      name:        room.name,
      description: room.description,
      exits:       room.exits,
      occupants:   room.occupants,
    });
  };
}
