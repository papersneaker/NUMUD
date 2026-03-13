import type { Server, Socket } from 'socket.io';
import type {
  ClientToServerEvents, ServerToClientEvents, SocketData
} from '@ephemera/shared';
import { CommandRegistry } from '../../game/commands/registry.js';

type IO     = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;
type Sock   = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

// Grace period: if player reconnects within this window, cancel logout
const GRACE_PERIOD_MS = 2 * 60 * 1000;
const gracePending    = new Map<string, ReturnType<typeof setTimeout>>();

export function registerConnectionHandler(io: IO, registry: CommandRegistry): void {
  io.on('connection', (socket: Sock) => {
    const { characterId, userId } = socket.data;
    console.log(`[Socket] Connected: char=${characterId} user=${userId} socket=${socket.id}`);

    // Cancel any pending grace-period logout for this character
    const existing = gracePending.get(characterId);
    if (existing) {
      clearTimeout(existing);
      gracePending.delete(characterId);
      console.log(`[Socket] Grace period cancelled for char=${characterId}`);
    }

    // Join the player's personal room + their current MUD room
    void socket.join(`player:${characterId}`);
    void socket.join(`room:${socket.data.roomId}`);

    // Send initial state feedback
    socket.emit('player:message', {
      message: 'Connected to Ephemera.',
      type:    'info',
    });

    // ---- player:command ----------------------------------------- //
    socket.on('player:command', ({ raw }) => {
      void registry.dispatch(raw, {
        characterId,
        roomId: socket.data.roomId,
      });
    });

    // ---- disconnect --------------------------------------------- //
    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Disconnected: char=${characterId} reason=${reason}`);

      const timer = setTimeout(() => {
        gracePending.delete(characterId);
        console.log(`[Socket] Grace period expired for char=${characterId} — removing from world`);
        // TODO: flush dirty state, remove from room occupancy set
        io.to(`room:${socket.data.roomId}`).emit('room:message', {
          from:    characterId,
          message: 'has left the city.',
          type:    'system',
        });
      }, GRACE_PERIOD_MS);

      gracePending.set(characterId, timer);
    });
  });
}
