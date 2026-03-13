import type { IncomingMessage, ServerResponse } from 'http';
import bcrypt   from 'bcrypt';
import { db }   from '../../db/postgres/client.js';
import { users, characters } from '../../db/postgres/schema/index.js';
import { eq }   from 'drizzle-orm';
import { signToken } from '../../auth/jwt.js';
import { asUserId, asCharacterId } from '@ephemera/shared';

function json(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type':                'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(payload);
}

export async function handleLogin(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  // Read body
  const body = await new Promise<string>((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer) => { data += chunk.toString(); });
    req.on('end',   () => resolve(data));
    req.on('error', reject);
  });

  let username: string, password: string;
  try {
    ({ username, password } = JSON.parse(body) as { username: string; password: string });
  } catch {
    return json(res, 400, { error: 'Invalid JSON' });
  }

  if (!username || !password) {
    return json(res, 400, { error: 'username and password required' });
  }

  // Look up user
  const [user] = await db.select().from(users).where(eq(users.username, username));
  if (!user) return json(res, 401, { error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return json(res, 401, { error: 'Invalid credentials' });

  // Get first character for this user
  const [character] = await db.select().from(characters).where(eq(characters.userId, user.id));
  if (!character) return json(res, 404, { error: 'No character found for this account' });

  const token = signToken({
    userId:      asUserId(user.id),
    characterId: asCharacterId(character.id),
  });

  json(res, 200, { token, characterName: character.name });
}
