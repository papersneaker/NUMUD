import type { CharacterId, RoomId } from '@ephemera/shared';

// ------------------------------------------------------------------ //
// Redis key factory — all key patterns in one place
// ------------------------------------------------------------------ //
export const RedisKeys = {
  // String — JWT session token, TTL 24h
  session:          (token: string)              => `session:${token}`,

  // Hash — hot player state { hp, maxHp, name, ... }
  playerState:      (id: CharacterId)            => `player:${id}:state`,

  // String — current room id for fast location lookup
  playerLocation:   (id: CharacterId)            => `player:${id}:location`,

  // Set — character IDs currently in a room
  roomPlayers:      (id: RoomId)                 => `room:${id}:players`,

  // Set — character IDs whose location is dirty (needs Postgres flush)
  dirtyPlayers:     ()                           => `dirty:players`,

  // String with TTL — cooldown shadow key, presence = on cooldown
  cooldown:         (id: CharacterId, ability: string) => `cooldown:${id}:${ability}`,
} as const;

export const SESSION_TTL_SECONDS = 86_400; // 24 hours
export const FLUSH_INTERVAL_MS   = 30_000; // 30 second write-behind flush
