import { db }   from './client.js';
import { rooms, users, characters } from './schema/index.js';
import bcrypt from 'bcrypt';

async function seed(): Promise<void> {
  console.log('[Seed] Starting...');

  // ── Seed room ──────────────────────────────────────────────────
  const [existingRoom] = await db.select().from(rooms).limit(1);
  let roomId: string;

  if (existingRoom) {
    roomId = existingRoom.id;
    console.log(`[Seed] Room already exists: ${existingRoom.name}`);
  } else {
    const [room] = await db.insert(rooms).values({
      name:        'The Ember Court',
      description: 'The remnants of what was once a grand ballroom. Soot-blackened columns rise toward a collapsed ceiling open to the night sky. The air smells of old ash and cold stone. Somewhere in the darkness, something watches.',
      properties:  { domain: null, lighting: 'dim', terrain: 'interior' },
    }).returning();
    roomId = room!.id;
    console.log(`[Seed] Room created: ${room!.name} (${roomId})`);
  }

  // ── Seed test user + character ─────────────────────────────────
  const [existingUser] = await db.select().from(users).limit(1);

  if (existingUser) {
    console.log(`[Seed] User already exists: ${existingUser.username}`);
  } else {
    const passwordHash = await bcrypt.hash('testpass', 10);
    const [user] = await db.insert(users).values({
      username:     'testplayer',
      email:        'test@ephemera.local',
      passwordHash,
    }).returning();

    const [character] = await db.insert(characters).values({
      userId:        user!.id,
      name:          'Ash',
      currentRoomId: roomId,
      hp:            10,
      maxHp:         10,
      stats:         { clan: 'Toreador', generation: 12, strength: 2, dexterity: 3 },
    }).returning();

    console.log(`[Seed] User created: ${user!.username}`);
    console.log(`[Seed] Character created: ${character!.name} in room ${roomId}`);
    console.log(`[Seed] Login: testplayer / testpass`);
  }

  console.log('[Seed] Done.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed] Error:', err);
  process.exit(1);
});
