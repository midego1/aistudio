import { logger, metadata, task } from "@trigger.dev/sdk/v3";
import {
  getImageGenerationById,
  updateImageGeneration,
  updateProjectCounts,
} from "@/lib/db/queries";
import { enhanceImage, type AIProviderResult } from "@/lib/ai-provider";
import {
  getExtensionFromContentType,
  getImagePath,
  uploadImage,
} from "@/lib/supabase";

export interface ProcessImagePayload {
  imageId: string;
}

export interface ProcessImageStatus {
  step:
    | "fetching"
    | "uploading"
    | "processing"
    | "saving"
    | "completed"
    | "failed";
  label: string;
  progress?: number;
}

export const processImageTask = task({
  id: "process-image",
  maxDuration: 300, // 5 minutes
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10_000,
    factor: 2,
  },
  run: async (payload: ProcessImagePayload) => {
    const { imageId } = payload;

    try {
      // Step 1: Fetch image record
      metadata.set("status", {
        step: "fetching",
        label: "Loading image…",
        progress: 10,
      } satisfies ProcessImageStatus);

      logger.info("Fetching image record", { imageId });

      const image = await getImageGenerationById(imageId);
      if (!image) {
        throw new Error(`Image not found: ${imageId}`);
      }

      // Skip if already completed
      if (image.status === "completed") {
        logger.info("Image already processed, skipping", { imageId });
        metadata.set("status", {
          step: "completed",
          label: "Already processed",
          progress: 100,
        } satisfies ProcessImageStatus);
        return { success: true, message: "Already processed" };
      }

      // Update status to processing
      await updateImageGeneration(imageId, { status: "processing" });

      // Step 2: Enhance image with AI provider (Kie.ai primary, Fal.ai fallback)
      metadata.set("status", {
        step: "processing",
        label: "Enhancing image…",
        progress: 40,
      } satisfies ProcessImageStatus);

      logger.info("Calling AI provider for image enhancement", {
        imageId,
        prompt: image.prompt,
        originalImageUrl: image.originalImageUrl,
      });

      let result: AIProviderResult;
      try {
        result = await enhanceImage({
          prompt: image.prompt,
          imageUrl: image.originalImageUrl,
          outputFormat: "jpeg",
        });

        logger.info("AI enhancement completed", {
          imageId,
          provider: result.provider,
          fallbackUsed: result.fallbackUsed,
          fallbackReason: result.error,
        });
      } catch (aiError) {
        logger.error("AI provider failed", { error: aiError });
        throw new Error(
          `AI enhancement error: ${aiError instanceof Error ? aiError.message : String(aiError)}`
        );
      }

      // Check for result
      if (!result.images?.[0]?.url) {
        logger.error("No images in response", { result });
        throw new Error("No image returned from AI provider");
      }

      const resultImageUrl = result.images[0].url;
      const contentType = result.images[0].contentType || "image/jpeg";

      // Step 4: Save to Supabase
      metadata.set("status", {
        step: "saving",
        label: "Saving result…",
        progress: 80,
      } satisfies ProcessImageStatus);

      logger.info("Downloading result image", { resultImageUrl });

      const resultImageResponse = await fetch(resultImageUrl);
      if (!resultImageResponse.ok) {
        throw new Error("Failed to download result image");
      }

      const resultImageBuffer = await resultImageResponse.arrayBuffer();
      const extension = getExtensionFromContentType(contentType);

      const resultPath = getImagePath(
        image.workspaceId,
        image.projectId,
        `${imageId}.${extension}`,
        "result"
      );

      logger.info("Uploading to Supabase", { resultPath });

      const storedResultUrl = await uploadImage(
        new Uint8Array(resultImageBuffer),
        resultPath,
        contentType
      );

      // Update image record with result
      await updateImageGeneration(imageId, {
        status: "completed",
        resultImageUrl: storedResultUrl,
        errorMessage: null,
      });

      // Update project counts
      await updateProjectCounts(image.projectId);

      metadata.set("status", {
        step: "completed",
        label: "Complete",
        progress: 100,
      } satisfies ProcessImageStatus);

      logger.info("Image processing completed", {
        imageId,
        resultUrl: storedResultUrl,
      });

      return {
        success: true,
        resultUrl: storedResultUrl,
        imageId,
      };
    } catch (error) {
      logger.error("Image processing failed", {
        imageId,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      metadata.set("status", {
        step: "failed",
        label: "Processing failed",
        progress: 0,
      } satisfies ProcessImageStatus);

      // Update status to failed
      await updateImageGeneration(imageId, {
        status: "failed",
        errorMessage:
          error instanceof Error ? error.message : "Processing failed",
      });

      // Get image to update project counts
      const image = await getImageGenerationById(imageId);
      if (image) {
        await updateProjectCounts(image.projectId);
      }

      throw error;
    }
  },
});
