// All valid parsed commands. Add a new variant here and TypeScript
// will immediately flag every switch that doesn't handle it.

export type Direction = 'north' | 'south' | 'east' | 'west' | 'up' | 'down';

export type GameCommand =
  | { type: 'look';   target?: string }
  | { type: 'move';   direction: Direction }
  | { type: 'say';    message: string }
  | { type: 'who' }
  | { type: 'quit' }
  | { type: 'unknown'; raw: string };

// Persistence hint — write-through commands bypass the 30s flush
export type PersistenceMode = 'deferred' | 'immediate';

export interface CommandMeta {
  persistence: PersistenceMode;
}

// Registry entry type used by CommandRegistry in the server
export interface CommandRegistryEntry {
  meta:    CommandMeta;
  aliases: string[];
}
