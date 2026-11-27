import { isValidEmail } from "../utils/validators.js";
import { getInitials } from "../utils/format.js";
import { initContactPhoto, setDialogPhoto } from "./contactPhoto.js";

const PHONE_PATTERN = /^[+\d\s\-()]{6,20}$/;
const CONTACT_FIELDS = {
  name: { input: ".contact-dialog__input--name", error: ".contact-dialog__error--name", check: getNameError },
  email: { input: ".contact-dialog__input--email", error: ".contact-dialog__error--email", check: getEmailError },
  phone: { input: ".contact-dialog__input--phone", error: ".contact-dialog__error--phone", check: getPhoneError },
};

let contactList = [];

/**
 * Stores the contacts the email check compares against.
 * @param {Object[]} contacts - All contacts with id and email
 */
export function setContactList(contacts) {
  contactList = contacts;
}

/**
 * Checks whether another contact already uses the given email address.
 * @param {string} email - The email address to check
 * @param {string} [contactId] - The contact being edited, it is skipped
 * @returns {boolean} True if the email is already taken
 */
function isEmailTaken(email, contactId) {
  const wanted = email.trim().toLowerCase();
  return contactList.some((contact) => contact.id !== contactId && contact.email.toLowerCase() === wanted);
}

/**
 * Validates a dialog field when it loses focus.
 * @param {FocusEvent} event - The focusout event
 */
export function handleFieldBlur(event) {
  const field = event.target.dataset.field;
  if (!field || event.target.readOnly) return;
  validateField(field, document.querySelector(".contact-dialog__submit").dataset.id);
}

/**
 * Returns the name value from the contact dialog input.
 * @returns {string} The trimmed name input value
 */
export function getContactName() {
  return document.querySelector(".contact-dialog__input--name").value.trim();
}

/**
 * Returns the email value from the contact dialog input.
 * @returns {string} The trimmed email input value
 */
export function getContactEmailAdress() {
  return document.querySelector(".contact-dialog__input--email").value.trim();
}

/**
 * Returns the phone value from the contact dialog input.
 * @returns {string} The trimmed phone input value
 */
export function getContactPhone() {
  return document.querySelector(".contact-dialog__input--phone").value.trim();
}

/**
 * Returns the error message for the name field or an empty string.
 * @param {string} name - The entered name
 * @returns {string} The error message
 */
function getNameError(name) {
  return name ? "" : "This field is required";
}

/**
 * Returns the error message for the email field or an empty string.
 * @param {string} email - The entered email address
 * @param {string} [contactId] - The contact being edited
 * @returns {string} The error message
 */
function getEmailError(email, contactId) {
  if (!email) return "This field is required";
  if (!isValidEmail(email)) return "Please enter a valid email address";
  if (isEmailTaken(email, contactId)) return "This email address already exists";
  return "";
}

/**
 * Returns the error message for the phone field or an empty string.
 * @param {string} phone - The entered phone number
 * @returns {string} The error message
 */
function getPhoneError(phone) {
  if (!phone) return "This field is required";
  return PHONE_PATTERN.test(phone) ? "" : "Please enter a valid phone number";
}

/**
 * Validates one field, shows or clears its error and returns whether it is valid.
 * @param {string} field - The field name ("name", "email" or "phone")
 * @param {string} [contactId] - The contact being edited
 * @returns {boolean} True if the field is valid
 */
function validateField(field, contactId) {
  const { input, error, check } = CONTACT_FIELDS[field];
  const message = check(document.querySelector(input).value.trim(), contactId);
  if (message) showError(input, error, message);
  else clearError(input, error);
  return !message;
}

/**
 * Validates all fields of the contact dialog.
 * @param {string} [contactId] - The contact being edited
 * @returns {boolean} True if all fields are valid
 */
export function validateInputs(contactId) {
  const results = Object.keys(CONTACT_FIELDS).map((field) => validateField(field, contactId));
  return results.every(Boolean);
}

/**
 * Marks an input field as invalid and displays an error message below it.
 * @param {string} inputSelector - The selector of the input element to mark as invalid
 * @param {string} errorSelector - The selector of the error message element
 * @param {string} message - The error message to display
 */
function showError(inputSelector, errorSelector, message) {
  const input = document.querySelector(inputSelector);
  const err = document.querySelector(errorSelector);
  input.style.borderColor = "var(--error-color)";
  err.textContent = message;
  err.classList.add("contact-dialog__error--visible");
}

/**
 * Removes the error state of one field.
 * @param {string} inputSelector - The selector of the input element
 * @param {string} errorSelector - The selector of the error message element
 */
function clearError(inputSelector, errorSelector) {
  document.querySelector(inputSelector).style.borderColor = "";
  const err = document.querySelector(errorSelector);
  err.textContent = "";
  err.classList.remove("contact-dialog__error--visible");
}

/**
 * Clears all validation errors from the contact dialog input fields.
 */
export function clearErrors() {
  Object.values(CONTACT_FIELDS).forEach(({ input, error }) => clearError(input, error));
}

/**
 * Registers the listeners of the contact dialog.
 */
export function initContactDialog() {
  const dialog = document.querySelector(".contact-dialog");
  dialog.addEventListener("click", handleOverlayClick);
  dialog.addEventListener("focusout", handleFieldBlur);
  initContactPhoto();
}

/**
 * Closes the dialog when the dark overlay or a close button is clicked.
 * @param {MouseEvent} event - The click event
 */
function handleOverlayClick(event) {
  const isCloseButton = event.target.closest('[data-action="close-dialog"]');
  if (event.target === event.currentTarget || isCloseButton) closeContactDialog();
}

/**
 * Opens the contact dialog overlay.
 */
export function openContactDialog() {
  document.querySelector(".contact-dialog").classList.add("contact-dialog--open");
}

/**
 * Closes the contact dialog overlay
 */
export function closeContactDialog() {
  document.querySelector(".contact-dialog").classList.remove("contact-dialog--open");
  clearDialogInputs();
  clearErrors();
  resetDialog();
}

/**
 * Clears all input fields in the contact dialog.
 */
function clearDialogInputs() {
  document.querySelector(".contact-dialog__input--name").value = "";
  document.querySelector(".contact-dialog__input--email").value = "";
  document.querySelector(".contact-dialog__input--phone").value = "";
}

/**
 * Shows the initials of the edited contact in its avatar color instead of the default icon.
 * @param {Object} contact - The contact with name and color
 */
export function showContactAvatar(contact) {
  const initials = document.querySelector(".contact-dialog__avatar--initials");
  initials.dataset.initials = getInitials(contact.name);
  initials.style.backgroundColor = contact.color;
  setDialogPhoto(contact.photo);
}

/**
 * Resets the contact dialog to its default "Add contact" state.
 */
function resetDialog() {
  const cancelBtn = document.querySelector(".contact-dialog__cancel");
  const submitBtn = document.querySelector(".contact-dialog__submit");
  cancelBtn.textContent = "Cancel ✕";
  cancelBtn.dataset.action = "close-dialog";
  submitBtn.textContent = "Create contact ✓";
  submitBtn.dataset.action = "submit";
  delete submitBtn.dataset.id;
  document.querySelector(".contact-dialog__title").textContent = "Add contact";
  document.querySelector(".contact-dialog__text").hidden = false;
  delete document.querySelector(".contact-dialog__avatar--initials").dataset.initials;
  setDialogPhoto(null);
  document.querySelector(".contact-dialog").classList.remove("contact-dialog--account");
  setDialogReadOnly(false);
}

/**
 * Locks or unlocks the dialog fields, e.g. for viewing the own account before editing it.
 * @param {boolean} readOnly - True to lock the fields and hide the photo buttons
 */
export function setDialogReadOnly(readOnly) {
  document.querySelector(".contact-dialog").classList.toggle("contact-dialog--readonly", readOnly);
  document.querySelectorAll(".contact-dialog__input").forEach((input) => (input.readOnly = readOnly));
}
