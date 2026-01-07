import { IconBuilding } from "@tabler/icons-react";
import { WorkspacesDataTable } from "@/components/admin/tables/workspaces/data-table";
import { getAdminWorkspaces } from "@/lib/db/queries";
import type { WorkspaceStatus, WorkspacePlan } from "@/lib/db/schema";
import type { SortableWorkspaceColumn, SortDirection } from "@/lib/types/admin";

interface SearchParams {
  q?: string;
  status?: string;
  plan?: string;
  sort?: string;
  order?: string;
}

export default async function AdminWorkspacesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // Parse filters from URL
  const filters = {
    search: params.q || undefined,
    status: (params.status as WorkspaceStatus) || undefined,
    plan: (params.plan as WorkspacePlan) || undefined,
  };

  // Parse sort from URL
  const sort: [SortableWorkspaceColumn, SortDirection] | undefined =
    params.sort && params.order
      ? [params.sort as SortableWorkspaceColumn, params.order as SortDirection]
      : undefined;

  // Fetch initial data server-side
  const initialData = await getAdminWorkspaces({
    cursor: null,
    limit: 20,
    filters,
    sort,
  });

  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8">
      {/* Page Header */}
      <div className="animate-fade-in-up space-y-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ring-1 ring-white/10"
            style={{ backgroundColor: "var(--accent-violet)" }}
          >
            <IconBuilding className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workspaces</h1>
            <p className="text-sm text-muted-foreground">
              Manage and monitor all workspaces on the platform
            </p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="animate-fade-in-up stagger-1">
        <WorkspacesDataTable
          initialData={initialData.data}
          initialMeta={initialData.meta}
        />
      </div>
    </div>
  );
}
