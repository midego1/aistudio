
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from "../lib/db";
import { user } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const email = "testuser_final_test@example.com";
  console.log(`Checking user: ${email}`);
  
  try {
    const existingUser = await db.select().from(user).where(eq(user.email, email));
    
    if (existingUser.length === 0) {
      console.log("❌ User not found in database!");
    } else {
      console.log(`Found user: ${existingUser[0].id}, Verified: ${existingUser[0].emailVerified}`);
      
      if (!existingUser[0].emailVerified) {
        console.log("Updating emailVerified to true...");
        await db.update(user).set({ emailVerified: true }).where(eq(user.email, email));
        console.log("✅ User manually verified!");
      } else {
        console.log("User is already verified.");
      }
    }
  } catch (error) {
    console.error("Error updating database:", error);
  }
  process.exit(0);
}

main();
