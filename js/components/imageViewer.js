import { formatFileSize } from "../utils/format.js";

/**
 * Images, current position and zoom level of the open image viewer.
 */
let viewerImages = [];
let currentIndex = 0;
let zoomLevel = 1;

/**
 * Shows the current image with its name, size and download link and resets the zoom.
 */
function showCurrentImage() {
  const image = viewerImages[currentIndex];
  document.querySelector(".viewer__image").src = image.base64;
  document.querySelector(".viewer__name").textContent = image.name;
  document.querySelector(".viewer__size").textContent = formatFileSize(image.size);
  zoomLevel = 1;
  changeZoom(0);

  const download = document.querySelector(".viewer__download");
  download.href = image.base64;
  download.download = image.name;
}

/**
 * Opens the image viewer with the given images at the given position.
 * @param {Array<{name: string, size: number, base64: string}>} images - The images of the task
 * @param {number} index - The position of the image to show first
 */
export function openImageViewer(images, index) {
  viewerImages = images;
  currentIndex = index;
  const hasSeveral = images.length > 1;
  document.querySelectorAll(".viewer__arrow").forEach((arrow) => (arrow.hidden = !hasSeveral));
  showCurrentImage();
  document.querySelector(".viewer").showModal();
}

/**
 * Shows the next image, or the first one when the last is shown.
 */
function showNextImage() {
  currentIndex = (currentIndex + 1) % viewerImages.length;
  showCurrentImage();
}

/**
 * Shows the previous image, or the last one when the first is shown.
 */
function showPreviousImage() {
  currentIndex = (currentIndex - 1 + viewerImages.length) % viewerImages.length;
  showCurrentImage();
}

/**
 * Changes the zoom level of the image, kept between 1 and 3.
 * @param {number} step - The amount to add, e.g. 0.5 or -0.5
 */
function changeZoom(step) {
  zoomLevel = Math.min(3, Math.max(1, zoomLevel + step));
  document.querySelector(".viewer__image").style.setProperty("--zoom", zoomLevel);
}

/**
 * Slides the image viewer down and closes it when the animation has finished.
 * @param {Event} event - The click or keydown event that closes the viewer
 */
function closeViewerAnimated(event) {
  event.preventDefault();
  const viewer = document.querySelector(".viewer");
  viewer.classList.add("viewer--closing");
  viewer.addEventListener(
    "animationend",
    () => {
      viewer.classList.remove("viewer--closing");
      viewer.close();
    },
    { once: true },
  );
}

/**
 * Handles all clicks in the image viewer via data-action and closes it on a backdrop click.
 * @param {MouseEvent} event - The click event
 */
function handleViewerClick(event) {
  const viewer = event.currentTarget;
  if (event.target === viewer) closeViewerAnimated(event);
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "close-viewer") closeViewerAnimated(event);
  if (action === "next-image") showNextImage();
  if (action === "previous-image") showPreviousImage();
  if (action === "zoom-in") changeZoom(0.5);
  if (action === "zoom-out") changeZoom(-0.5);
}

/**
 * Shows the next or previous image with the arrow keys.
 * @param {KeyboardEvent} event - The keydown event
 */
function handleViewerKey(event) {
  if (event.key === "ArrowRight") showNextImage();
  if (event.key === "ArrowLeft") showPreviousImage();
  if (event.key === "Escape") closeViewerAnimated(event);
}

/**
 * Registers the click and keyboard listeners of the image viewer.
 */
export function initImageViewer() {
  const viewer = document.querySelector(".viewer");
  viewer.addEventListener("click", handleViewerClick);
  viewer.addEventListener("keydown", handleViewerKey);
}
