import { generateUUID } from "../../utils/ids.js";
import { selectRandomAvatarColor } from "../../utils/avatar.js";
import { showMessage } from "../../components/toast.js";
import { loadData, putData, updateData, deleteData } from "../../services/database.js";
import { clearActiveContact, loadContacts, getActiveContactData, isEmailTaken } from "./contacts.js";
import { isValidEmail } from "../../utils/validators.js";

const PHONE_PATTERN = /^[+\d\s\-()]{6,20}$/;
const CONTACT_FIELDS = {
  name: { input: ".contact-dialog__input--name", error: ".contact-dialog__error--name", check: getNameError },
  email: { input: ".contact-dialog__input--email", error: ".contact-dialog__error--email", check: getEmailError },
  phone: { input: ".contact-dialog__input--phone", error: ".contact-dialog__error--phone", check: getPhoneError },
};

/**
 * Registers the listeners of the contact dialog.
 */
export function initContactDialog() {
  const dialog = document.querySelector(".contact-dialog");
  dialog.addEventListener("click", handleOverlayClick);
  dialog.addEventListener("focusout", handleFieldBlur);
}

/**
 * Closes the dialog when the dark overlay itself is clicked.
 * @param {MouseEvent} event - The click event
 */
function handleOverlayClick(event) {
  if (event.target === event.currentTarget) closeContactDialog();
}

/**
 * Validates a dialog field when it loses focus.
 * @param {FocusEvent} event - The focusout event
 */
function handleFieldBlur(event) {
  const field = event.target.dataset.field;
  if (!field) return;
  validateField(field, document.querySelector(".contact-dialog__submit").dataset.id);
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
 * Generates a contact object from the current dialog input values.
 * @param {string} contactID - The ID of the contact in Firebase
 * @returns {Object} The generated contact object
 */
function generateContactJson(contactID) {
  return {
    id: contactID,
    name: getContactName(),
    email: getContactEmailAdress(),
    phone: getContactPhone(),
    avatarColor: selectRandomAvatarColor(),
  };
}

/**
 * Returns the name value from the contact dialog input.
 * @returns {string} The trimmed name input value
 */
function getContactName() {
  return document.querySelector(".contact-dialog__input--name").value.trim();
}

/**
 * Returns the email value from the contact dialog input.
 * @returns {string} The trimmed email input value
 */
function getContactEmailAdress() {
  return document.querySelector(".contact-dialog__input--email").value.trim();
}

/**
 * Returns the phone value from the contact dialog input.
 * @returns {string} The trimmed phone input value
 */
function getContactPhone() {
  return document.querySelector(".contact-dialog__input--phone").value.trim();
}

/**
 * Creates a new contact in Firebase and refreshes the contact list.
 * @returns {Promise<void>}
 */
export async function submitContact() {
  if (!validateInputs()) return;
  try {
    const contactID = "contact-" + generateUUID();
    await putData("/contacts/" + contactID, generateContactJson(contactID));
    closeContactDialog();
    loadContacts();
    showMessage("Contact successfully created");
  } catch (error) {
    console.error("Fehler beim Erstellen des Kontakts:", error);
  }
}

/**
 * Removes a contact from the assignedTo list of every task it is assigned to.
 * @param {string} contactId - The ID of the contact
 * @returns {Promise<void>}
 */
async function removeContactFromTasks(contactId) {
  const tasks = (await loadData("/tasks")) || {};
  const writes = Object.entries(tasks).map(([taskId, task]) => {
    const assigned = Object.values(task.assignedTo || {});
    if (!assigned.some((a) => a.id === contactId)) return null;
    return putData(
      `/tasks/${taskId}/assignedTo`,
      assigned.filter((a) => a.id !== contactId),
    );
  });
  await Promise.all(writes);
}

/**
 * Deletes a contact from Firebase, removes it from all tasks and refreshes the contact list.
 * @param {string} contactId - The ID of the contact to delete
 * @returns {Promise<void>}
 */
export async function deleteContact(contactId) {
  try {
    await removeContactFromTasks(contactId);
    await deleteData("/contacts/" + contactId);
  } catch {
    return;
  }
  clearActiveContact();
  loadContacts();
  showMessage("Contact successfully deleted");
}

/**
 * Fills the contact dialog inputs with the current contact's data.
 * @param {Object} currentContact - The contact object with name, email and phone
 */
function fillEditDialogInputs(currentContact) {
  document.querySelector(".contact-dialog__input--name").value = currentContact?.name || "";
  document.querySelector(".contact-dialog__input--email").value = currentContact?.email || "";
  const phoneEl = document.querySelector(".contacts__info-value");
  document.querySelector(".contact-dialog__input--phone").value = phoneEl ? phoneEl.textContent : "";
}

/**
 * Sets up the edit dialog buttons for deleting and saving a contact.
 * @param {string} contactId - The ID of the contact to edit
 */
function setEditDialogButtons(contactId) {
  const cancelBtn = document.querySelector(".contact-dialog__cancel");
  const submitBtn = document.querySelector(".contact-dialog__submit");
  cancelBtn.textContent = "Delete ✕";
  cancelBtn.dataset.action = "delete";
  cancelBtn.dataset.id = contactId;
  submitBtn.textContent = "Save ✓";
  submitBtn.dataset.action = "save";
  submitBtn.dataset.id = contactId;
  document.querySelector(".contact-dialog__title").textContent = "Edit contact";
}

/**
 * Opens the contact dialog in edit mode for the given contact.
 * @param {string} contactId - The ID of the contact to edit
 */
export function editContact(contactId) {
  const currentContact = getActiveContactData(contactId);
  openContactDialog();
  fillEditDialogInputs(currentContact);
  setEditDialogButtons(contactId);
}

/**
 * Saves the updated contact data to Firebase and refreshes the contact list.
 * @param {string} contactId - The ID of the contact to save
 * @returns {Promise<void>}
 */
export async function saveContact(contactId) {
  if (!validateInputs(contactId)) return;
  const changes = { name: getContactName(), email: getContactEmailAdress(), phone: getContactPhone() };
  try {
    await updateData("/contacts/" + contactId, changes);
  } catch {
    return;
  }
  closeContactDialog();
  clearActiveContact();
  loadContacts();
  showMessage("Contact successfully updated");
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
function validateInputs(contactId) {
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
function clearErrors() {
  Object.values(CONTACT_FIELDS).forEach(({ input, error }) => clearError(input, error));
}
