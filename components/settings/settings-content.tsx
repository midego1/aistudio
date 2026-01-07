"use client";

import { useState } from "react";
import {
  IconSettings,
  IconBuilding,
  IconUsers,
  IconUserPlus,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { WorkspaceForm } from "@/components/settings/workspace-form";
import { TeamMembersTable } from "@/components/settings/team-members-table";
import { InviteMemberDialog } from "@/components/settings/invite-member-dialog";
import type { Workspace } from "@/lib/db/schema";
import type { TeamMember } from "@/lib/mock/workspace";

interface SettingsContentProps {
  workspace: Workspace;
  members: TeamMember[];
  currentUserId: string;
}

export function SettingsContent({
  workspace,
  members,
  currentUserId,
}: SettingsContentProps) {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const activeMembers = members.filter((m) => m.status === "active").length;
  const pendingInvites = members.filter((m) => m.status === "pending").length;

  return (
    <div className="space-y-8 px-4 pb-8 md:px-6 lg:px-8">
      {/* Page header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ring-1 ring-white/10"
            style={{ backgroundColor: "var(--accent-teal)" }}
          >
            <IconSettings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your workspace and team
            </p>
          </div>
        </div>
      </div>

      {/* Workspace Section */}
      <section className="animate-fade-in-up stagger-1 space-y-4">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              backgroundColor:
                "color-mix(in oklch, var(--accent-teal) 15%, transparent)",
            }}
          >
            <IconBuilding
              className="h-4 w-4"
              style={{ color: "var(--accent-teal)" }}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Workspace</h2>
            <p className="text-sm text-muted-foreground">
              Your organization details and branding
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/5 bg-card p-6 shadow-sm">
          <WorkspaceForm workspace={workspace} />
        </div>
      </section>

      {/* Team Section */}
      <section className="animate-fade-in-up stagger-2 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                backgroundColor:
                  "color-mix(in oklch, var(--accent-teal) 15%, transparent)",
              }}
            >
              <IconUsers
                className="h-4 w-4"
                style={{ color: "var(--accent-teal)" }}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Team Members</h2>
              <p className="text-sm text-muted-foreground">
                {activeMembers} active member{activeMembers !== 1 ? "s" : ""}
                {pendingInvites > 0 && (
                  <span className="text-amber-600 dark:text-amber-400">
                    {" "}
                    &bull; {pendingInvites} pending invite
                    {pendingInvites !== 1 ? "s" : ""}
                  </span>
                )}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setInviteDialogOpen(true)}
            className="gap-2 shadow-sm hover:opacity-90 hover:shadow-md transition-all duration-200"
            style={{ backgroundColor: "var(--accent-teal)" }}
          >
            <IconUserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Invite Member</span>
          </Button>
        </div>

        <div className="rounded-2xl border border-foreground/5 bg-card shadow-sm">
          <TeamMembersTable members={members} currentUserId={currentUserId} />
        </div>
      </section>

      {/* Invite Dialog */}
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />
    </div>
  );
}
