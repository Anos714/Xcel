import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { env } from "../config/env";

const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql });
