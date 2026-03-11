import jwt from 'jsonwebtoken';
import type { UserId, CharacterId } from '@ephemera/shared';

export interface TokenPayload {
  userId:      UserId;
  characterId: CharacterId;
}

const SECRET = process.env['JWT_SECRET'] ?? 'ephemera-dev-secret-change-in-prod';

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, SECRET) as TokenPayload;
}
