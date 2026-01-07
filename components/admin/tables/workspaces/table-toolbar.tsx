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
  ALL_WORKSPACE_STATUSES,
  ALL_WORKSPACE_PLANS,
} from "@/lib/types/admin";
import type { WorkspaceStatus, WorkspacePlan } from "@/lib/db/schema";
import { useAdminWorkspaceFilters } from "@/hooks/use-admin-workspace-filters";
import { IconSearch, IconX } from "@tabler/icons-react";

const statusLabels: Record<WorkspaceStatus, string> = {
  active: "Active",
  suspended: "Suspended",
  trial: "Trial",
};

const planLabels: Record<WorkspacePlan, string> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
};

export function WorkspacesTableToolbar() {
  const {
    filters,
    hasActiveFilters,
    setSearch,
    setStatus,
    setPlan,
    clearFilter,
    clearAll,
  } = useAdminWorkspaceFilters();

  return (
    <div className="space-y-3">
      {/* Filters row */}
      <div className="flex flex-col gap-3 rounded-xl bg-muted/30 p-3 ring-1 ring-foreground/5 sm:flex-row sm:items-center">
        {/* Search input */}
        <div className="relative flex-1 sm:max-w-[320px]">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search workspaces..."
            value={filters.q || ""}
            onChange={(e) => setSearch(e.target.value || null)}
            className="pl-9 bg-background/80 border-foreground/10 focus-ring transition-shadow"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <Select
            value={filters.status || "all"}
            onValueChange={(value) =>
              setStatus(value === "all" ? null : (value as WorkspaceStatus))
            }
          >
            <SelectTrigger className="w-full bg-background/80 border-foreground/10 sm:w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {ALL_WORKSPACE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {statusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Plan filter */}
          <Select
            value={filters.plan || "all"}
            onValueChange={(value) =>
              setPlan(value === "all" ? null : (value as WorkspacePlan))
            }
          >
            <SelectTrigger className="w-full bg-background/80 border-foreground/10 sm:w-[130px]">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All plans</SelectItem>
              {ALL_WORKSPACE_PLANS.map((plan) => (
                <SelectItem key={plan} value={plan}>
                  {planLabels[plan]}
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

          {filters.plan && (
            <Badge
              variant="secondary"
              className="gap-1.5 pr-1.5 animate-scale-in"
            >
              <span className="text-muted-foreground">Plan:</span>{" "}
              {planLabels[filters.plan]}
              <button
                onClick={() => clearFilter("plan")}
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
