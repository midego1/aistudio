"use client";

import * as React from "react";
import Image from "next/image";
import {
  IconPlus,
  IconPlayerPlay,
  IconClock,
  IconLayout,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  VIDEO_TEMPLATES,
  type VideoTemplate,
} from "@/lib/video/video-templates";
import { Badge } from "@/components/ui/badge";

interface SelectTemplateStepProps {
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
  onSelectCustom: () => void;
}

export function SelectTemplateStep({
  selectedTemplateId,
  onSelectTemplate,
  onSelectCustom,
}: SelectTemplateStepProps) {
  const [hoveredTemplateId, setHoveredTemplateId] = React.useState<
    string | null
  >(null);

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Choose a Style</h2>
        <p className="text-muted-foreground mt-2">
          Start with a professionally curated template or build your video from
          scratch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Templates */}
        {VIDEO_TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplateId === template.id}
            isHovered={hoveredTemplateId === template.id}
            onHover={setHoveredTemplateId}
            onSelect={() => onSelectTemplate(template.id)}
          />
        ))}

        {/* Custom Option */}
        <button
          onClick={onSelectCustom}
          className={cn(
            "group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 transition-all duration-300",
            "hover:border-(--accent-teal) hover:bg-(--accent-teal)/5",
            selectedTemplateId === null
              ? "border-muted-foreground/20" // We don't really have a "selected" state for custom in this view as it navigates away immediately usually, but good to have styles
              : "border-muted-foreground/20",
          )}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-(--accent-teal)/10 group-hover:text-(--accent-teal)">
            <IconPlus className="h-8 w-8" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">Start from Scratch</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Manually select images and arrange your own sequence
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  isSelected,
  isHovered,
  onHover,
  onSelect,
}: {
  template: VideoTemplate;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: () => void;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (isHovered && template.previewVideoUrl && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (!isHovered && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered, template.previewVideoUrl]);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => onHover(template.id)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl border-2 bg-card text-card-foreground shadow-sm transition-all duration-300",
        isSelected
          ? "border-(--accent-teal) ring-2 ring-(--accent-teal)/20"
          : "border-transparent hover:border-(--accent-teal)/50 hover:shadow-lg hover:-translate-y-1",
      )}
    >
      {/* Thumbnail / Video Container */}
      <div className="aspect-video relative bg-muted overflow-hidden">
        {/* Static Image */}
        <Image
          src={template.thumbnailUrl}
          alt={template.name}
          fill
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            isHovered && template.previewVideoUrl ? "opacity-0" : "opacity-100",
          )}
        />

        {/* Video Preview */}
        {template.previewVideoUrl &&
          (template.previewVideoUrl.endsWith(".mp4") ||
            template.previewVideoUrl.includes("cdn.coverr.co")) && (
            <video
              ref={videoRef}
              src={template.previewVideoUrl}
              muted
              loop
              playsInline
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                isHovered ? "opacity-100" : "opacity-0",
              )}
            />
          )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />

        {/* Play Icon (visible when not hovering) */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300",
            isHovered ? "opacity-0 scale-110" : "opacity-100 scale-100",
          )}
        >
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
            <IconPlayerPlay className="h-6 w-6 text-white fill-white" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="bg-black/50 text-white border-0 backdrop-blur-md text-xs font-normal"
          >
            <IconClock className="mr-1 h-3 w-3" />
            {template.estimatedDuration}s
          </Badge>
          <Badge
            variant="secondary"
            className="bg-black/50 text-white border-0 backdrop-blur-md text-xs font-normal"
          >
            <IconLayout className="mr-1 h-3 w-3" />
            {template.slots.length} shots
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg group-hover:text-(--accent-teal) transition-colors">
          {template.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {template.description}
        </p>

        {/* Slot Preview */}
        <div className="mt-4 flex items-center gap-1.5 overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity">
          {template.slots.slice(0, 5).map((slot, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full bg-muted-foreground/30"
            />
          ))}
          {template.slots.length > 5 && (
            <span className="text-[10px] text-muted-foreground ml-1">
              +{template.slots.length - 5}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
