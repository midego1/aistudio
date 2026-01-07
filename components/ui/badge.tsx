import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Status variants for property table
        "status-active":
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
        "status-pending":
          "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
        "status-completed":
          "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
        "status-archived":
          "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
        // Admin status variants
        "status-suspended":
          "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
        "status-trial":
          "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20",
        "status-inactive":
          "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
        // Plan variants
        "plan-free":
          "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
        "plan-pro":
          "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
        "plan-enterprise":
          "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
        // Role variants
        "role-owner":
          "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20",
        "role-admin":
          "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
        "role-member":
          "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
        // Tag variant for property tags
        tag: "bg-muted text-muted-foreground rounded-md px-2.5 py-0.5 text-[11px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
