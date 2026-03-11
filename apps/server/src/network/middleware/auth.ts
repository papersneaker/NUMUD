import type { Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from '@ephemera/shared';
import { verifyToken } from '../../auth/jwt.js';
import { asRoomId } from '@ephemera/shared';

type EphemeraSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

export function authMiddleware(
  socket: EphemeraSocket,
  next: (err?: Error) => void
): void {
  const token = socket.handshake.auth['token'] as string | undefined;

  if (!token) {
    return next(new Error('AUTH_MISSING'));
  }

  try {
    const payload = verifyToken(token);
    // Attach to socket.data — accessible in all handlers without re-parsing
    socket.data.userId      = payload.userId;
    socket.data.characterId = payload.characterId;
    socket.data.roomId      = asRoomId(''); // populated on load
    next();
  } catch {
    next(new Error('AUTH_INVALID'));
  }
}
