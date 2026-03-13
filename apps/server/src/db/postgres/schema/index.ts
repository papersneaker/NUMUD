import {
  pgTable, uuid, varchar, text, integer,
  timestamp, jsonb, foreignKey, index, unique
} from 'drizzle-orm/pg-core';

// ------------------------------------------------------------------ //
// users — account-level auth only
// ------------------------------------------------------------------ //
export const users = pgTable('users', {
  id:           uuid('id').primaryKey().defaultRandom(),
  username:     varchar('username', { length: 64 }).notNull().unique(),
  email:        varchar('email',    { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().notNull(),
});

// ------------------------------------------------------------------ //
// rooms — world geography
// ------------------------------------------------------------------ //
export const rooms = pgTable('rooms', {
  id:          uuid('id').primaryKey().defaultRandom(),
  name:        varchar('name', { length: 128 }).notNull(),
  description: text('description').notNull(),
  // Extensible metadata: terrain, lighting, PvP flags, domain ownership
  properties:  jsonb('properties').notNull().default({}),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
});

// ------------------------------------------------------------------ //
// characters — one or more per user account
// ------------------------------------------------------------------ //
export const characters = pgTable('characters', {
  id:            uuid('id').primaryKey().defaultRandom(),
  userId:        uuid('user_id').notNull(),
  name:          varchar('name', { length: 64 }).notNull().unique(),
  currentRoomId: uuid('current_room_id').notNull(),

  // Typed columns for frequently-queried state
  hp:    integer('hp').notNull().default(10),
  maxHp: integer('max_hp').notNull().default(10),
  level: integer('level').notNull().default(1),
  xp:    integer('xp').notNull().default(0),

  // Flexible VtM-specific attributes
  // e.g. { strength: 2, dexterity: 3, clan: "Toreador", generation: 10 }
  stats:     jsonb('stats').notNull().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('characters_user_id_idx').on(table.userId),
  index('characters_current_room_id_idx').on(table.currentRoomId),
  foreignKey({ columns: [table.userId],        foreignColumns: [users.id] }),
  foreignKey({ columns: [table.currentRoomId], foreignColumns: [rooms.id] }),
]);

export type User      = typeof users.$inferSelect;
export type Room      = typeof rooms.$inferSelect;
export type Character = typeof characters.$inferSelect;
export type NewUser   = typeof users.$inferInsert;
export type NewRoom   = typeof rooms.$inferInsert;

// ------------------------------------------------------------------ //
// exits — adjacency list for room connections
// ------------------------------------------------------------------ //
export const exits = pgTable('exits', {
  id:          uuid('id').primaryKey().defaultRandom(),
  fromRoomId:  uuid('from_room_id').notNull(),
  toRoomId:    uuid('to_room_id').notNull(),
  direction:   varchar('direction', { length: 16 }).notNull(), // north, south, east, west, up, down
  description: text('description'),                             // optional flavour on the exit itself
  // Extensible: locked, hidden, door name, key required, etc.
  properties:  jsonb('properties').notNull().default({}),
}, (table) => [
  // One exit per direction per room — can't have two norths
  unique('exits_from_room_direction_uniq').on(table.fromRoomId, table.direction),
  index('exits_from_room_id_idx').on(table.fromRoomId),
  foreignKey({ columns: [table.fromRoomId], foreignColumns: [rooms.id] }),
  foreignKey({ columns: [table.toRoomId],   foreignColumns: [rooms.id] }),
]);

export type Exit    = typeof exits.$inferSelect;
export type NewExit = typeof exits.$inferInsert;
