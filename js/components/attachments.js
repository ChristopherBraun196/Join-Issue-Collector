import { validateImageFile, compressImage, getDataUrlSize } from "../utils/imageFiles.js";
import { MAX_IMAGE_SIZE } from "../utils/constants.js";
import { getAttachmentItemTemplate } from "../templates/addTaskTemplates.js";

/**
 * Compressed images of the task that is being created or edited.
 * @type {Array<{name: string, type: string, size: number, base64: string}>}
 */
export const attachments = [];

/**
 * State of the current mouse drag on the thumbnail list, null if not dragging.
 * @type {{list: HTMLElement, startX: number, startScroll: number, moved: boolean}|null}
 */
let listDrag = null;

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
  document.querySelector(".attachments .attachments__input").value = "";
  renderAttachments();
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
  document.querySelector(".attachments .attachments__error").textContent = message;
}

/**
 * Renders the thumbnail preview list and shows "Delete all" only if there are images.
 */
export function renderAttachments() {
  const list = document.querySelector(".attachments .attachments__list");

  list.innerHTML = attachments.map(getAttachmentItemTemplate).join("");
  document.querySelector(".attachments .attachments__delete-all").hidden = attachments.length === 0;
}

/**
 * Allows dropping on the drop zone and highlights it.
 * @param {DragEvent} event - The dragover event
 */
function handleDragOver(event) {
  const dropzone = event.target.closest(".attachments__dropzone");
  if (!dropzone) return;
  event.preventDefault();
  dropzone.classList.add("attachments__dropzone--active");
}

/**
 * Removes the drop zone highlight when the dragged file leaves it.
 * @param {DragEvent} event - The dragleave event
 */
function handleDragLeave(event) {
  const dropzone = event.target.closest(".attachments__dropzone");
  if (!dropzone) return;
  dropzone.classList.remove("attachments__dropzone--active");
}

/**
 * Adds the dropped files to the attachments.
 * @param {DragEvent} event - The drop event
 */
function handleDrop(event) {
  const dropzone = event.target.closest(".attachments__dropzone");
  if (!dropzone) return;
  event.preventDefault();
  dropzone.classList.remove("attachments__dropzone--active");
  addAttachments(event.dataTransfer.files);
}

/**
 * Registers the drag and drop listeners for the attachments drop zone.
 * @param {HTMLElement} container - The add task section or the add task dialog
 */
export function initAttachmentDrop(container) {
  container.addEventListener("dragover", handleDragOver);
  container.addEventListener("dragleave", handleDragLeave);
  container.addEventListener("drop", handleDrop);
  container.addEventListener("pointerdown", startListDrag);
  document.addEventListener("pointermove", moveListDrag);
  document.addEventListener("pointerup", endListDrag);
}

/**
 * Removes one image from the attachments and updates the preview.
 * @param {number} index - The position of the image in the attachments array
 */
function removeAttachment(index) {
  attachments.splice(index, 1);
  renderAttachments();
}

/**
 * Removes all images from the attachments and updates the preview.
 */
export function clearAttachments() {
  attachments.length = 0;
  renderAttachments();
}

/**
 * Replaces the attachments with the images of an existing task and shows them.
 * @param {Array<{name: string, type: string, size: number, base64: string}>} [images] - The images of the task
 */
export function loadAttachments(images = []) {
  attachments.length = 0;
  attachments.push(...images);
  renderAttachments();
}

/**
 * Runs the attachment action that belongs to the clicked data-action.
 * @param {string} action - The data-action value of the clicked element
 * @param {HTMLElement} target - The clicked element with the data-action
 */
export function handleAttachmentAction(action, target) {
  if (action === "remove-attachment") removeAttachment(Number(target.dataset.index));
  if (action === "delete-all-attachments") clearAttachments();
}

/**
 * Starts dragging the thumbnail list with the mouse.
 * @param {PointerEvent} event - The pointerdown event
 */
function startListDrag(event) {
  const list = event.target.closest(".attachments__list, .task-dialog__avatars");
  if (!list || event.pointerType !== "mouse") return;
  listDrag = { list, startX: event.clientX, startScroll: list.scrollLeft, moved: false };
}

/**
 * Scrolls the thumbnail list along with the mouse.
 * @param {PointerEvent} event - The pointermove event
 */
function moveListDrag(event) {
  if (!listDrag) return;
  const distance = event.clientX - listDrag.startX;
  if (Math.abs(distance) > 5) listDrag.moved = true;
  listDrag.list.scrollLeft = listDrag.startScroll - distance;
}

/**
 * Ends the drag and blocks the following click if the list was really dragged.
 */
function endListDrag() {
  if (!listDrag) return;
  const { list, moved } = listDrag;
  listDrag = null;
  if (!moved) return;
  list.addEventListener("click", stopClick, true);
  setTimeout(() => list.removeEventListener("click", stopClick, true));
}

/**
 * Stops the click that the browser fires after a drag, so no image is removed by accident.
 * @param {MouseEvent} event - The click event
 */
function stopClick(event) {
  event.stopPropagation();
}

/**
 * Adds the selected files when the attachments file input changes.
 * @param {Event} event - The change event
 */
export function handleAttachmentChange(event) {
  if (event.target.matches(".attachments__input")) addAttachments(event.target.files);
}
