// Re-export all server actions

export {
  bulkUpdateImageRoomTypes,
  createSignedUploadUrls,
  deleteProjectImage,
  deleteSelectedImages,
  type ImageWithRunId,
  recordUploadedImages,
  regenerateImage,
  retryImageProcessing,
  startProjectProcessing,
  triggerInpaintTask,
  updateImageRoomType,
  updateImageStatus,
} from "./images";
export { completeOnboarding } from "./onboarding";
export {
  type ActionResult,
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "./projects";
export {
  updateWorkspaceSettings,
  type WorkspaceActionResult,
} from "./workspace";
