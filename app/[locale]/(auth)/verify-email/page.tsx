import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { auth } from "@/lib/auth";

export default async function VerifyEmailPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // No session - redirect to sign-in
  if (!session) {
    redirect("/sign-in");
  }

  // Already verified - redirect to dashboard
  if (session.user.emailVerified) {
    redirect("/dashboard");
  }

  // Not verified - show verification form
  return <VerifyEmailForm email={session.user.email} />;
}
