import type { GameCommand, Direction } from '@ephemera/shared';

// Handler receives the parsed command and the character ID of the issuer
export type CommandContext = {
  characterId: string;
  roomId:      string;
};

export type CommandHandler = (
  command:  GameCommand,
  context:  CommandContext
) => Promise<void> | void;

// ------------------------------------------------------------------ //
// Parser — raw string → GameCommand
// ------------------------------------------------------------------ //
const DIRECTIONS = new Set<Direction>(['north','south','east','west','up','down']);
const DIRECTION_ALIASES: Record<string, Direction> = {
  n: 'north', s: 'south', e: 'east', w: 'west', u: 'up', d: 'down',
};

// Verb aliases → canonical verb
const VERB_ALIASES: Record<string, string> = {
  l:    'look',
  go:   'move',
  move: 'move',
  say:  'say',
  "'":  'say',
  who:  'who',
  quit: 'quit',
  exit: 'quit',
};

export function parseCommand(raw: string): GameCommand {
  const trimmed = raw.trim();
  if (!trimmed) return { type: 'unknown', raw };

  // Handle shorthand direction (just "n", "sw", etc.)
  const maybeDirAlias = DIRECTION_ALIASES[trimmed.toLowerCase()];
  if (maybeDirAlias) return { type: 'move', direction: maybeDirAlias };

  const [verb = '', ...rest] = trimmed.split(/\s+/);
  const canonical = VERB_ALIASES[verb.toLowerCase()] ?? verb.toLowerCase();

  switch (canonical) {
    case 'look':
      return { type: 'look', target: rest.length > 0 ? rest.join(' ') : undefined };

    case 'move': {
      const dir = rest[0]?.toLowerCase();
      const resolved = dir ? (DIRECTION_ALIASES[dir] ?? (DIRECTIONS.has(dir as Direction) ? dir as Direction : null)) : null;
      if (!resolved) return { type: 'unknown', raw };
      return { type: 'move', direction: resolved };
    }

    case 'say':
      return { type: 'say', message: rest.join(' ') };

    case 'who':
      return { type: 'who' };

    case 'quit':
      return { type: 'quit' };

    default:
      return { type: 'unknown', raw };
  }
}

// ------------------------------------------------------------------ //
// Registry — Map<verb, handler>
// ------------------------------------------------------------------ //
export class CommandRegistry {
  private readonly handlers = new Map<string, CommandHandler>();

  register(verb: GameCommand['type'], handler: CommandHandler): void {
    this.handlers.set(verb, handler);
  }

  async dispatch(raw: string, context: CommandContext): Promise<void> {
    const command = parseCommand(raw);
    const handler = this.handlers.get(command.type);
    if (handler) {
      await handler(command, context);
    } else {
      // 'unknown' falls through here — caller should emit feedback to player
      console.warn(`[CommandRegistry] No handler for command type: ${command.type}`);
    }
  }
}
