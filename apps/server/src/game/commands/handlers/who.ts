import type { Server } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from '@ephemera/shared';
import type { CommandHandler } from '../registry.js';

type IO = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

export function makeWhoHandler(
  io: IO,
  getConnected: () => Array<{ characterId: string; roomId: string }>
): CommandHandler {
  return (command, context) => {
    if (command.type !== 'who') return;

    const connected = getConnected();

    if (connected.length === 0) {
      io.to(`player:${context.characterId}`).emit('player:message', {
        message: 'No one is here. The city is empty.',
        type:    'info',
      });
      return;
    }

    const lines = [
      `-- ${connected.length} soul${connected.length === 1 ? '' : 's'} in Ephemera --`,
      ...connected.map(c => `  ${c.characterId}`),
    ].join('\n');

    io.to(`player:${context.characterId}`).emit('player:message', {
      message: lines,
      type:    'info',
    });
  };
}
