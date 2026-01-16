
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from "../lib/db";
import { verification } from "../lib/db/schema";
import { eq, desc } from "drizzle-orm";

async function main() {
  const email = "testuser_final_test@example.com";
  console.log(`Searching for verification token for: ${email}`);
  
  try {
    const result = await db.select()
      .from(verification)
      .where(eq(verification.identifier, email))
      .orderBy(desc(verification.createdAt))
      .limit(1);

    if (result.length > 0) {
      const token = result[0].value;
      console.log(`Token found: ${token}`);
      // Assuming standard Better Auth verification endpoint
      console.log(`VERIFICATION_LINK: http://localhost:3000/api/auth/verify-email?token=${token}&callbackURL=/en/dashboard`);
    } else {
      console.log("No token found.");
    }
  } catch (error) {
    console.error("Error querying database:", error);
  }
  process.exit(0);
}

main();
