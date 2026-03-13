import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, SocketData, RoomId } from '@ephemera/shared';
import { getRedis }    from '../../../db/redis/client.js';
import { RedisKeys }   from '../../../db/redis/keys.js';
import type { CommandHandler } from '../registry.js';

type IO   = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;
type Sock = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

export function makeQuitHandler(
  io:        IO,
  getSocket: (characterId: string) => Sock | undefined
): CommandHandler {
  return async (_command, context) => {
    const { characterId, roomId } = context;
    const redis  = getRedis();

    // 1. Remove from Redis room occupancy + location
    await redis.srem(RedisKeys.roomPlayers(roomId as RoomId), characterId);
    await redis.del(RedisKeys.playerLocation(characterId as never));
    await redis.srem(RedisKeys.dirtyPlayers(), characterId);

    // 2. Notify the room
    io.to(`room:${roomId}`).emit('room:message', {
      from:    characterId,
      message: 'slips into the shadows and is gone.',
      type:    'system',
    });

    // 3. Tell the client to return to login
    io.to(`player:${characterId}`).emit('system:announce', {
      message: 'LOGOUT',
    });

    // 4. Disconnect the socket after a short delay so the client receives the message
    const socket = getSocket(characterId);
    if (socket) {
      setTimeout(() => socket.disconnect(true), 300);
    }
  };
}
