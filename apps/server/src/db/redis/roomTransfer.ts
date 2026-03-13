import { getRedis }  from './client.js';
import { RedisKeys } from './keys.js';
import type { CharacterId, RoomId } from '@ephemera/shared';

// Atomically moves a character from one room to another in Redis.
// Single Lua script = no race conditions between the remove/add/update steps.
const TRANSFER_SCRIPT = `
local oldRoomKey  = KEYS[1]
local newRoomKey  = KEYS[2]
local locationKey = KEYS[3]
local dirtyKey    = KEYS[4]
local charId      = ARGV[1]
local newRoomId   = ARGV[2]

redis.call('SREM',  oldRoomKey,  charId)
redis.call('SADD',  newRoomKey,  charId)
redis.call('SET',   locationKey, newRoomId)
redis.call('SADD',  dirtyKey,    charId)
return 1
`;

export async function atomicRoomTransfer(
  characterId: CharacterId,
  fromRoomId:  RoomId,
  toRoomId:    RoomId
): Promise<void> {
  const redis = getRedis();
  await redis.eval(
    TRANSFER_SCRIPT,
    4, // number of KEYS
    RedisKeys.roomPlayers(fromRoomId),
    RedisKeys.roomPlayers(toRoomId),
    RedisKeys.playerLocation(characterId),
    RedisKeys.dirtyPlayers(),
    characterId,
    toRoomId,
  );
}
