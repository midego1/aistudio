/**
 * Kie.ai Client Library
 *
 * HTTP client for Kie.ai's Nano Banana Pro image editing API.
 * Used as the primary AI provider for image enhancement.
 */

// ============================================================================
// Configuration
// ============================================================================

const KIE_API_BASE_URL = "https://api.kie.ai/v1";
const KIE_NANO_BANANA_PRO_ENDPOINT = "/nano-banana-pro/edit";

// ============================================================================
// Types
// ============================================================================

export interface KieNanoBananaProInput {
  prompt: string;
  image_urls: string[]; // Array of image URLs to edit
  num_images?: number; // 1-4, default 1
  aspect_ratio?:
    | "21:9"
    | "16:9"
    | "3:2"
    | "4:3"
    | "5:4"
    | "1:1"
    | "4:5"
    | "3:4"
    | "2:3"
    | "9:16";
  resolution?: "1K" | "2K" | "4K";
  output_format?: "jpeg" | "png" | "webp";
}

export interface KieNanoBananaProOutput {
  images: Array<{
    url: string;
    file_name?: string;
    content_type: string;
    file_size?: number;
    width?: number;
    height?: number;
  }>;
  description?: string;
}

export interface KieErrorResponse {
  error: {
    message: string;
    code?: string;
    status?: number;
  };
}

// ============================================================================
// Client
// ============================================================================

class KieClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generate/edit images using Nano Banana Pro model
   */
  async nanoBananaPro(
    input: KieNanoBananaProInput
  ): Promise<KieNanoBananaProOutput> {
    const url = `${KIE_API_BASE_URL}${KIE_NANO_BANANA_PRO_ENDPOINT}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      let errorMessage = `Kie.ai API error: ${response.status}`;

      try {
        const errorBody = (await response.json()) as KieErrorResponse;
        if (errorBody.error?.message) {
          errorMessage = `Kie.ai API error: ${errorBody.error.message}`;
        }
      } catch {
        // Ignore JSON parsing errors, use default message
      }

      throw new Error(errorMessage);
    }

    const result = (await response.json()) as KieNanoBananaProOutput;

    // Validate response has images
    if (!result.images || result.images.length === 0) {
      throw new Error("Kie.ai returned no images");
    }

    return result;
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

let kieInstance: KieClient | null = null;

/**
 * Get the Kie.ai client instance.
 * Lazily initialized with KIE_API_KEY environment variable.
 */
export function getKieClient(): KieClient {
  if (!kieInstance) {
    const apiKey = process.env.KIE_API_KEY;

    if (!apiKey) {
      throw new Error(
        "KIE_API_KEY environment variable is not set. " +
          "Please add your Kie.ai API key to .env.local"
      );
    }

    kieInstance = new KieClient(apiKey);
  }

  return kieInstance;
}

/**
 * Check if Kie.ai is configured (API key is present)
 */
export function isKieConfigured(): boolean {
  return !!process.env.KIE_API_KEY;
}
