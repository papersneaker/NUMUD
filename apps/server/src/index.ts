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
import { makeMoveHandler }           from './game/commands/handlers/move.js';
import { getRedis }                  from './db/redis/client.js';
import { db }                        from './db/postgres/client.js';
import { characters }                from './db/postgres/schema/index.js';
import { handleLogin }               from './network/routes/auth.js';
import type { Socket }               from 'socket.io';

type Sock = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

const PORT = Number(process.env['PORT'] ?? 3001);

// ------------------------------------------------------------------ //
// Socket registry — characterId → socket
// Needed by move handler to update socket.data.roomId + switch rooms
// ------------------------------------------------------------------ //
const socketRegistry = new Map<string, Sock>();

// ------------------------------------------------------------------ //
// HTTP server
// ------------------------------------------------------------------ //
const httpServer = createServer(async (req, res) => {
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

// Auth middleware
io.use(authMiddleware);

// Character loader
io.use(async (socket, next) => {
  try {
    const [character] = await db
      .select({ currentRoomId: characters.currentRoomId })
      .from(characters)
      .where(eq(characters.id, socket.data.characterId));

    if (!character) return next(new Error('CHARACTER_NOT_FOUND'));
    socket.data.roomId = asRoomId(character.currentRoomId);
    next();
  } catch {
    next(new Error('CHARACTER_LOAD_FAILED'));
  }
});

// Track sockets by characterId for move handler
io.on('connection', (socket: Sock) => {
  socketRegistry.set(socket.data.characterId, socket);
  socket.on('disconnect', () => socketRegistry.delete(socket.data.characterId));
});

// Command registry
const registry = new CommandRegistry();
registry.register('look', makeLookHandler(io));
registry.register('move', makeMoveHandler(io, (charId) => socketRegistry.get(charId)));

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
