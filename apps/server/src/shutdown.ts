import type { Server as HttpServer } from 'http';
import type { Server as IOServer } from 'socket.io';
import { closeRedis }  from './db/redis/client.js';
import { stopFlushJob, flushNow } from './db/redis/flushJob.js';

const SHUTDOWN_TIMEOUT_MS = 5000;

export function registerShutdownHandlers(
  httpServer: HttpServer,
  io: IOServer
): void {

  async function shutdown(signal: string): Promise<void> {
    console.log(`\n[Ephemera] ${signal} received — shutting down gracefully...`);

    // Stop accepting new connections
    io.close();
    console.log('[Ephemera] Socket.io closed');

    // Stop flush interval then do one final flush
    stopFlushJob();
    await flushNow();

    // Close Redis
    await closeRedis();
    console.log('[Redis] Connection closed');

    // Close HTTP server
    httpServer.close(() => {
      console.log('[Ephemera] HTTP server closed — goodbye');
      process.exit(0);
    });

    // Force exit if clean shutdown takes too long
    setTimeout(() => {
      console.error('[Ephemera] Shutdown timeout — forcing exit');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS).unref();
  }

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT',  () => void shutdown('SIGINT'));
}
