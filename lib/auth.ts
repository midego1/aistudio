import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "./db";
import { account, session, user, verification, workspace } from "./db/schema";
import { sendPasswordResetEmail, sendVerificationEmail } from "./email";

// Schema object for drizzle adapter
const schema = { user, session, account, verification, workspace };

// Helper to get the base URL for auth flows
function getAuthBaseUrl(): string {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const auth = betterAuth({
  baseURL: getAuthBaseUrl(),
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://www.vastgoedfotoai.nl",
    "https://vastgoed-foto-ai-nl.vercel.app",
    "https://vastgoed-foto-ai-midego.vercel.app",
  ],

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    sendResetPassword: async ({ user: resetUser, url, token }) => {
      // Construct the correct reset password URL
      // Extract token from URL if not provided directly, or use the token parameter
      let resetToken: string | undefined = token;

      if (!resetToken && url) {
        // Try to extract token from the URL
        try {
          const urlObj = new URL(url);
          // Check if token is in query params
          const tokenFromParams =
            urlObj.searchParams.get("token") ||
            urlObj.searchParams.get("resetToken");
          resetToken = tokenFromParams ?? undefined;
          // If not in query, check if it's in the path (e.g., /reset-password/token or /invite/token)
          if (!resetToken) {
            const pathParts = urlObj.pathname.split("/").filter(Boolean);
            // Look for token-like strings (long alphanumeric)
            const tokenMatch = pathParts.find((part) => part.length > 20);
            if (tokenMatch) {
              resetToken = tokenMatch;
            }
          }
        } catch {
          // If URL parsing fails, try to extract token from string
          const tokenMatch = url.match(
            /[/?](?:token|resetToken)=?([A-Za-z0-9_-]{20,})/
          );
          if (tokenMatch) {
            resetToken = tokenMatch[1];
          } else {
            // Last resort: extract any long alphanumeric string
            const lastPart = url.split("/").pop();
            if (lastPart && lastPart.length > 20) {
              resetToken = lastPart.split("?")[0].split("#")[0];
            }
          }
        }
      }

      // Build the correct reset password URL
      const baseUrl = getAuthBaseUrl();
      const resetLink = resetToken
        ? `${baseUrl}/reset-password?token=${resetToken}`
        : url; // Fallback to original URL if we can't extract token

      // Validate URL before sending
      try {
        new URL(resetLink);
        // Don't await to prevent timing attacks
        void sendPasswordResetEmail(resetUser.email, resetUser.name, resetLink);
      } catch (error) {
        console.error("Failed to construct reset password URL:", error);
        console.error("Original URL:", url);
        console.error("Extracted token:", resetToken);
        // Still try to send with original URL as fallback
        void sendPasswordResetEmail(resetUser.email, resetUser.name, url);
      }
    },
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
  },
  emailVerification: {
    sendVerificationEmail: async ({ user: verifyUser, url }) => {
      if (process.env.NODE_ENV === "development") {
        console.log("📨 Email Verification URL:", url);
      }
      await sendVerificationEmail(verifyUser.email, verifyUser.name, url);
    },
    sendOnSignUp: true,
    sendOnSignIn: true, // Resend verification on unverified sign-in attempts
    autoSignInAfterVerification: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (refresh session if older than this)
  },
  plugins: [
    admin({
      impersonationSessionDuration: 60 * 60 * 24, // 1 day
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (createdUser) => {
          // Create workspace automatically when user signs up
          const slug = createdUser.email
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-");
          const workspaceId = nanoid();

          await db.insert(workspace).values({
            id: workspaceId,
            name: `${createdUser.name}'s Workspace`,
            slug: `${slug}-${workspaceId.slice(0, 6)}`,
          });

          // Update user with workspaceId and set as owner
          await db
            .update(user)
            .set({ workspaceId, role: "owner" })
            .where(eq(user.id, createdUser.id));
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
