import { IconShieldCheck } from "@tabler/icons-react";
import { AdminStatsBar } from "@/components/admin/admin-stats-bar";
import { RecentActivityList } from "@/components/admin/recent-activity";
import { getAdminStats, getRecentActivity } from "@/lib/mock/admin-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminOverviewPage() {
  const stats = getAdminStats();
  const recentActivity = getRecentActivity(12);

  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8">
      {/* Page Header */}
      <div className="animate-fade-in-up space-y-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ring-1 ring-white/10"
            style={{ backgroundColor: "var(--accent-violet)" }}
          >
            <IconShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Platform Administration
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitor and manage all workspaces, users, and platform activity
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="animate-fade-in-up stagger-1">
        <AdminStatsBar
          totalWorkspaces={stats.totalWorkspaces}
          activeWorkspaces={stats.activeWorkspaces}
          totalUsers={stats.totalUsers}
          activeUsers={stats.activeUsers}
          totalImages={stats.totalImages}
          imagesThisMonth={stats.imagesThisMonth}
          totalRevenue={stats.totalRevenue}
          revenueThisMonth={stats.revenueThisMonth}
          activeSessions={stats.activeSessions}
        />
      </div>

      {/* Recent Activity */}
      <div className="animate-fade-in-up stagger-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <RecentActivityList activities={recentActivity} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
