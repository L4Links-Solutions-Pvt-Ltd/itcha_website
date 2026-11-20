// Edge-safe session helpers (used by middleware and server code). No DB access here.
import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'itcha_session';
export const SESSION_HOURS = 12;

function key() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error('SESSION_SECRET must be set (32+ characters)');
  return new TextEncoder().encode(s);
}

export async function signSession(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(key());
}

export async function verifySession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ['HS256'] });
    return payload;
  } catch {
    return null;
  }
}
