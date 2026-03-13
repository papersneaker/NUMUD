import { createServer }              from 'http';
import { Server }                    from 'socket.io';
import { eq }                        from 'drizzle-orm';
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from '@ephemera/shared';
import { asRoomId }                  from '@ephemera/shared';
import { authMiddleware }            from './network/middleware/auth.js';
import { registerConnectionHandler } from './network/handlers/connection.js';
import { registerShutdownHandlers }  from './shutdown.js';
import { CommandRegistry }           from './game/commands/registry.js';
import { makeLookHandler }           from './game/commands/handlers/look.js';
import { getRedis }                  from './db/redis/client.js';
import { db }                        from './db/postgres/client.js';
import { characters }                from './db/postgres/schema/index.js';
import { handleLogin }               from './network/routes/auth.js';

const PORT = Number(process.env['PORT'] ?? 3001);

// ------------------------------------------------------------------ //
// HTTP server — handles REST routes before Socket.io takes over
// ------------------------------------------------------------------ //
const httpServer = createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' });
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/auth/login') {
    await handleLogin(req, res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// ------------------------------------------------------------------ //
// Socket.io
// ------------------------------------------------------------------ //
const io = new Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>(httpServer, {
  cors: {
    origin:  process.env['CLIENT_ORIGIN'] ?? 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket'],
});

// Auth middleware — validates JWT, populates socket.data.userId + characterId
io.use(authMiddleware);

// Character loader — runs after auth, populates socket.data.roomId from Postgres
io.use(async (socket, next) => {
  try {
    const [character] = await db
      .select({ currentRoomId: characters.currentRoomId })
      .from(characters)
      .where(eq(characters.id, socket.data.characterId));

    if (!character) return next(new Error('CHARACTER_NOT_FOUND'));

    socket.data.roomId = asRoomId(character.currentRoomId);
    next();
  } catch (err) {
    next(new Error('CHARACTER_LOAD_FAILED'));
  }
});

// Command registry
const registry = new CommandRegistry();
registry.register('look', makeLookHandler(io));

// Connection lifecycle
registerConnectionHandler(io, registry);

// ------------------------------------------------------------------ //
// Boot
// ------------------------------------------------------------------ //
async function start(): Promise<void> {
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
