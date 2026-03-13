import type { Server } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from '@ephemera/shared';
import type { CommandHandler } from '../registry.js';

type IO = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

export function makeSayHandler(io: IO): CommandHandler {
  return (command, context) => {
    if (command.type !== 'say') return;

    const { message }     = command;
    const { characterId, roomId } = context;

    if (!message.trim()) return;

    // Broadcast to everyone in the room including the speaker
    io.to(`room:${roomId}`).emit('room:message', {
      from:    characterId,
      message: `says "${message}"`,
      type:    'say',
    });
  };
}
