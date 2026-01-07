"use client";

import { useEffect, useState } from "react";
import {
  IconBuilding,
  IconUsers,
  IconPhoto,
  IconCurrencyDollar,
  IconActivity,
  IconCalendar,
} from "@tabler/icons-react";

type StatItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  accentColor: string;
  delay: number;
};

function StatItem({
  icon,
  label,
  value,
  subValue,
  accentColor,
  delay,
}: StatItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`stats-card flex items-center gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/5 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: `color-mix(in oklch, ${accentColor} 15%, transparent)`,
        }}
      >
        <div style={{ color: accentColor }}>{icon}</div>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <p
            className="font-mono text-lg font-semibold tabular-nums"
            style={{ color: accentColor }}
          >
            {value}
          </p>
          {subValue && (
            <span className="text-xs text-muted-foreground">{subValue}</span>
          )}
        </div>
      </div>
    </div>
  );
}

type AdminStatsBarProps = {
  totalWorkspaces: number;
  activeWorkspaces: number;
  totalUsers: number;
  activeUsers: number;
  totalImages: number;
  imagesThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  activeSessions: number;
};

export function AdminStatsBar({
  totalWorkspaces,
  activeWorkspaces,
  totalUsers,
  activeUsers,
  totalImages,
  imagesThisMonth,
  totalRevenue,
  revenueThisMonth,
  activeSessions,
}: AdminStatsBarProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      <StatItem
        icon={<IconBuilding className="h-4 w-4" />}
        label="Workspaces"
        value={totalWorkspaces.toLocaleString()}
        subValue={`${activeWorkspaces} active`}
        accentColor="var(--accent-violet)"
        delay={0}
      />
      <StatItem
        icon={<IconUsers className="h-4 w-4" />}
        label="Users"
        value={totalUsers.toLocaleString()}
        subValue={`${activeUsers} active`}
        accentColor="var(--accent-teal)"
        delay={50}
      />
      <StatItem
        icon={<IconActivity className="h-4 w-4" />}
        label="Sessions"
        value={activeSessions.toLocaleString()}
        subValue="online now"
        accentColor="var(--accent-green)"
        delay={100}
      />
      <StatItem
        icon={<IconPhoto className="h-4 w-4" />}
        label="Total Images"
        value={totalImages.toLocaleString()}
        accentColor="var(--accent-teal)"
        delay={150}
      />
      <StatItem
        icon={<IconCalendar className="h-4 w-4" />}
        label="This Month"
        value={imagesThisMonth.toLocaleString()}
        subValue="images"
        accentColor="var(--accent-violet)"
        delay={200}
      />
      <StatItem
        icon={<IconCurrencyDollar className="h-4 w-4" />}
        label="Revenue"
        value={`$${totalRevenue.toFixed(2)}`}
        subValue={`$${revenueThisMonth.toFixed(2)} MTD`}
        accentColor="var(--accent-amber)"
        delay={250}
      />
    </div>
  );
}
