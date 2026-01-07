"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ALL_USER_ROLES,
  ALL_USER_STATUSES,
  type UserRole,
  type UserStatus,
} from "@/lib/mock/admin-users";
import { getAllWorkspaces } from "@/lib/mock/admin-workspaces";
import { useAdminUserFilters } from "@/hooks/use-admin-user-filters";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useMemo } from "react";

const roleLabels: Record<UserRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

const statusLabels: Record<UserStatus, string> = {
  active: "Active",
  pending: "Pending",
  inactive: "Inactive",
};

export function UsersTableToolbar() {
  const {
    filters,
    hasActiveFilters,
    setSearch,
    setWorkspace,
    setRole,
    setStatus,
    clearFilter,
    clearAll,
  } = useAdminUserFilters();

  // Get workspaces for dropdown
  const workspaces = useMemo(() => getAllWorkspaces(), []);
  const selectedWorkspace = workspaces.find(
    (w) => w.id === filters.workspaceId,
  );

  return (
    <div className="space-y-3">
      {/* Filters row */}
      <div className="flex flex-col gap-3 rounded-xl bg-muted/30 p-3 ring-1 ring-foreground/5 sm:flex-row sm:items-center sm:flex-wrap">
        {/* Search input */}
        <div className="relative flex-1 sm:max-w-[280px]">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search users..."
            value={filters.q || ""}
            onChange={(e) => setSearch(e.target.value || null)}
            className="pl-9 bg-background/80 border-foreground/10 focus-ring transition-shadow"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Workspace filter */}
          <Select
            value={filters.workspaceId || "all"}
            onValueChange={(value) =>
              setWorkspace(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full bg-background/80 border-foreground/10 sm:w-[180px]">
              <SelectValue placeholder="Workspace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All workspaces</SelectItem>
              {workspaces.map((workspace) => (
                <SelectItem key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Role filter */}
          <Select
            value={filters.role || "all"}
            onValueChange={(value) =>
              setRole(value === "all" ? null : (value as UserRole))
            }
          >
            <SelectTrigger className="w-full bg-background/80 border-foreground/10 sm:w-[120px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {ALL_USER_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {roleLabels[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select
            value={filters.status || "all"}
            onValueChange={(value) =>
              setStatus(value === "all" ? null : (value as UserStatus))
            }
          >
            <SelectTrigger className="w-full bg-background/80 border-foreground/10 sm:w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {ALL_USER_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {statusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear all button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <IconX className="mr-1 h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active filters pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 animate-fade-in">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Active filters:
          </span>
          {filters.q && (
            <Badge
              variant="secondary"
              className="gap-1.5 pr-1.5 animate-scale-in"
            >
              <span className="text-muted-foreground">Search:</span> {filters.q}
              <button
                onClick={() => clearFilter("q")}
                className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
              >
                <IconX className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.workspaceId && selectedWorkspace && (
            <Badge
              variant="secondary"
              className="gap-1.5 pr-1.5 animate-scale-in"
            >
              <span className="text-muted-foreground">Workspace:</span>{" "}
              {selectedWorkspace.name}
              <button
                onClick={() => clearFilter("workspaceId")}
                className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
              >
                <IconX className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.role && (
            <Badge
              variant="secondary"
              className="gap-1.5 pr-1.5 animate-scale-in"
            >
              <span className="text-muted-foreground">Role:</span>{" "}
              {roleLabels[filters.role]}
              <button
                onClick={() => clearFilter("role")}
                className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
              >
                <IconX className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.status && (
            <Badge
              variant="secondary"
              className="gap-1.5 pr-1.5 animate-scale-in"
            >
              <span className="text-muted-foreground">Status:</span>{" "}
              {statusLabels[filters.status]}
              <button
                onClick={() => clearFilter("status")}
                className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
              >
                <IconX className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
