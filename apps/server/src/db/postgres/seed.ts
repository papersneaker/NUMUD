import { db }   from './client.js';
import { rooms, users, characters, exits } from './schema/index.js';
import { eq }   from 'drizzle-orm';
import bcrypt   from 'bcrypt';
import { seedBailBonds } from './seed_bail_bonds.js';

async function seed(): Promise<void> {
  console.log('[Seed] Starting...');

  // ── Rooms ──────────────────────────────────────────────────────
  const existingRooms = await db.select().from(rooms);

  let emberCourtId: string;

  if (existingRooms.length > 0) {
    emberCourtId = existingRooms[0]!.id;
    console.log(`[Seed] ${existingRooms.length} room(s) already exist, skipping base rooms`);
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

    await db.insert(exits).values([
      {
        fromRoomId:  emberCourtId,
        toRoomId:    vestibule!.id,
        direction:   'north',
        description: 'A crumbling archway leads north into shadow.',
      },
      {
        fromRoomId:  vestibule!.id,
        toRoomId:    emberCourtId,
        direction:   'south',
        description: 'The ruined ballroom opens to the south.',
      },
    ]);

    console.log(`[Seed] Created: The Ember Court + The Vestibule`);
  }

  // ── Bail Bonds block ───────────────────────────────────────────
  const bailBondsExists = existingRooms.some(r => r.name.startsWith('Crown Street'));
  if (bailBondsExists) {
    console.log('[Seed] Bail bonds rooms already exist, skipping');
  } else {
    await seedBailBonds();
  }

  // ── User + Character ───────────────────────────────────────────
  // Starting room is Crown Street — Bail Bonds Front
  const [crownFrontRoom] = await db
    .select()
    .from(rooms)
    .where(eq(rooms.name, 'Crown Street — Bail Bonds Front'));

  const startRoomId = crownFrontRoom?.id ?? emberCourtId;

  const [existingUser] = await db.select().from(users).limit(1);

  if (existingUser) {
    console.log(`[Seed] User already exists: ${existingUser.username}`);
    // Relocate existing character to the correct starting room
    if (crownFrontRoom) {
      await db
        .update(characters)
        .set({ currentRoomId: crownFrontRoom.id, updatedAt: new Date() })
        .where(eq(characters.userId, existingUser.id));
      console.log(`[Seed] Character relocated to: Crown Street — Bail Bonds Front`);
    }
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
      currentRoomId: startRoomId,
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
