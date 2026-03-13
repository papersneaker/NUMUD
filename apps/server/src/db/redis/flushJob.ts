import { eq }        from 'drizzle-orm';
import { getRedis }  from './client.js';
import { RedisKeys, FLUSH_INTERVAL_MS } from './keys.js';
import { db }        from '../postgres/client.js';
import { characters } from '../postgres/schema/index.js';

let flushTimer: ReturnType<typeof setInterval> | null = null;

export function startFlushJob(): void {
  if (flushTimer) return;

  flushTimer = setInterval(async () => {
    const redis = getRedis();

    // Pop all dirty character IDs atomically
    const dirtyKey = RedisKeys.dirtyPlayers();
    const dirtyIds = await redis.smembers(dirtyKey);
    if (dirtyIds.length === 0) return;

    console.log(`[FlushJob] Flushing ${dirtyIds.length} dirty character(s) to Postgres`);

    await Promise.all(dirtyIds.map(async (characterId) => {
      const locationKey = RedisKeys.playerLocation(characterId as never);
      const roomId      = await redis.get(locationKey);
      if (!roomId) return;

      await db
        .update(characters)
        .set({ currentRoomId: roomId, updatedAt: new Date() })
        .where(eq(characters.id, characterId));

      // Remove from dirty set after successful flush
      await redis.srem(dirtyKey, characterId);
    }));

    console.log(`[FlushJob] Flush complete`);
  }, FLUSH_INTERVAL_MS);

  console.log(`[FlushJob] Started — flushing every ${FLUSH_INTERVAL_MS / 1000}s`);
}

export function stopFlushJob(): void {
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
    console.log('[FlushJob] Stopped');
  }
}

// Final flush on shutdown — call this before process.exit
export async function flushNow(): Promise<void> {
  const redis   = getRedis();
  const dirtyKey = RedisKeys.dirtyPlayers();
  const dirtyIds = await redis.smembers(dirtyKey);
  if (dirtyIds.length === 0) return;

  console.log(`[FlushJob] Final flush: ${dirtyIds.length} character(s)`);
  await Promise.all(dirtyIds.map(async (characterId) => {
    const roomId = await redis.get(RedisKeys.playerLocation(characterId as never));
    if (!roomId) return;
    await db
      .update(characters)
      .set({ currentRoomId: roomId, updatedAt: new Date() })
      .where(eq(characters.id, characterId));
    await redis.srem(dirtyKey, characterId);
  }));
}
