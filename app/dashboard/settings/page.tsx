import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserWithWorkspace, getWorkspaceMembers } from "@/lib/db/queries";
import { SettingsContent } from "@/components/settings/settings-content";

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

  // Adapt members to TeamMember format (all active since we don't have invites yet)
  const teamMembers = members.map((member) => ({
    id: member.id,
    name: member.name,
    email: member.email,
    image: member.image,
    role: member.role as "owner" | "admin" | "member",
    status: "active" as const,
    joinedAt: member.createdAt,
  }));

  return (
    <SettingsContent
      workspace={data.workspace}
      members={teamMembers}
      currentUserId={session.user.id}
    />
  );
}
