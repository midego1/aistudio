import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Supabase Transaction mode (port 6543) requires prepare: false
const client = postgres(process.env.DATABASE_URL!, { 
  prepare: false,
  ssl: { rejectUnauthorized: false }, // Essential for Supabase Transaction pooler
  max: 1, // Essential for Serverless environments
});

export const db = drizzle(client, { schema });
