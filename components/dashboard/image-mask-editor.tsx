"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  IconX,
  IconTrash,
  IconPlus,
  IconArrowBackUp,
  IconSparkles,
  IconLoader2,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useInpaint } from "@/hooks/use-inpaint";
import { cn } from "@/lib/utils";
import type { ImageGeneration } from "@/lib/db/schema";

// Common real estate staging suggestions
const OBJECT_SUGGESTIONS = [
  "Chair",
  "Plant",
  "Lamp",
  "Painting",
  "Rug",
  "Coffee table",
  "Sofa",
  "Mirror",
  "Vase",
  "Bookshelf",
];

interface MaskBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageMaskEditorProps {
  image: ImageGeneration;
  latestVersion: number;
  onClose: () => void;
}

export function ImageMaskEditor({
  image,
  latestVersion,
  onClose,
}: ImageMaskEditorProps) {
  const router = useRouter();
  const { inpaint, isProcessing, error } = useInpaint();

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fabricRef = React.useRef<InstanceType<
    typeof import("fabric").Canvas
  > | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  type EditMode = "remove" | "add";
  const [brushSize, setBrushSize] = React.useState(30);
  const [mode, setMode] = React.useState<EditMode>("remove");
  const [objectToAdd, setObjectToAdd] = React.useState("");
  const [imageDimensions, setImageDimensions] = React.useState({
    width: 0,
    height: 0,
  });
  const [isCanvasReady, setIsCanvasReady] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [canvasHistory, setCanvasHistory] = React.useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [maskBounds, setMaskBounds] = React.useState<MaskBounds | null>(null);
  const [showReplaceDialog, setShowReplaceDialog] = React.useState(false);
  const [pendingSubmitData, setPendingSubmitData] = React.useState<{
    maskDataUrl: string;
    prompt: string;
    mode: EditMode;
  } | null>(null);

  // Check if we're editing an older version
  const currentVersion = image.version || 1;
  const isEditingOldVersion = currentVersion < latestVersion;

  // Use result image if available, otherwise original
  const sourceImageUrl = image.resultImageUrl || image.originalImageUrl;

  // Step 1: Load image to get dimensions
  React.useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const container = containerRef.current;
      if (!container) return;

      // Calculate dimensions to fit container while maintaining aspect ratio
      const containerWidth = container.clientWidth - 64; // account for padding
      const containerHeight = container.clientHeight - 64;
      const imgAspect = img.width / img.height;
      const containerAspect = containerWidth / containerHeight;

      let canvasWidth: number;
      let canvasHeight: number;

      if (imgAspect > containerAspect) {
        canvasWidth = Math.min(containerWidth, img.width);
        canvasHeight = canvasWidth / imgAspect;
      } else {
        canvasHeight = Math.min(containerHeight, img.height);
        canvasWidth = canvasHeight * imgAspect;
      }

      setImageDimensions({ width: canvasWidth, height: canvasHeight });
      setImageLoaded(true);
    };

    img.onerror = () => {
      console.error("Failed to load image:", sourceImageUrl);
    };

    img.src = sourceImageUrl;
  }, [sourceImageUrl]);

  // Step 2: Initialize Fabric.js after canvas is rendered
  React.useEffect(() => {
    if (!imageLoaded || !canvasRef.current || imageDimensions.width === 0)
      return;

    // Dynamic import to avoid SSR issues
    const initFabric = async () => {
      const { Canvas, PencilBrush } = await import("fabric");

      // Dispose existing canvas if any
      if (fabricRef.current) {
        fabricRef.current.dispose();
      }

      const canvas = new Canvas(canvasRef.current!, {
        width: imageDimensions.width,
        height: imageDimensions.height,
        isDrawingMode: true,
        backgroundColor: "transparent",
      });

      // Set up brush with mode-based color
      const brush = new PencilBrush(canvas);
      brush.color = "rgba(239, 68, 68, 0.6)"; // Red for remove (default mode)
      brush.width = brushSize;
      canvas.freeDrawingBrush = brush;

      fabricRef.current = canvas;
      setIsCanvasReady(true);
    };

    initFabric();

    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageLoaded, imageDimensions]);

  // Update brush settings based on mode
  React.useEffect(() => {
    if (!fabricRef.current?.freeDrawingBrush || !isCanvasReady) return;

    fabricRef.current.freeDrawingBrush.width = brushSize;
    // Visual feedback colors - red for remove, green for add
    fabricRef.current.freeDrawingBrush.color =
      mode === "remove"
        ? "rgba(239, 68, 68, 0.6)" // Red for remove
        : "rgba(34, 197, 94, 0.6)"; // Green for add
  }, [brushSize, mode, isCanvasReady]);

  // Calculate mask bounds from paths
  const calculateMaskBounds = React.useCallback(() => {
    const paths = fabricRef.current?.getObjects("path");
    if (!paths?.length) {
      setMaskBounds(null);
      return;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = 0;
    let maxY = 0;

    paths.forEach((path) => {
      const bounds = path.getBoundingRect();
      minX = Math.min(minX, bounds.left);
      minY = Math.min(minY, bounds.top);
      maxX = Math.max(maxX, bounds.left + bounds.width);
      maxY = Math.max(maxY, bounds.top + bounds.height);
    });

    setMaskBounds({
      x: minX,
      y: maxY, // Position below the mask
      width: maxX - minX,
      height: maxY - minY,
    });
  }, []);

  // Track canvas history for undo
  React.useEffect(() => {
    if (!fabricRef.current || !isCanvasReady) return;

    const canvas = fabricRef.current;
    const handlePathCreated = () => {
      // Save current state before the new path for undo
      const json = JSON.stringify(canvas.toJSON());
      setCanvasHistory((prev) => [...prev, json]);
      // Calculate mask bounds for floating input positioning
      calculateMaskBounds();
    };

    canvas.on("path:created", handlePathCreated);
    return () => {
      canvas.off("path:created", handlePathCreated);
    };
  }, [isCanvasReady, calculateMaskBounds]);

  const handleUndo = React.useCallback(() => {
    if (!fabricRef.current || canvasHistory.length === 0) return;

    const canvas = fabricRef.current;
    // Remove the last state (current)
    const newHistory = canvasHistory.slice(0, -1);

    if (newHistory.length === 0) {
      // No more history, clear canvas
      canvas.clear();
      canvas.backgroundColor = "transparent";
      canvas.renderAll();
      setMaskBounds(null);
    } else {
      // Load previous state
      const prevState = newHistory[newHistory.length - 1];
      canvas.loadFromJSON(prevState, () => {
        canvas.renderAll();
        calculateMaskBounds();
      });
    }

    setCanvasHistory(newHistory);
  }, [canvasHistory, calculateMaskBounds]);

  const handleClear = React.useCallback(() => {
    if (!fabricRef.current) return;
    fabricRef.current.clear();
    fabricRef.current.backgroundColor = "transparent";
    fabricRef.current.renderAll();
    setCanvasHistory([]);
    setMaskBounds(null);
    setObjectToAdd("");
  }, []);

  // Track cursor position for brush preview
  const handleCanvasMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setCursorPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [],
  );

  const handleCanvasMouseLeave = React.useCallback(() => {
    setCursorPosition(null);
  }, []);

  // Execute the actual API call
  const executeInpaint = React.useCallback(
    async (
      maskDataUrl: string,
      prompt: string,
      editMode: EditMode,
      replaceNewerVersions: boolean,
    ) => {
      const result = await inpaint(
        image.id,
        maskDataUrl,
        prompt,
        editMode,
        replaceNewerVersions,
      );

      if (result.success) {
        // The task is now running in the background
        // Close the editor and let the project detail page poll/track progress
        router.refresh();
        onClose();
      }
    },
    [image.id, inpaint, router, onClose],
  );

  // Handle confirmed replace
  const handleConfirmReplace = React.useCallback(async () => {
    if (!pendingSubmitData) return;

    setShowReplaceDialog(false);
    await executeInpaint(
      pendingSubmitData.maskDataUrl,
      pendingSubmitData.prompt,
      pendingSubmitData.mode,
      true, // replaceNewerVersions
    );
    setPendingSubmitData(null);
  }, [pendingSubmitData, executeInpaint]);

  const handleSubmit = React.useCallback(async () => {
    if (!fabricRef.current) return;
    if (mode === "add" && !objectToAdd.trim()) return;

    // Auto-generate prompt based on mode
    let generatedPrompt: string;
    if (mode === "remove") {
      generatedPrompt =
        "Empty background, seamless continuation of the surrounding walls, floor and room environment, clean space, no objects";
    } else {
      // For Add mode, use Nano Banana with a descriptive prompt
      const object = objectToAdd.trim().toLowerCase();
      generatedPrompt = `Interior room photo with a ${object} added. Keep the existing furniture, walls, and layout exactly the same. Add a stylish ${object} that matches the room's aesthetic and lighting.`;
    }

    // Helper to proceed with submission (or show dialog)
    const proceedWithSubmit = async (maskDataUrl: string) => {
      if (isEditingOldVersion) {
        // Show confirmation dialog
        setPendingSubmitData({ maskDataUrl, prompt: generatedPrompt, mode });
        setShowReplaceDialog(true);
      } else {
        // Submit directly
        await executeInpaint(maskDataUrl, generatedPrompt, mode, false);
      }
    };

    if (mode === "remove") {
      // REMOVE MODE: Create mask and use FLUX Fill
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = imageDimensions.width;
      tempCanvas.height = imageDimensions.height;
      const tempCtx = tempCanvas.getContext("2d");

      if (!tempCtx) return;

      // Fill with black (no edit areas)
      tempCtx.fillStyle = "black";
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw the fabric canvas content - convert colored strokes to white for mask
      const fabricCanvas = fabricRef.current;
      const originalPaths = fabricCanvas.getObjects("path");

      // Temporarily change all path colors to white for the mask
      originalPaths.forEach((path) => {
        path.set("stroke", "white");
      });
      fabricCanvas.renderAll();

      const fabricDataUrl = fabricCanvas.toDataURL({
        format: "png",
        multiplier: 1,
      });

      // Restore original colors
      originalPaths.forEach((path) => {
        path.set("stroke", "rgba(239, 68, 68, 0.6)");
      });
      fabricCanvas.renderAll();

      const maskImg = new window.Image();
      maskImg.onload = async () => {
        tempCtx.drawImage(maskImg, 0, 0);

        // Get the final mask as data URL
        const maskDataUrl = tempCanvas.toDataURL("image/png");

        await proceedWithSubmit(maskDataUrl);
      };
      maskImg.src = fabricDataUrl;
    } else {
      // ADD MODE: Use Nano Banana (no mask needed)
      await proceedWithSubmit("");
    }
  }, [mode, objectToAdd, imageDimensions, isEditingOldVersion, executeInpaint]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isProcessing]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-black/50 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">Edit Image</h2>

          {/* Mode selector */}
          <div className="flex items-center gap-1 rounded-lg bg-white/10 p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMode("remove")}
              className={cn(
                "gap-1.5 text-white hover:bg-white/20 hover:text-white",
                mode === "remove" && "bg-red-500/30",
              )}
            >
              <IconTrash className="h-4 w-4" />
              Remove Object
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMode("add")}
              className={cn(
                "gap-1.5 text-white hover:bg-white/20 hover:text-white",
                mode === "add" && "bg-green-500/30",
              )}
            >
              <IconPlus className="h-4 w-4" />
              Add Object
            </Button>
          </div>

          {/* Brush size */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/70">Size:</span>
            <Slider
              value={[brushSize]}
              onValueChange={([value]) => setBrushSize(value)}
              min={5}
              max={100}
              step={5}
              className="w-32"
            />
            <span className="w-8 text-sm tabular-nums text-white/70">
              {brushSize}
            </span>
          </div>

          {/* Undo button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={canvasHistory.length === 0}
            className="gap-1.5 text-white hover:bg-white/20 hover:text-white disabled:opacity-40"
          >
            <IconArrowBackUp className="h-4 w-4" />
            Undo
          </Button>

          {/* Clear button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="gap-1.5 text-white/70 hover:bg-white/20 hover:text-white"
          >
            Clear
          </Button>
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          disabled={isProcessing}
          className="text-white hover:bg-white/20 hover:text-white"
        >
          <IconX className="h-5 w-5" />
        </Button>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className="relative flex flex-1 items-center justify-center overflow-hidden p-8"
      >
        {/* Loading state */}
        {!imageLoaded && (
          <div className="flex items-center gap-2 text-white/70">
            <IconLoader2 className="h-5 w-5 animate-spin" />
            Loading image...
          </div>
        )}

        {/* Background image + Canvas */}
        {imageLoaded && imageDimensions.width > 0 && (
          <div
            className="relative"
            style={{
              width: imageDimensions.width,
              height: imageDimensions.height,
            }}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={handleCanvasMouseLeave}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sourceImageUrl}
              alt="Source"
              className="absolute inset-0 h-full w-full rounded-lg object-cover"
            />

            {/* Canvas overlay */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 rounded-lg"
              style={{ cursor: "none" }}
            />

            {/* Brush size preview cursor */}
            {isCanvasReady && cursorPosition && (
              <div
                className="pointer-events-none absolute rounded-full border-2"
                style={{
                  width: brushSize,
                  height: brushSize,
                  left: cursorPosition.x - brushSize / 2,
                  top: cursorPosition.y - brushSize / 2,
                  borderColor:
                    mode === "remove" ? "rgb(239, 68, 68)" : "rgb(34, 197, 94)",
                  backgroundColor:
                    mode === "remove"
                      ? "rgba(239, 68, 68, 0.2)"
                      : "rgba(34, 197, 94, 0.2)",
                }}
              />
            )}

            {/* Canvas loading indicator */}
            {!isCanvasReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                <IconLoader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}

            {/* Floating input panel for Add mode */}
            {mode === "add" && maskBounds && canvasHistory.length > 0 && (
              <div
                className="absolute z-10 w-64 rounded-lg border border-white/20 bg-black/90 p-3 shadow-xl backdrop-blur-sm"
                style={{
                  left: Math.max(
                    0,
                    Math.min(maskBounds.x, imageDimensions.width - 256),
                  ),
                  top: Math.min(
                    maskBounds.y + 12,
                    imageDimensions.height - 160,
                  ),
                }}
              >
                <p className="mb-2 text-xs font-medium text-white/70">
                  Quick add:
                </p>
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {OBJECT_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setObjectToAdd(suggestion)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                        objectToAdd === suggestion
                          ? "bg-green-500 text-white"
                          : "bg-white/10 text-white/80 hover:bg-white/20",
                      )}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={objectToAdd}
                    onChange={(e) => setObjectToAdd(e.target.value)}
                    placeholder="Or type custom…"
                    className="h-8 flex-1 border-white/20 bg-white/10 text-sm text-white placeholder:text-white/40"
                    disabled={isProcessing}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && objectToAdd.trim()) {
                        handleSubmit();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing || !objectToAdd.trim()}
                    size="sm"
                    className="h-8 gap-1.5 bg-green-500 hover:bg-green-600"
                  >
                    {isProcessing ? (
                      <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <IconSparkles className="h-3.5 w-3.5" />
                    )}
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-black/50 px-4 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-3">
          {mode === "remove" ? (
            <>
              <p className="text-white/70">
                Draw on the object you want to remove
              </p>
              <Button
                onClick={handleSubmit}
                disabled={
                  isProcessing || !isCanvasReady || canvasHistory.length === 0
                }
                className="gap-2 min-w-[120px] bg-red-500 hover:bg-red-600"
              >
                {isProcessing ? (
                  <>
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <IconSparkles className="h-4 w-4" />
                    Remove
                  </>
                )}
              </Button>
            </>
          ) : (
            <p className="text-white/70">
              {canvasHistory.length === 0
                ? "Draw where you want to add the object"
                : "Select or type what to add in the panel above"}
            </p>
          )}
        </div>

        {error && (
          <p className="mt-2 text-center text-sm text-red-400">{error}</p>
        )}

        <p className="mt-2 text-center text-xs text-white/50">
          {mode === "remove"
            ? "The AI will fill the marked area with seamless background."
            : "The AI will add the object matching the room's style."}
        </p>
      </div>

      {/* Replace versions confirmation dialog */}
      <AlertDialog open={showReplaceDialog} onOpenChange={setShowReplaceDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace newer versions?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;re editing version {currentVersion}. This will replace{" "}
              {latestVersion - currentVersion === 1
                ? `version ${latestVersion}`
                : `versions ${currentVersion + 1} through ${latestVersion}`}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingSubmitData(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReplace}
              className="bg-red-500 hover:bg-red-600"
            >
              Replace &amp; Edit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
