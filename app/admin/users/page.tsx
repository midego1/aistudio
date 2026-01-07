import { IconUsers } from "@tabler/icons-react";
import { UsersDataTable } from "@/components/admin/tables/users/data-table";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8">
      {/* Page Header */}
      <div className="animate-fade-in-up space-y-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ring-1 ring-white/10"
            style={{ backgroundColor: "var(--accent-teal)" }}
          >
            <IconUsers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
            <p className="text-sm text-muted-foreground">
              Manage and monitor all users across workspaces
            </p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="animate-fade-in-up stagger-1">
        <UsersDataTable />
      </div>
    </div>
  );
}
