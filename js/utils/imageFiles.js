import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_DIMENSION, IMAGE_QUALITY } from "./constants.js";

/**
 * Checks whether a file is an allowed image type (JPG or PNG).
 * @param {File} file - The file selected by the user.
 * @returns {string|null} An error message, or null if the file is valid.
 */
export function validateImageFile(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `"${file.name}" is not a JPG or PNG file.`;
  }
  return null;
}

/**
 * Reads a file and returns its content as a data URL (base64).
 * @param {File} file - The image file to read.
 * @returns {Promise<string>} Resolves with the data URL of the file.
 */
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", (event) => resolve(event.target.result));
    reader.addEventListener("error", () => reject("Could not read file."));
    reader.readAsDataURL(file);
  });
}

/**
 * Loads a data URL into an image element.
 * @param {string} dataUrl - The data URL of the image.
 * @returns {Promise<HTMLImageElement>} Resolves with the loaded image.
 */
function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject("Could not load image."));
    image.src = dataUrl;
  });
}

/**
 * Calculates the scaled size of an image so that its longest side
 * is at most MAX_IMAGE_DIMENSION, keeping the aspect ratio.
 * @param {HTMLImageElement} image - The loaded image.
 * @returns {{width: number, height: number}} The new width and height in pixels.
 */
function calculateImageSize(image) {
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / image.width, MAX_IMAGE_DIMENSION / image.height);
  return {
    width: Math.round(image.width * scale),
    height: Math.round(image.height * scale),
  };
}

/**
 * Draws an image scaled down onto a canvas and exports it as a data URL.
 * Keeps the original format, the quality is only used for JPEG.
 * @param {HTMLImageElement} image - The loaded image.
 * @param {string} type - The MIME type of the original file, e.g. "image/png".
 * @returns {string} The compressed image as a data URL (base64).
 */
function drawImageToDataUrl(image, type) {
  const { width, height } = calculateImageSize(image);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL(type, IMAGE_QUALITY);
}

/**
 * Compresses an image file to at most MAX_IMAGE_DIMENSION pixels
 * and returns it as a data URL in its original format.
 * @param {File} file - A validated JPG or PNG file.
 * @returns {Promise<string>} Resolves with the compressed image as a data URL (base64).
 */
export async function compressImage(file) {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  return drawImageToDataUrl(image, file.type);
}

/**
 * Calculates the size in bytes of the base64 content of a data URL.
 * @param {string} dataUrl - The data URL, e.g. "data:image/jpeg;base64,...".
 * @returns {number} The size in bytes.
 */
export function getDataUrlSize(dataUrl) {
  const base64 = dataUrl.split(",")[1];
  return Math.round((base64.length * 3) / 4);
}
