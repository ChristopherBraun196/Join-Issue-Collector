/**
 * Task status values, used as board column IDs and stored in Firebase.
 * @readonly
 * @enum {string}
 */
export const STATUS = {
  TRIAGE: "triage",
  TO_DO: "toDo",
  IN_PROGRESS: "inProgress",
  AWAIT: "await",
  DONE: "done",
};

/**
 * Image MIME types allowed for task attachments.
 * @type {string[]}
 */
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

/**
 * Maximum size of an original image file in bytes (1 MB).
 * @type {number}
 */
export const MAX_IMAGE_SIZE = 1024 * 1024;

/**
 * Maximum width and height of a compressed image in pixels.
 * @type {number}
 */
export const MAX_IMAGE_DIMENSION = 800;

/**
 * Quality of compressed JPEG images (0 to 1).
 * @type {number}
 */
export const IMAGE_QUALITY = 0.8;

/**
 * Maximum width and height of a contact photo in pixels.
 * @type {number}
 */
export const AVATAR_DIMENSION = 200;
