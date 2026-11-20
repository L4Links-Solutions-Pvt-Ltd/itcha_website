import 'server-only';
import { neon, neonConfig } from '@neondatabase/serverless';

// Local testing only: point the driver at a Neon-HTTP-compatible proxy instead of Neon.
if (process.env.NEON_FETCH_ENDPOINT) neonConfig.fetchEndpoint = process.env.NEON_FETCH_ENDPOINT;

let client;
export function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  client ??= neon(process.env.DATABASE_URL);
  return client;
}

export const hasDb = () => Boolean(process.env.DATABASE_URL);
