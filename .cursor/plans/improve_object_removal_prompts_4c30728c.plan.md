# Improve Object Removal Prompts

## Current Problem

The current implementation in [`components/dashboard/image-mask-editor.tsx`](components/dashboard/image-mask-editor.tsx) uses a hardcoded prompt:
```typescript
"Empty background, seamless continuation of the surrounding walls, floor and room environment, clean space, no objects"
```

This is too generic and doesn't account for:
- Multiple objects being removed (e.g., 3 wall mounted images, a pet on a sofa)
- Different image contexts (not just interior rooms)
- User context about what they're actually removing

## Solution Approach

**User-driven prompt generation**: Prompt the user to describe the masked object(s) when they click "Remove", then use that description in a template prompt.

### Implementation

1. **Add a dialog/modal** that appears when the user clicks "Remove" button
2. **Prompt the user** to describe what object(s) they've masked (e.g., "3 wall mounted pictures", "pet on sofa", "framed picture")
3. **Use the description** in a prompt template: `Remove the ${objectDescription} and realistically fill in the background.`

## Implementation Plan

### 1. Add State for Object Description Dialog

In [`components/dashboard/image-mask-editor.tsx`](components/dashboard/image-mask-editor.tsx):

- Add state: `objectDescription` (string) and `showObjectDescriptionDialog` (boolean)
- Store the object description from user input

### 2. Modify handleSubmit Function

Update the `handleSubmit` function (around line 331):

- For "remove" mode, before creating the mask, check if `objectDescription` exists
- If not, show the description dialog instead of proceeding
- Once description is provided, use it in the prompt: `Remove the ${objectDescription} and realistically fill in the background.`

### 3. Add Object Description Dialog

Create a dialog similar to the existing "Replace versions" dialog (lines 684-709):

- Title: "What object(s) are you removing?"
- Input field for user to describe the masked object(s)
- Examples/hints: "e.g., '3 wall mounted pictures', 'pet on sofa', 'framed picture'"
- Cancel and "Continue" buttons
- On "Continue", store the description and proceed with removal using the generated prompt

### 4. Update Prompt Generation

Replace the hardcoded prompt (lines 337-339) with:
```typescript
const generatedPrompt = `Remove the ${objectDescription} and realistically fill in the background.`;
```

## Files to Modify

1. **Modify**: [`components/dashboard/image-mask-editor.tsx`](components/dashboard/image-mask-editor.tsx)
   - Add state for object description and dialog
   - Add dialog component for object description input
   - Update `handleSubmit` to prompt for description
   - Update prompt generation to use user's description

## User Flow

1. User draws mask on object(s) to remove
2. User clicks "Remove" button
3. Dialog appears asking: "What object(s) are you removing?"
4. User types description (e.g., "3 wall mounted pictures")
5. User clicks "Continue"
6. Prompt is generated: "Remove the 3 wall mounted pictures and realistically fill in the background."
7. Removal proceeds with the contextual prompt

## Benefits

- **User control**: User provides context about what they're removing
- **Better results**: More specific prompts lead to better inpainting
- **Handles multiple objects**: Users can describe multiple objects naturally
- **Flexible**: Works for any object type without hardcoding scenarios
