import { eq, and } from 'drizzle-orm';
import { db }      from '../client.js';
import { rooms, characters, exits } from '../schema/index.js';
import type { RoomId } from '@ephemera/shared';

export interface RoomWithOccupants {
  id:          string;
  name:        string;
  description: string;
  exits:       string[];            // direction labels for display
  exitMap:     Map<string, string>; // direction → toRoomId for movement
  occupants:   string[];
}

export async function getRoomWithOccupants(
  roomId: RoomId
): Promise<RoomWithOccupants | null> {
  const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId));
  if (!room) return null;

  const [occupantRows, exitRows] = await Promise.all([
    db.select({ name: characters.name })
      .from(characters)
      .where(eq(characters.currentRoomId, roomId)),
    db.select({ direction: exits.direction, toRoomId: exits.toRoomId })
      .from(exits)
      .where(eq(exits.fromRoomId, roomId)),
  ]);

  const exitMap = new Map<string, string>();
  for (const exit of exitRows) exitMap.set(exit.direction, exit.toRoomId);

  return {
    id:          room.id,
    name:        room.name,
    description: room.description,
    exits:       [...exitMap.keys()],
    exitMap,
    occupants:   occupantRows.map(r => r.name),
  };
}

export async function getExitTarget(
  fromRoomId: RoomId,
  direction:  string
): Promise<string | null> {
  const [exit] = await db
    .select({ toRoomId: exits.toRoomId })
    .from(exits)
    .where(and(
      eq(exits.fromRoomId, fromRoomId),
      eq(exits.direction,  direction)
    ));
  return exit?.toRoomId ?? null;
}
