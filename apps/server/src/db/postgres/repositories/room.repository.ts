import { eq }  from 'drizzle-orm';
import { db }  from '../client.js';
import { rooms, characters } from '../schema/index.js';
import type { RoomId } from '@ephemera/shared';

export interface RoomWithOccupants {
  id:          string;
  name:        string;
  description: string;
  exits:       string[];
  occupants:   string[];
}

export async function getRoomWithOccupants(
  roomId: RoomId
): Promise<RoomWithOccupants | null> {
  const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId));
  if (!room) return null;

  // Get character names currently in this room
  const occupantRows = await db
    .select({ name: characters.name })
    .from(characters)
    .where(eq(characters.currentRoomId, roomId));

  const occupants = occupantRows.map(r => r.name);

  // exits will come from the exits table once it's added — stub for now
  const exits: string[] = [];

  return {
    id:          room.id,
    name:        room.name,
    description: room.description,
    exits,
    occupants,
  };
}
