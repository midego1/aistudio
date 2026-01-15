import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ImpersonationBanner } from "@/components/admin/impersonation-banner";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { auth } from "@/lib/auth";
import { constructMetadata } from "@/lib/constructMetadata";
import { getUserWithWorkspace } from "@/lib/db/queries";

export const metadata = constructMetadata({
  title: "Dashboard | Proppi",
  description: "Manage your property photos and AI edits",
  noIndex: true,
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Validate session server-side
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // Check if email is verified
  if (!session.user.emailVerified) {
    redirect("/verify-email");
  }

  // Get user with workspace
  const data = await getUserWithWorkspace(session.user.id);

  // If no workspace or onboarding not completed, redirect to onboarding
  if (!data?.workspace.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-background">
      <ImpersonationBanner />
      <DashboardHeader userLabel={session.user.email} />

      {/* Main content - full width with consistent padding */}
      <main className="w-full py-6">{children}</main>
    </div>
  );
}
