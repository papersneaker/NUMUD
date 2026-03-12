import { createServer } from 'http';
import { Server } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from '@ephemera/shared';
import { authMiddleware }            from './network/middleware/auth.js';
import { registerConnectionHandler } from './network/handlers/connection.js';
import { CommandRegistry }           from './game/commands/registry.js';
import { getRedis }                  from './db/redis/client.js';
import { registerShutdownHandlers }  from './shutdown.js';

const PORT = Number(process.env['PORT'] ?? 3001);

// ------------------------------------------------------------------ //
// HTTP + Socket.io server
// ------------------------------------------------------------------ //
const httpServer = createServer();

const io = new Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>(httpServer, {
  cors: {
    origin:  process.env['CLIENT_ORIGIN'] ?? 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'], // no sticky-session requirement
});

// Auth middleware runs before every connection event
io.use(authMiddleware);

// Command registry — register handlers here as they're built
const registry = new CommandRegistry();
// registry.register('look',  lookHandler);
// registry.register('move',  moveHandler);
// registry.register('say',   sayHandler);

// Wire up the connection lifecycle
registerConnectionHandler(io, registry);

// ------------------------------------------------------------------ //
// Boot
// ------------------------------------------------------------------ //
async function start(): Promise<void> {
  // Verify Redis connectivity on startup
  const redis = getRedis();
  await redis.connect();
  console.log('[Redis] Connected');

  httpServer.listen(PORT, () => {
    console.log(`[Ephemera] Server listening on :${PORT}`);
    registerShutdownHandlers(httpServer, io);
  });
}

start().catch((err) => {
  console.error('[Ephemera] Fatal startup error:', err);
  process.exit(1);
});
