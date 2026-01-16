
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from "../lib/db";
import { user } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const email = "testuser_final_test@example.com";
  console.log(`Promoting user to admin: ${email}`);
  
  try {
    // Set both role to 'admin' and isSystemAdmin to true to cover all bases
    await db.update(user)
      .set({ role: 'admin', isSystemAdmin: true })
      .where(eq(user.email, email));
      
    console.log("✅ User promoted to System Admin!");
  } catch (error) {
    console.error("Error updating database:", error);
  }
  process.exit(0);
}

main();
