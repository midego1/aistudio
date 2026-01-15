import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getInvitationByTokenAction } from "@/lib/actions/invitations";
import { auth } from "@/lib/auth";
import { constructMetadata } from "@/lib/constructMetadata";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { InviteAcceptForm } from "./invite-accept-form";

export const metadata = constructMetadata({
  title: "Accept Invitation | Proppi",
  description: "Join a workspace on Proppi",
  noIndex: true,
});

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  const result = await getInvitationByTokenAction(token);

  if (!result.success) {
    notFound();
  }

  const { invitation, workspaceName, isExpired, isAccepted } = result.data;

  // Check if user with this email already exists
  const [existingUser] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, invitation.email.toLowerCase()));

  const hasExistingAccount = Boolean(existingUser);

  // Check if current user is logged in
  const session = await auth.api.getSession({ headers: await headers() });
  const isLoggedIn = Boolean(session?.user);
  const loggedInEmail = session?.user?.email;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <InviteAcceptForm
          email={invitation.email}
          hasExistingAccount={hasExistingAccount}
          isAccepted={isAccepted}
          isExpired={isExpired}
          isLoggedIn={isLoggedIn}
          loggedInEmail={loggedInEmail}
          role={invitation.role}
          token={token}
          workspaceName={workspaceName}
        />
      </div>
    </div>
  );
}
