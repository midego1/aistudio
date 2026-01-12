"use client";

import {
  IconCheck,
  IconCopy,
  IconLoader2,
  IconMail,
  IconShield,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";
import type * as React from "react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWorkspaceMemberInvitation } from "@/lib/actions/invitations";
import type { UserRole } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleOptions: {
  value: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "admin",
    label: "Admin",
    description: "Can manage workspace settings and invite members",
    icon: <IconShield className="h-5 w-5" />,
  },
  {
    value: "member",
    label: "Member",
    description: "Can create and manage their own projects",
    icon: <IconUser className="h-5 w-5" />,
  },
];

export function InviteMemberDialog({
  open,
  onOpenChange,
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("member");
  const [isPending, startTransition] = useTransition();
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      return;
    }

    startTransition(async () => {
      const result = await createWorkspaceMemberInvitation(email, role);
      if (result.success) {
        setInviteUrl(result.data.inviteUrl);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleCopyLink = async () => {
    if (!inviteUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleClose = () => {
    if (!isPending) {
      setEmail("");
      setRole("member");
      setInviteUrl(null);
      setCopied(false);
      onOpenChange(false);
    }
  };

  const handleCreateAnother = () => {
    setEmail("");
    setRole("member");
    setInviteUrl(null);
    setCopied(false);
  };

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="overflow-hidden p-0" size="default">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  backgroundColor:
                    "color-mix(in oklch, var(--accent-teal) 15%, transparent)",
                }}
              >
                <IconUserPlus
                  className="h-4 w-4"
                  style={{ color: "var(--accent-teal)" }}
                />
              </div>
              Invite Team Member
            </DialogTitle>
            <DialogDescription>
              {inviteUrl
                ? "Share this link with your team member"
                : "Create an invitation link to share"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <form className="space-y-6 p-6" onSubmit={handleSubmit}>
          {/* Success state with invite link */}
          {inviteUrl ? (
            <div className="animate-fade-in-up space-y-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      "color-mix(in oklch, var(--accent-green) 15%, transparent)",
                  }}
                >
                  <IconCheck
                    className="h-8 w-8"
                    style={{ color: "var(--accent-green)" }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-lg">Invitation Created!</p>
                  <p className="text-muted-foreground text-sm">
                    Share this link with {email}
                  </p>
                </div>
              </div>

              {/* Copyable link */}
              <div className="space-y-2">
                <Label className="font-medium text-sm">Invitation Link</Label>
                <div className="flex gap-2">
                  <Input
                    className="flex-1 font-mono text-sm"
                    onClick={(e) => e.currentTarget.select()}
                    readOnly
                    value={inviteUrl}
                  />
                  <Button
                    className="shrink-0 gap-2"
                    onClick={handleCopyLink}
                    style={{
                      backgroundColor: copied
                        ? "var(--accent-green)"
                        : "var(--accent-teal)",
                    }}
                    type="button"
                  >
                    {copied ? (
                      <>
                        <IconCheck className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <IconCopy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">
                  This link expires in 7 days
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Email input */}
              <div className="space-y-2">
                <Label className="font-medium text-sm" htmlFor="invite-email">
                  Email Address
                </Label>
                <div className="relative">
                  <IconMail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    disabled={isPending}
                    id="invite-email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    required
                    type="email"
                    value={email}
                  />
                </div>
              </div>

              {/* Role selection */}
              <div className="space-y-3">
                <Label className="font-medium text-sm">Role</Label>
                <div className="grid gap-3">
                  {roleOptions.map((option) => (
                    <button
                      className={cn(
                        "flex items-start gap-3 rounded-xl p-4 text-left ring-2 transition-all duration-200",
                        role === option.value
                          ? "bg-[var(--accent-teal)]/5 ring-[var(--accent-teal)]"
                          : "ring-foreground/5 hover:bg-muted/30 hover:ring-foreground/10"
                      )}
                      disabled={isPending}
                      key={option.value}
                      onClick={() => setRole(option.value)}
                      type="button"
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                          role === option.value
                            ? "bg-[var(--accent-teal)]/15 text-[var(--accent-teal)]"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {option.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">
                            {option.label}
                          </p>
                          {role === option.value && (
                            <IconCheck
                              className="h-4 w-4"
                              style={{ color: "var(--accent-teal)" }}
                            />
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t bg-muted/30 px-6 py-4">
          {inviteUrl ? (
            <>
              <Button
                onClick={handleCreateAnother}
                type="button"
                variant="outline"
              >
                Invite Another
              </Button>
              <Button
                onClick={handleClose}
                style={{ backgroundColor: "var(--accent-teal)" }}
                type="button"
              >
                Done
              </Button>
            </>
          ) : (
            <>
              <Button
                disabled={isPending}
                onClick={handleClose}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                className="min-w-[120px] gap-2"
                disabled={!email || isPending}
                onClick={handleSubmit}
                style={{ backgroundColor: "var(--accent-teal)" }}
              >
                {isPending ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <IconUserPlus className="h-4 w-4" />
                    Create Invite
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
