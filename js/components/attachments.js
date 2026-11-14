import { validateImageFile, compressImage, getDataUrlSize } from "../utils/imageFiles.js";
import { MAX_IMAGE_SIZE } from "../utils/constants.js";

/**
 * Compressed images of the task that is being created or edited.
 * @type {{name: string, type: string, size: number, base64: string}[]}
 */
export const attachments = [];

/**
 * Validates and compresses the selected files one after another
 * and adds the valid ones to the attachments array.
 * @param {FileList|File[]} files - The files from the file input or a drop event.
 * @returns {Promise<void>}
 */
export async function addAttachments(files) {
  showAttachmentError("");
  for (const file of files) {
    await processFile(file);
  }
}

/**
 * Validates and compresses one file, then adds it to the attachments
 * or shows an error if it is not allowed or still too large.
 * @param {File} file - The file to process.
 * @returns {Promise<void>}
 */
async function processFile(file) {
  const error = validateImageFile(file);
  if (error) {
    showAttachmentError(error);
    return;
  }
  const base64 = await compressImage(file);
  const size = getDataUrlSize(base64);
  if (size > MAX_IMAGE_SIZE) {
    showAttachmentError(`"${file.name}" is still larger than 1 MB after compression.`);
    return;
  }
  attachments.push({ name: file.name, type: file.type, size, base64 });
}

/**
 * Shows an error message below the attachments drop zone.
 * @param {string} message - The message to show, an empty string hides it.
 */
function showAttachmentError(message) {
  document.querySelector(".task-form .attachments__error").textContent = message;
}
