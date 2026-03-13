import { db }   from './client.js';
import { rooms, users, characters, exits } from './schema/index.js';
import { eq }   from 'drizzle-orm';
import bcrypt   from 'bcrypt';

async function seed(): Promise<void> {
  console.log('[Seed] Starting...');

  // ── Rooms ──────────────────────────────────────────────────────
  const existingRooms = await db.select().from(rooms);
  let emberCourtId: string;
  let vestibuleId:  string;

  if (existingRooms.length >= 2) {
    emberCourtId = existingRooms[0]!.id;
    vestibuleId  = existingRooms[1]!.id;
    console.log('[Seed] Rooms already exist, skipping');
  } else {
    // Clear any partial seed
    await db.delete(exits);
    await db.delete(characters);
    await db.delete(users);
    await db.delete(rooms);

    const [emberCourt] = await db.insert(rooms).values({
      name:        'The Ember Court',
      description: 'The remnants of what was once a grand ballroom. Soot-blackened columns rise toward a collapsed ceiling open to the night sky. The air smells of old ash and cold stone. Somewhere in the darkness, something watches.',
      properties:  { domain: null, lighting: 'dim', terrain: 'interior' },
    }).returning();

    const [vestibule] = await db.insert(rooms).values({
      name:        'The Vestibule',
      description: 'A narrow antechamber with a cracked marble floor. Tattered velvet drapes hang across the archways. The smell of the street bleeds in through gaps in the masonry. To the south, the ballroom yawns open.',
      properties:  { domain: null, lighting: 'dark', terrain: 'interior' },
    }).returning();

    emberCourtId = emberCourt!.id;
    vestibuleId  = vestibule!.id;

    // Wire exits both directions
    await db.insert(exits).values([
      {
        fromRoomId:  emberCourtId,
        toRoomId:    vestibuleId,
        direction:   'north',
        description: 'A crumbling archway leads north into shadow.',
      },
      {
        fromRoomId:  vestibuleId,
        toRoomId:    emberCourtId,
        direction:   'south',
        description: 'The ruined ballroom opens to the south.',
      },
    ]);

    console.log(`[Seed] Created: The Ember Court (${emberCourtId})`);
    console.log(`[Seed] Created: The Vestibule  (${vestibuleId})`);
    console.log('[Seed] Exits wired: north/south');
  }

  // ── User + Character ───────────────────────────────────────────
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
      currentRoomId: emberCourtId,
      hp:            10,
      maxHp:         10,
      stats:         { clan: 'Toreador', generation: 12, strength: 2, dexterity: 3 },
    }).returning();

    console.log(`[Seed] User created:      ${user!.username}`);
    console.log(`[Seed] Character created: ${character!.name}`);
    console.log(`[Seed] Login:             testplayer / testpass`);
  }

  console.log('[Seed] Done.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed] Error:', err);
  process.exit(1);
});
