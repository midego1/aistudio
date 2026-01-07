"use client";

import * as React from "react";
import type {
  VideoRoomType,
  VideoAspectRatio,
  MusicTrack,
} from "@/lib/db/schema";
import { VIDEO_DEFAULTS, VIDEO_LIMITS } from "@/lib/video/video-constants";
import { getVideoTemplateById } from "@/lib/video/video-templates";
import {
  autoSequenceClips,
  reindexSequenceOrders,
} from "@/lib/video/room-sequence";

export type VideoCreationStep =
  | "select-template"
  | "storyboard"
  | "select-images"
  | "assign-rooms"
  | "select-music"
  | "review";

export interface VideoImageItem {
  id: string;
  url: string;
  imageGenerationId?: string | null;
  roomType: VideoRoomType;
  roomLabel: string;
  sequenceOrder: number;
}

export interface VideoCreationState {
  step: VideoCreationStep;
  selectedTemplateId: string | null;
  projectName: string;
  images: VideoImageItem[];
  aspectRatio: VideoAspectRatio;
  selectedMusicTrack: MusicTrack | null;
  musicVolume: number;
  generateNativeAudio: boolean;
  isSubmitting: boolean;
}

// We'll handle the order dynamically based on template selection
const CUSTOM_FLOW_STEPS: VideoCreationStep[] = [
  "select-template",
  "select-images",
  "assign-rooms",
  "select-music",
  "review",
];
const TEMPLATE_FLOW_STEPS: VideoCreationStep[] = [
  "select-template",
  "storyboard",
  "select-music",
  "review",
];

export function useVideoCreation() {
  const [state, setState] = React.useState<VideoCreationState>({
    step: "select-template",
    selectedTemplateId: null,
    projectName: "",
    images: [],
    aspectRatio: VIDEO_DEFAULTS.ASPECT_RATIO,
    selectedMusicTrack: null,
    musicVolume: VIDEO_DEFAULTS.MUSIC_VOLUME,
    generateNativeAudio: VIDEO_DEFAULTS.GENERATE_NATIVE_AUDIO,
    isSubmitting: false,
  });

  const setStep = React.useCallback((step: VideoCreationStep) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const setTemplateId = React.useCallback((id: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedTemplateId: id,
      // Clear images when switching templates/modes to avoid confusion
      images: [],
    }));
  }, []);

  const setProjectName = React.useCallback((name: string) => {
    setState((prev) => ({ ...prev, projectName: name }));
  }, []);

  const addImages = React.useCallback(
    (newImages: Omit<VideoImageItem, "sequenceOrder">[]) => {
      setState((prev) => {
        // Find the next available sequence order
        const maxOrder = prev.images.reduce(
          (max, img) => Math.max(max, img.sequenceOrder),
          0,
        );

        const imagesWithOrder = newImages.map((img, i) => ({
          ...img,
          sequenceOrder: maxOrder + i + 1,
        }));
        const combined = [...prev.images, ...imagesWithOrder];
        // Limit to max images
        return {
          ...prev,
          images: combined.slice(0, VIDEO_LIMITS.MAX_IMAGES_PER_VIDEO),
        };
      });
    },
    [],
  );

  // Specialized function for storyboard slots
  const addImageToSlot = React.useCallback(
    (image: Omit<VideoImageItem, "sequenceOrder">, slotIndex: number) => {
      setState((prev) => {
        // Remove any existing image in this slot
        const filtered = prev.images.filter(
          (img) => img.sequenceOrder !== slotIndex + 1,
        );

        // Add new image at specific sequence order (1-based)
        const newImage = {
          ...image,
          sequenceOrder: slotIndex + 1,
        };

        return {
          ...prev,
          images: [...filtered, newImage],
        };
      });
    },
    [],
  );

  const removeImage = React.useCallback((id: string) => {
    setState((prev) => {
      // If in template mode, we just remove the image but keep others' positions fixed
      if (prev.selectedTemplateId) {
        return { ...prev, images: prev.images.filter((img) => img.id !== id) };
      }

      // In custom mode, we re-index
      const filtered = prev.images.filter((img) => img.id !== id);
      const reindexed = filtered.map((img, i) => ({
        ...img,
        sequenceOrder: i + 1,
      }));
      return { ...prev, images: reindexed };
    });
  }, []);

  const updateImage = React.useCallback(
    (id: string, updates: Partial<Omit<VideoImageItem, "id" | "url">>) => {
      setState((prev) => ({
        ...prev,
        images: prev.images.map((img) =>
          img.id === id ? { ...img, ...updates } : img,
        ),
      }));
    },
    [],
  );

  const reorderImages = React.useCallback(
    (fromIndex: number, toIndex: number) => {
      setState((prev) => {
        // Only for custom mode
        if (prev.selectedTemplateId) return prev;

        const newImages = [...prev.images];
        const [removed] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, removed);
        // Re-index sequence orders
        const reindexed = newImages.map((img, i) => ({
          ...img,
          sequenceOrder: i + 1,
        }));
        return { ...prev, images: reindexed };
      });
    },
    [],
  );

  const autoArrangeByRoomType = React.useCallback(() => {
    setState((prev) => {
      if (prev.selectedTemplateId) return prev; // Disable for templates

      const sorted = autoSequenceClips(prev.images);
      const reindexed = reindexSequenceOrders(sorted);
      return { ...prev, images: reindexed };
    });
  }, []);

  const setAspectRatio = React.useCallback((ratio: VideoAspectRatio) => {
    setState((prev) => ({ ...prev, aspectRatio: ratio }));
  }, []);

  const setMusicTrack = React.useCallback((track: MusicTrack | null) => {
    setState((prev) => ({ ...prev, selectedMusicTrack: track }));
  }, []);

  const setMusicVolume = React.useCallback((volume: number) => {
    setState((prev) => ({
      ...prev,
      musicVolume: Math.min(100, Math.max(0, volume)),
    }));
  }, []);

  const setGenerateNativeAudio = React.useCallback((generate: boolean) => {
    setState((prev) => ({ ...prev, generateNativeAudio: generate }));
  }, []);

  const setIsSubmitting = React.useCallback((submitting: boolean) => {
    setState((prev) => ({ ...prev, isSubmitting: submitting }));
  }, []);

  const goToNextStep = React.useCallback(() => {
    setState((prev) => {
      const stepList = prev.selectedTemplateId
        ? TEMPLATE_FLOW_STEPS
        : CUSTOM_FLOW_STEPS;
      const currentIndex = stepList.indexOf(prev.step);
      if (currentIndex < stepList.length - 1) {
        return { ...prev, step: stepList[currentIndex + 1] };
      }
      return prev;
    });
  }, []);

  const goToPreviousStep = React.useCallback(() => {
    setState((prev) => {
      const stepList = prev.selectedTemplateId
        ? TEMPLATE_FLOW_STEPS
        : CUSTOM_FLOW_STEPS;
      const currentIndex = stepList.indexOf(prev.step);
      if (currentIndex > 0) {
        return { ...prev, step: stepList[currentIndex - 1] };
      }
      return prev;
    });
  }, []);

  const canProceed = React.useCallback(() => {
    switch (state.step) {
      case "select-template":
        // Always allowed to proceed - if they select a template, we go to storyboard.
        // If they don't (conceptually "custom"), they click "Start from Scratch" which sets template to null and goes to select-images.
        // But the UI will handle the "Start from Scratch" vs "Select Template" distinct actions.
        // For the purpose of a generic "Next" button (if it existed), we'd need to know if a selection was made.
        // The SelectTemplateStep will likely handle the navigation directly.
        return true;

      case "select-images":
        return state.images.length >= VIDEO_LIMITS.MIN_IMAGES_PER_VIDEO;

      case "assign-rooms":
        return state.images.every((img) => img.roomType);

      case "storyboard":
        if (!state.selectedTemplateId) return false;
        const template = getVideoTemplateById(state.selectedTemplateId);
        if (!template) return false;

        // Check if all slots have an image
        // We know images are keyed by sequenceOrder = slotIndex + 1
        const filledSlots = state.images.map((img) => img.sequenceOrder);
        // Check if every slot index (1..slots.length) is present
        for (let i = 1; i <= template.slots.length; i++) {
          if (!filledSlots.includes(i)) return false;
        }
        return true;

      case "select-music":
        return true; // Music is optional

      case "review":
        return state.projectName.trim().length > 0 && state.images.length > 0;

      default:
        return false;
    }
  }, [state]);

  const reset = React.useCallback(() => {
    setState({
      step: "select-template",
      selectedTemplateId: null,
      projectName: "",
      images: [],
      aspectRatio: VIDEO_DEFAULTS.ASPECT_RATIO,
      selectedMusicTrack: null,
      musicVolume: VIDEO_DEFAULTS.MUSIC_VOLUME,
      generateNativeAudio: VIDEO_DEFAULTS.GENERATE_NATIVE_AUDIO,
      isSubmitting: false,
    });
  }, []);

  return {
    ...state,
    setStep,
    setTemplateId,
    setProjectName,
    addImages,
    addImageToSlot,
    removeImage,
    updateImage,
    reorderImages,
    autoArrangeByRoomType,
    setAspectRatio,
    setMusicTrack,
    setMusicVolume,
    setGenerateNativeAudio,
    setIsSubmitting,
    goToNextStep,
    goToPreviousStep,
    canProceed,
    reset,
  };
}
