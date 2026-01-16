"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user, workspace } from "@/lib/db/schema";

export interface WorkspaceActionResult {
  success: boolean;
  error?: string;
}

export async function updateWorkspaceSettings(
  formData: FormData
): Promise<WorkspaceActionResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // Get current user to find workspace and check permissions
  const currentUser = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!currentUser[0]?.workspaceId) {
    return { success: false, error: "Workspace not found" };
  }

  // Check if user is owner or admin
  if (currentUser[0].role !== "owner" && currentUser[0].role !== "admin") {
    return { success: false, error: "Insufficient permissions" };
  }

  const name = formData.get("name") as string;
  const organizationNumber =
    (formData.get("organizationNumber") as string) || null;
  const contactEmail = (formData.get("contactEmail") as string) || null;
  const contactPerson = (formData.get("contactPerson") as string) || null;

  // Validate required fields
  if (!name) {
    return { success: false, error: "Workspace name is required" };
  }

  // Update workspace
  await db
    .update(workspace)
    .set({
      name,
      organizationNumber,
      contactEmail,
      contactPerson,
      updatedAt: new Date(),
    })
    .where(eq(workspace.id, currentUser[0].workspaceId));

  // Also update the user's name if contact person is provided
  // This ensures the global user profile stays in sync with the workspace contact
  if (contactPerson) {
    await db
      .update(user)
      .set({
        name: contactPerson,
        updatedAt: new Date(),
      })
      .where(eq(user.id, currentUser[0].id));
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateMemberRole(
  memberId: string,
  newRole: "admin" | "member"
): Promise<WorkspaceActionResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // Get current user to check permissions
  const currentUser = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!currentUser[0]?.workspaceId) {
    return { success: false, error: "Workspace not found" };
  }

  // Only owner can change roles
  if (currentUser[0].role !== "owner") {
    return { success: false, error: "Only workspace owner can change roles" };
  }

  // Get the target member
  const targetMember = await db
    .select()
    .from(user)
    .where(eq(user.id, memberId))
    .limit(1);

  if (!targetMember[0]) {
    return { success: false, error: "Member not found" };
  }

  // Check target is in same workspace
  if (targetMember[0].workspaceId !== currentUser[0].workspaceId) {
    return { success: false, error: "Member not in your workspace" };
  }

  // Cannot change owner's role
  if (targetMember[0].role === "owner") {
    return { success: false, error: "Cannot change owner's role" };
  }

  // Cannot change own role
  if (targetMember[0].id === currentUser[0].id) {
    return { success: false, error: "Cannot change your own role" };
  }

  // Update the role
  await db.update(user).set({ role: newRole }).where(eq(user.id, memberId));

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function removeMember(
  memberId: string
): Promise<WorkspaceActionResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // Get current user to check permissions
  const currentUser = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!currentUser[0]?.workspaceId) {
    return { success: false, error: "Workspace not found" };
  }

  // Only owner or admin can remove members
  if (currentUser[0].role !== "owner" && currentUser[0].role !== "admin") {
    return { success: false, error: "Insufficient permissions" };
  }

  // Get the target member
  const targetMember = await db
    .select()
    .from(user)
    .where(eq(user.id, memberId))
    .limit(1);

  if (!targetMember[0]) {
    return { success: false, error: "Member not found" };
  }

  // Check target is in same workspace
  if (targetMember[0].workspaceId !== currentUser[0].workspaceId) {
    return { success: false, error: "Member not in your workspace" };
  }

  // Cannot remove owner
  if (targetMember[0].role === "owner") {
    return { success: false, error: "Cannot remove workspace owner" };
  }

  // Cannot remove yourself
  if (targetMember[0].id === currentUser[0].id) {
    return { success: false, error: "Cannot remove yourself" };
  }

  // Admin cannot remove other admins (only owner can)
  if (currentUser[0].role === "admin" && targetMember[0].role === "admin") {
    return { success: false, error: "Admins cannot remove other admins" };
  }

  // Remove the member by clearing their workspaceId
  await db
    .update(user)
    .set({ workspaceId: null, role: "member" })
    .where(eq(user.id, memberId));

  revalidatePath("/dashboard/settings");
  return { success: true };
}
