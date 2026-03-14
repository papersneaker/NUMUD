import { db } from './client.js';
import { rooms, exits } from './schema/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// EPHEMERA — Seed: Ash Row / Crown Street / Bail Bonds Office
// District: C2 · Region: Ash Row
// Covers:
//   - Crown Street exterior (3 segments flanking bail bonds)
//   - Unnamed alley east of bail bonds
//   - Bail Bonds Office: ground floor (2), upper floor (2), roof (2)
// ─────────────────────────────────────────────────────────────────────────────

export async function seedBailBonds() {

  // ── EXTERIOR ───────────────────────────────────────────────────────────────

  const [crownWest] = await db.insert(rooms).values({
    name: 'Crown Street — Ash Row West',
    description:
      'Crown Street runs east along the southern face of The Pyre. The building dominates the pavement here — four storeys of blast-scarred stone, windows boarded or blown out entirely, steel bracing still in place from a remediation that was never finished. The street is quieter than it should be. Foot traffic from the Loop passes through quickly.',
    properties: {
      domain: 'ash-row',
      lighting: 'dim',
      terrain: 'exterior',
      district: 'C2',
      gridRef: '9,1',
    },
  }).returning();

  const [crownFront] = await db.insert(rooms).values({
    name: 'Crown Street — Bail Bonds Front',
    description:
      'The street narrows slightly here where The Pyre\'s east face meets the bail bonds building. Two structures, one shared wall — The Pyre four storeys of ruin pressing against two storeys of intact brick. A hand-lettered board in the bail bonds window is always lit, day and night. The entrance is a plain door, glass panel, no intercom. The kind of place that does not need to advertise.',
    properties: {
      domain: 'ash-row',
      lighting: 'dim',
      terrain: 'exterior',
      district: 'C2',
      gridRef: '9,3',
    },
  }).returning();

  const [crownEast] = await db.insert(rooms).values({
    name: 'Crown Street — Ash Row East',
    description:
      'The eastern end of this Crown Street stretch, where the bail bonds building gives way to the surface lot beyond. The lot is fenced — chain-link, pay-by-phone bays, an attendant booth dark during the day. To the north a narrow alley cuts between the bail bonds east wall and the lot fence. No signage. No name on any city map.',
    properties: {
      domain: 'ash-row',
      lighting: 'dim',
      terrain: 'exterior',
      district: 'C2',
      gridRef: '9,4',
    },
  }).returning();

  const [alleyEast] = await db.insert(rooms).values({
    name: 'Unnamed Alley — East of Bail Bonds',
    description:
      'A gap between the bail bonds east wall and the chain-link fence of the surface lot. No name on any city map. The alley runs north from Crown Street, terminating at the rear of the building where the wall meets the lot boundary. Barely wide enough for two people. The ground is original cobble under a thin skin of tarmac that has cracked and lifted in sections.',
    properties: {
      domain: 'ash-row',
      lighting: 'dark',
      terrain: 'exterior',
      district: 'C2',
    },
  }).returning();

  // ── BAIL BONDS — GROUND FLOOR ──────────────────────────────────────────────

  const [bbReception] = await db.insert(rooms).values({
    name: 'Bail Bonds — Reception',
    description:
      'The public face of the operation. Front desk behind a low counter, waiting chairs bolted to the floor, a wall-mounted TV on mute showing rolling news. Bond paperwork in active use — stacks of it, clipped and annotated. Everything functional, nothing comfortable. A waiting alcove to one side holds two more chairs and a small table with outdated magazines. The door to the back office is behind the counter.',
    properties: {
      domain: 'ash-row',
      lighting: 'bright',
      terrain: 'interior',
      district: 'C2',
      building: 'bail-bonds-building',
      floor: 'ground',
      roomId: 'BB-G-01',
    },
  }).returning();

  const [bbBackOffice] = await db.insert(rooms).values({
    name: 'Bail Bonds — Back Office',
    description:
      'The bondsman\'s working space. A heavy desk, filing cabinets along two walls, a floor-bolted safe that has not moved in years. A framed photograph above the desk shows a building that no longer looks like the one outside — same bones, different skin. In the corner, a narrow internal stair leads up. Private. Not for clients.',
    properties: {
      domain: 'ash-row',
      lighting: 'dim',
      terrain: 'interior',
      district: 'C2',
      building: 'bail-bonds-building',
      floor: 'ground',
      roomId: 'BB-G-02',
    },
  }).returning();

  // ── BAIL BONDS — UPPER FLOOR ───────────────────────────────────────────────

  const [bbPassageAntechamber] = await db.insert(rooms).values({
    name: 'Bail Bonds — Passage Antechamber',
    description:
      'Presented as dead storage. Shelving units line three walls, cardboard boxes stacked with apparent purpose — dates written in marker, contents unlabelled. The west wall is the party wall with The Pyre. A section of it — door-width, reset masonry, slightly newer mortar — is the bail bonds entrance to the hidden passage. The bondsman does not open it. The boxes in front of it have not been moved in some time.',
    properties: {
      domain: 'ash-row',
      lighting: 'dim',
      terrain: 'interior',
      district: 'C2',
      building: 'bail-bonds-building',
      floor: 'upper',
      roomId: 'BB-U-02',
      featureNote: 'Hidden passage entrance — west wall, reset masonry. Blocked.',
    },
  }).returning();

  const [bbStorageLiving] = await db.insert(rooms).values({
    name: 'Bail Bonds — Storage & Living',
    description:
      'The bondsman sleeps here some nights. A cot against the north wall, archived files stacked beside it, a hotplate on a filing cabinet serving as a kitchen. The west-facing window looks directly at The Pyre\'s east wall — the shored stone, the dark windows, the bracing. The blinds are kept closed. A bathroom is partitioned off in the corner. The internal stair descends to the back office below.',
    properties: {
      domain: 'ash-row',
      lighting: 'dim',
      terrain: 'interior',
      district: 'C2',
      building: 'bail-bonds-building',
      floor: 'upper',
      roomId: 'BB-U-01',
    },
  }).returning();

  // ── BAIL BONDS — ROOF ──────────────────────────────────────────────────────

  const [bbRoofWest] = await db.insert(rooms).values({
    name: 'Bail Bonds — Roof West',
    description:
      'Flat tar roof, west half. A low parapet wall runs the perimeter. The Pyre rises two storeys above this roof on the western edge — its collapsed upper floors open to the sky, rubble crown visible from here. The height difference makes this roof a destination: sheltered on the west by the Pyre\'s bulk, open to the east. A fire escape ladder runs down the east face of the building.',
    properties: {
      domain: 'ash-row',
      lighting: 'dim',
      terrain: 'exterior',
      district: 'C2',
      building: 'bail-bonds-building',
      floor: 'roof',
      roomId: 'BB-R-01',
    },
  }).returning();

  const [bbRoofEast] = await db.insert(rooms).values({
    name: 'Bail Bonds — Roof East',
    description:
      'Flat tar roof, east half. Parapet wall. The surface lot stretches east below — twelve bays, a dark attendant booth, the drain in the centre that still connects to The Pyre\'s original drainage. The fire escape ladder is accessible from this side, descending to the alley below. At night the light in the attendant booth is on.',
    properties: {
      domain: 'ash-row',
      lighting: 'dim',
      terrain: 'exterior',
      district: 'C2',
      building: 'bail-bonds-building',
      floor: 'roof',
      roomId: 'BB-R-02',
    },
  }).returning();

  // ── EXIT WIRING ────────────────────────────────────────────────────────────

  await db.insert(exits).values([

    // Crown Street east-west movement
    {
      fromRoomId: crownWest!.id,
      toRoomId:   crownFront!.id,
      direction:  'east',
      description: 'Crown Street continues east past the Pyre\'s face toward the bail bonds building.',
    },
    {
      fromRoomId: crownFront!.id,
      toRoomId:   crownWest!.id,
      direction:  'west',
    },
    {
      fromRoomId: crownFront!.id,
      toRoomId:   crownEast!.id,
      direction:  'east',
    },
    {
      fromRoomId: crownEast!.id,
      toRoomId:   crownFront!.id,
      direction:  'west',
    },

    // Alley off Crown Street east
    {
      fromRoomId: crownEast!.id,
      toRoomId:   alleyEast!.id,
      direction:  'north',
      description: 'A gap between the bail bonds east wall and the lot fence. No name. No signage.',
    },
    {
      fromRoomId: alleyEast!.id,
      toRoomId:   crownEast!.id,
      direction:  'south',
    },

    // Bail bonds entrance from street
    {
      fromRoomId:  crownFront!.id,
      toRoomId:    bbReception!.id,
      direction:   'north',
      description: 'A plain door, glass panel. The hand-lettered board beside it reads: BAIL BONDS — 24HR.',
    },
    {
      fromRoomId:  bbReception!.id,
      toRoomId:    crownFront!.id,
      direction:   'south',
      description: 'The front door. Crown Street beyond.',
    },

    // Ground floor internal
    {
      fromRoomId:  bbReception!.id,
      toRoomId:    bbBackOffice!.id,
      direction:   'east',
      description: 'A door behind the counter. Staff only.',
    },
    {
      fromRoomId:  bbBackOffice!.id,
      toRoomId:    bbReception!.id,
      direction:   'west',
    },

    // Internal stair — ground to upper
    {
      fromRoomId:  bbBackOffice!.id,
      toRoomId:    bbStorageLiving!.id,
      direction:   'up',
      description: 'A narrow internal stair, steep and uncarpeted.',
    },
    {
      fromRoomId:  bbStorageLiving!.id,
      toRoomId:    bbBackOffice!.id,
      direction:   'down',
    },

    // Upper floor internal
    {
      fromRoomId:  bbStorageLiving!.id,
      toRoomId:    bbPassageAntechamber!.id,
      direction:   'west',
    },
    {
      fromRoomId:  bbPassageAntechamber!.id,
      toRoomId:    bbStorageLiving!.id,
      direction:   'east',
    },

    // Stair — upper to roof
    {
      fromRoomId:  bbStorageLiving!.id,
      toRoomId:    bbRoofEast!.id,
      direction:   'up',
      description: 'A hatch in the ceiling, ladder fixed to the wall.',
    },
    {
      fromRoomId:  bbRoofEast!.id,
      toRoomId:    bbStorageLiving!.id,
      direction:   'down',
    },

    // Roof internal
    {
      fromRoomId:  bbRoofEast!.id,
      toRoomId:    bbRoofWest!.id,
      direction:   'west',
    },
    {
      fromRoomId:  bbRoofWest!.id,
      toRoomId:    bbRoofEast!.id,
      direction:   'east',
    },

    // Fire escape — upper floor window to alley (east face)
    // One-way down only: climbing up requires Athletics check (engine-side enforcement)
    {
      fromRoomId:  bbStorageLiving!.id,
      toRoomId:    alleyEast!.id,
      direction:   'east',
      description: 'A window onto the fire escape. The ladder descends to the alley below.',
      properties:  { type: 'window', climbDown: true, climbUpRequiresCheck: true },
    },

    // Fire escape — roof to alley (locked gate at ground — covered by alley exit above)
    {
      fromRoomId:  bbRoofEast!.id,
      toRoomId:    alleyEast!.id,
      direction:   'east',
      description: 'The fire escape ladder runs down the east face of the building to the alley.',
      properties:  { type: 'fireEscape', climbDown: true, climbUpRequiresCheck: true },
    },

  ]);

  console.log('Seeded: Crown Street / Bail Bonds Office — 10 rooms, 22 exits');
}
