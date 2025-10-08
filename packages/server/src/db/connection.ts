import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) throw new Error('POSTGRES_URL not set');

const client = postgres(connectionString);
export const db = drizzle(client, { logger: true }); // logger in dev

export { client };
