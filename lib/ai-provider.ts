/**
 * AI Provider Abstraction Layer
 *
 * Unified interface for image enhancement that:
 * 1. Tries Kie.ai as the primary provider
 * 2. Falls back to Fal.ai if Kie.ai fails
 * 3. Logs which provider was used for monitoring
 */

import { getKieClient, isKieConfigured } from "./kie";
import { fal, NANO_BANANA_PRO_EDIT, type NanoBananaProOutput } from "./fal";

// ============================================================================
// Types
// ============================================================================

export interface ImageEnhanceInput {
  prompt: string;
  imageUrl: string; // Direct URL to the source image (e.g., Supabase URL)
  numImages?: number;
  outputFormat?: "jpeg" | "png" | "webp";
}

export interface EnhancedImage {
  url: string;
  contentType: string;
  width?: number;
  height?: number;
  fileSize?: number;
}

export interface AIProviderResult {
  images: EnhancedImage[];
  provider: "kie" | "fal";
  fallbackUsed: boolean;
  error?: string; // Error from primary provider if fallback was used
}

// ============================================================================
// Provider Functions
// ============================================================================

/**
 * Try to enhance image using Kie.ai
 */
async function enhanceWithKie(input: ImageEnhanceInput): Promise<EnhancedImage[]> {
  const kie = getKieClient();

  const result = await kie.nanoBananaPro({
    prompt: input.prompt,
    image_urls: [input.imageUrl],
    num_images: input.numImages ?? 1,
    output_format: input.outputFormat ?? "jpeg",
  });

  return result.images.map((img) => ({
    url: img.url,
    contentType: img.content_type || "image/jpeg",
    width: img.width,
    height: img.height,
    fileSize: img.file_size,
  }));
}

/**
 * Enhance image using Fal.ai (fallback provider)
 *
 * Note: Fal.ai requires uploading the image to their storage first,
 * then calling the API with the Fal.ai storage URL.
 */
async function enhanceWithFal(input: ImageEnhanceInput): Promise<EnhancedImage[]> {
  // Fetch the image and upload to Fal.ai storage
  const imageResponse = await fetch(input.imageUrl);
  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image from ${input.imageUrl}: ${imageResponse.status}`);
  }

  const imageBlob = await imageResponse.blob();
  const falImageUrl = await fal.storage.upload(
    new File([imageBlob], "input.jpg", { type: imageBlob.type })
  );

  // Call Fal.ai API
  const result = (await fal.subscribe(NANO_BANANA_PRO_EDIT, {
    input: {
      prompt: input.prompt,
      image_urls: [falImageUrl],
      num_images: input.numImages ?? 1,
      output_format: input.outputFormat ?? "jpeg",
    },
  })) as unknown as NanoBananaProOutput;

  // Handle both direct and wrapped response formats
  const output = (result as { data?: NanoBananaProOutput }).data || result;

  if (!output.images?.length) {
    throw new Error("No images returned from Fal.ai");
  }

  return output.images.map((img) => ({
    url: img.url,
    contentType: img.content_type || "image/jpeg",
    width: img.width,
    height: img.height,
    fileSize: img.file_size,
  }));
}

// ============================================================================
// Main Entry Point
// ============================================================================

/**
 * Enhance an image using AI providers with automatic fallback.
 *
 * Strategy:
 * 1. If Kie.ai is configured, try it first
 * 2. If Kie.ai fails or is not configured, use Fal.ai
 *
 * @param input - Image enhancement parameters
 * @returns Enhanced images with provider metadata
 */
export async function enhanceImage(input: ImageEnhanceInput): Promise<AIProviderResult> {
  // Check if Kie.ai is configured
  if (!isKieConfigured()) {
    // Kie.ai not configured, go straight to Fal.ai
    const images = await enhanceWithFal(input);
    return {
      images,
      provider: "fal",
      fallbackUsed: false, // Not a fallback, just the only option
    };
  }

  // Try Kie.ai first
  try {
    const images = await enhanceWithKie(input);
    return {
      images,
      provider: "kie",
      fallbackUsed: false,
    };
  } catch (kieError) {
    const errorMessage = kieError instanceof Error ? kieError.message : String(kieError);

    // Log the Kie.ai failure for monitoring
    console.error("[ai-provider] Kie.ai failed, falling back to Fal.ai:", errorMessage);

    // Try Fal.ai as fallback
    try {
      const images = await enhanceWithFal(input);
      return {
        images,
        provider: "fal",
        fallbackUsed: true,
        error: errorMessage,
      };
    } catch (falError) {
      // Both providers failed
      const falErrorMessage = falError instanceof Error ? falError.message : String(falError);
      throw new Error(
        `All AI providers failed. Kie.ai: ${errorMessage}. Fal.ai: ${falErrorMessage}`
      );
    }
  }
}

/**
 * Get the name of the currently configured primary provider
 */
export function getPrimaryProvider(): "kie" | "fal" {
  return isKieConfigured() ? "kie" : "fal";
}
