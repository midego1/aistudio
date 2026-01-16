import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { auth } from "@/lib/auth";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const params = await searchParams;
  const isNewSignup = params.signup === "true";

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
  return <VerifyEmailForm email={session.user.email} isNewSignup={isNewSignup} />;
}
