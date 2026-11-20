import { validateImageFile, compressImage } from "../utils/imageFiles.js";
import { AVATAR_DIMENSION } from "../utils/constants.js";
import { showMessage } from "./toast.js";

/**
 * Photo of the contact in the dialog as a data URL, or null if there is none.
 * @type {string|null}
 */
let dialogPhoto = null;

/**
 * Shows the photo, the initials or the default icon in the dialog avatar and toggles the remove button.
 */
function renderDialogPhoto() {
  const avatar = document.querySelector(".contact-dialog__avatar--initials");
  const showAvatar = Boolean(dialogPhoto || avatar.dataset.initials);
  avatar.innerHTML = dialogPhoto
    ? `<img class="avatar-photo" src="${dialogPhoto}" alt="">`
    : avatar.dataset.initials || "";
  avatar.classList.toggle("contact-dialog__avatar--hidden", !showAvatar);
  document
    .querySelector(".contact-dialog__avatar--icon")
    .classList.toggle("contact-dialog__avatar--hidden", showAvatar);
  document.querySelector(".contact-dialog__photo-btn--remove").hidden = !dialogPhoto;
}

/**
 * Sets the photo shown in the dialog, e.g. the saved photo when editing or null for a new contact.
 * @param {string|null} [photo] - The photo as a data URL
 */
export function setDialogPhoto(photo = null) {
  dialogPhoto = photo;
  renderDialogPhoto();
}

/**
 * Returns the photo that is currently in the dialog.
 * @returns {string|null} The photo as a data URL, or null if there is none
 */
export function getDialogPhoto() {
  return dialogPhoto;
}

/**
 * Validates and compresses the selected photo and shows it in the dialog.
 * @param {Event} event - The change event
 * @returns {Promise<void>}
 */
async function handlePhotoChange(event) {
  if (!event.target.matches(".contact-dialog__photo-input")) return;
  const file = event.target.files[0];
  event.target.value = "";
  const error = validateImageFile(file);
  if (error) return showMessage(error);
  setDialogPhoto(await compressImage(file, AVATAR_DIMENSION));
}

/**
 * Removes the photo when the remove button is clicked.
 * @param {MouseEvent} event - The click event
 */
function handlePhotoClick(event) {
  if (event.target.closest('[data-action="remove-photo"]')) setDialogPhoto(null);
}

/**
 * Registers the listeners for choosing and removing the contact photo.
 */
export function initContactPhoto() {
  const dialog = document.querySelector(".contact-dialog");
  dialog.addEventListener("change", handlePhotoChange);
  dialog.addEventListener("click", handlePhotoClick);
}
