import { and, eq, gt, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SettingsContent } from "@/components/settings/settings-content";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserWithWorkspace, getWorkspaceMembers } from "@/lib/db/queries";
import { invitation } from "@/lib/db/schema";

export default async function SettingsPage() {
  // Get session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // Get user with workspace
  const data = await getUserWithWorkspace(session.user.id);

  if (!data) {
    redirect("/onboarding");
  }

  // Get workspace members
  const members = await getWorkspaceMembers(data.workspace.id);

  // Get pending invitations
  const pendingInvitations = await db
    .select({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      token: invitation.token,
      createdAt: invitation.createdAt,
    })
    .from(invitation)
    .where(
      and(
        eq(invitation.workspaceId, data.workspace.id),
        isNull(invitation.acceptedAt),
        gt(invitation.expiresAt, new Date())
      )
    );

  // Adapt members to TeamMember format
  const teamMembers = [
    // Active members
    ...members.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      image: member.image,
      role: member.role as "owner" | "admin" | "member",
      status: "active" as const,
      joinedAt: member.createdAt,
    })),
    // Pending invitations
    ...pendingInvitations.map((inv) => ({
      id: inv.id,
      name: inv.email.split("@")[0], // Use email prefix as name
      email: inv.email,
      image: null,
      role: inv.role as "owner" | "admin" | "member",
      status: "pending" as const,
      joinedAt: inv.createdAt,
      inviteToken: inv.token, // Include token for resend/cancel actions
    })),
  ];

  return (
    <SettingsContent
      currentUserId={session.user.id}
      members={teamMembers}
      workspace={data.workspace}
    />
  );
}
