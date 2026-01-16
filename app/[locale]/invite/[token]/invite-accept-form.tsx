"use client";

import {
  IconAlertTriangle,
  IconBuilding,
  IconCheck,
  IconClock,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconLock,
  IconLogin,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  acceptInvitationAction,
  acceptInvitationAsLoggedInUser,
} from "@/lib/actions/invitations";

interface InviteAcceptFormProps {
  token: string;
  email: string;
  workspaceName: string;
  isExpired: boolean;
  isAccepted: boolean;
  role: string;
  hasExistingAccount?: boolean;
  isLoggedIn?: boolean;
  loggedInEmail?: string;
}

export function InviteAcceptForm({
  token,
  email,
  workspaceName,
  isExpired,
  isAccepted,
  role,
  hasExistingAccount = false,
  isLoggedIn = false,
  loggedInEmail,
}: InviteAcceptFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(!hasExistingAccount);

  const roleLabel =
    role === "admin" ? "an admin" : role === "owner" ? "the owner" : "a member";

  // Handler for logged-in users accepting directly
  const handleAcceptAsLoggedIn = () => {
    startTransition(async () => {
      const result = await acceptInvitationAsLoggedInUser(token);

      if (result.success) {
        toast.success("Welcome! You've joined the workspace.");
        router.push(result.data.redirectTo);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    startTransition(async () => {
      const result = await acceptInvitationAction(token, name.trim(), password);

      if (result.success) {
        toast.success("Welcome! Your account has been created.");
        router.push(result.data.redirectTo);
      } else {
        toast.error(result.error);
      }
    });
  };

  // Show expired state
  if (isExpired) {
    return (
      <div className="rounded-2xl bg-card p-8 text-center ring-1 ring-foreground/5">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            backgroundColor:
              "color-mix(in oklch, var(--accent-amber) 15%, transparent)",
          }}
        >
          <IconClock
            className="h-8 w-8"
            style={{ color: "var(--accent-amber)" }}
          />
        </div>
        <h1 className="mb-2 font-bold text-xl">Invitation Expired</h1>
        <p className="text-muted-foreground">
          This invitation link has expired. Please contact the workspace
          administrator to request a new invitation.
        </p>
      </div>
    );
  }

  // Show already accepted state
  if (isAccepted) {
    return (
      <div className="rounded-2xl bg-card p-8 text-center ring-1 ring-foreground/5">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
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
        <h1 className="mb-2 font-bold text-xl">Already Accepted</h1>
        <p className="mb-4 text-muted-foreground">
          This invitation has already been accepted. You can sign in to access
          your workspace.
        </p>
        <Button className="gap-2" onClick={() => router.push("/sign-in")}>
          Go to Sign In
        </Button>
      </div>
    );
  }

  // User is logged in with wrong email
  if (
    isLoggedIn &&
    loggedInEmail &&
    loggedInEmail.toLowerCase() !== email.toLowerCase()
  ) {
    return (
      <div className="rounded-2xl bg-card p-8 text-center ring-1 ring-foreground/5">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            backgroundColor:
              "color-mix(in oklch, var(--accent-amber) 15%, transparent)",
          }}
        >
          <IconAlertTriangle
            className="h-8 w-8"
            style={{ color: "var(--accent-amber)" }}
          />
        </div>
        <h1 className="mb-2 font-bold text-xl">Wrong Account</h1>
        <p className="mb-2 text-muted-foreground">
          This invitation was sent to <strong>{email}</strong>
        </p>
        <p className="mb-4 text-muted-foreground">
          You&apos;re signed in as <strong>{loggedInEmail}</strong>
        </p>
        <p className="mb-4 text-muted-foreground text-sm">
          Please sign out and sign in with the correct email to accept this
          invitation.
        </p>
        <Button className="gap-2" onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  // User is logged in with correct email - show direct accept
  if (
    isLoggedIn &&
    loggedInEmail &&
    loggedInEmail.toLowerCase() === email.toLowerCase()
  ) {
    return (
      <div className="rounded-2xl bg-card ring-1 ring-foreground/5">
        {/* Header */}
        <div className="border-b p-6 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
            style={{
              backgroundColor:
                "color-mix(in oklch, var(--accent-violet) 15%, transparent)",
            }}
          >
            <IconBuilding
              className="h-7 w-7"
              style={{ color: "var(--accent-violet)" }}
            />
          </div>
          <h1 className="font-bold text-xl">Join {workspaceName}</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            You&apos;ve been invited to join as {roleLabel}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          <div className="rounded-lg bg-muted/50 p-4 text-center">
            <p className="text-muted-foreground text-sm">
              Signed in as <strong>{loggedInEmail}</strong>
            </p>
          </div>

          <Button
            className="w-full gap-2"
            disabled={isPending}
            onClick={handleAcceptAsLoggedIn}
            style={{ backgroundColor: "var(--accent-violet)" }}
          >
            {isPending ? (
              <>
                <IconLoader2 className="h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <IconCheck className="h-4 w-4" />
                Accept Invitation
              </>
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="border-t bg-muted/30 px-6 py-4 text-center text-muted-foreground text-xs">
          By accepting, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    );
  }

  // User has existing account - show sign in prompt
  if (hasExistingAccount && !showSignUpForm) {
    return (
      <div className="rounded-2xl bg-card ring-1 ring-foreground/5">
        {/* Header */}
        <div className="border-b p-6 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
            style={{
              backgroundColor:
                "color-mix(in oklch, var(--accent-violet) 15%, transparent)",
            }}
          >
            <IconBuilding
              className="h-7 w-7"
              style={{ color: "var(--accent-violet)" }}
            />
          </div>
          <h1 className="font-bold text-xl">Join {workspaceName}</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            You&apos;ve been invited to join as {roleLabel}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          <div className="rounded-lg bg-muted/50 p-4 text-center">
            <p className="text-muted-foreground text-sm">
              An account already exists for <strong>{email}</strong>
            </p>
          </div>

          <Button
            asChild
            className="w-full gap-2"
            style={{ backgroundColor: "var(--accent-violet)" }}
          >
            <Link href={`/sign-in?redirect=/invite/${token}`}>
              <IconLogin className="h-4 w-4" />
              Sign In to Accept
            </Link>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={() => setShowSignUpForm(true)}
            variant="outline"
          >
            Create New Account Instead
          </Button>
        </div>

        {/* Footer */}
        <div className="border-t bg-muted/30 px-6 py-4 text-center text-muted-foreground text-xs">
          By accepting, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    );
  }

  // Sign up form (default for new accounts)
  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/5">
      {/* Header */}
      <div className="border-b p-6 text-center">
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
          style={{
            backgroundColor:
              "color-mix(in oklch, var(--accent-violet) 15%, transparent)",
          }}
        >
          <IconBuilding
            className="h-7 w-7"
            style={{ color: "var(--accent-violet)" }}
          />
        </div>
        <h1 className="font-bold text-xl">Join {workspaceName}</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          You&apos;ve been invited to join as {roleLabel}
        </p>
      </div>

      {/* Form */}
      <form className="space-y-4 p-6" onSubmit={handleSubmit}>
        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label className="font-medium text-sm">Email</Label>
          <Input className="bg-muted/50" disabled value={email} />
          <p className="text-muted-foreground text-xs">
            This is the email address your invitation was sent to
          </p>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label className="font-medium text-sm" htmlFor="name">
            Your Name
          </Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <IconUser className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              disabled={isPending}
              id="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              value={name}
            />
          </InputGroup>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label className="font-medium text-sm" htmlFor="password">
            Create Password
          </Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <IconLock className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              disabled={isPending}
              id="password"
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                size="icon-xs"
              >
                {showPassword ? (
                  <IconEyeOff className="size-4" />
                ) : (
                  <IconEye className="size-4" />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label className="font-medium text-sm" htmlFor="confirm-password">
            Confirm Password
          </Label>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <IconLock className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              disabled={isPending}
              id="confirm-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                size="icon-xs"
              >
                {showConfirmPassword ? (
                  <IconEyeOff className="size-4" />
                ) : (
                  <IconEye className="size-4" />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {password && confirmPassword && password !== confirmPassword && (
            <p className="flex items-center gap-1 text-destructive text-xs">
              <IconAlertTriangle className="h-3 w-3" />
              Passwords do not match
            </p>
          )}
        </div>

        <Button
          className="w-full gap-2"
          disabled={
            isPending ||
            !name.trim() ||
            password.length < 8 ||
            password !== confirmPassword
          }
          style={{ backgroundColor: "var(--accent-violet)" }}
          type="submit"
        >
          {isPending ? (
            <>
              <IconLoader2 className="h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              <IconCheck className="h-4 w-4" />
              Accept Invitation
            </>
          )}
        </Button>

        {hasExistingAccount && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => setShowSignUpForm(false)}
              type="button"
              variant="outline"
            >
              Sign In with Existing Account
            </Button>
          </>
        )}
      </form>

      {/* Footer */}
      <div className="border-t bg-muted/30 px-6 py-4 text-center text-muted-foreground text-xs">
        By accepting, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  );
}
