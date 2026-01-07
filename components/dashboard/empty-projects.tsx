"use client";

import * as React from "react";
import { IconPhotoPlus, IconSparkles } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyProjectsProps {
  onCreateClick?: () => void;
  className?: string;
}

export function EmptyProjects({
  onCreateClick,
  className,
}: EmptyProjectsProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-[500px] flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl border border-dashed border-foreground/10 bg-muted/30 px-8 py-16 text-center",
        className,
      )}
    >
      {/* Background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Icon */}
      <div className="animate-fade-in-up relative">
        <div
          className="flex h-28 w-28 items-center justify-center rounded-3xl shadow-lg ring-1 ring-white/10"
          style={{
            background: `linear-gradient(135deg, color-mix(in oklch, var(--accent-teal) 20%, transparent) 0%, color-mix(in oklch, var(--accent-teal) 5%, transparent) 100%)`,
          }}
        >
          <IconPhotoPlus
            className="h-14 w-14"
            style={{ color: "var(--accent-teal)" }}
            strokeWidth={1.5}
          />
        </div>
        {/* Sparkle accent */}
        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-card shadow-md ring-1 ring-foreground/5">
          <IconSparkles className="h-4 w-4 text-amber-500" />
        </div>
      </div>

      {/* Text content */}
      <div className="animate-fade-in-up stagger-1 max-w-md space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Your first masterpiece awaits
        </h2>
        <p className="text-base text-muted-foreground">
          Transform your real estate photos with AI-powered enhancements. Upload
          images, choose a style, and watch the magic happen.
        </p>
      </div>

      {/* CTA */}
      <div className="animate-fade-in-up stagger-2">
        <Button
          size="lg"
          onClick={onCreateClick}
          className="gap-2 px-8 shadow-lg transition-all hover:shadow-xl"
          style={{
            backgroundColor: "var(--accent-teal)",
          }}
        >
          <IconPhotoPlus className="h-5 w-5" />
          Create Your First Project
        </Button>
      </div>

      {/* Feature hints */}
      <div className="animate-fade-in-up stagger-3 flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground/70">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Virtual Staging
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Lighting Enhancement
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Twilight Conversion
        </span>
      </div>
    </div>
  );
}
