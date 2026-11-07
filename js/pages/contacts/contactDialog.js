import { generateUUID } from "../../utils/ids.js";
import { selectRandomAvatarColor } from "../../utils/avatar.js";
import { showMessage } from "../../components/toast.js";
import { putData, deleteData } from "../../services/database.js";
import { clearActiveContact, loadContacts, getActiveContactData } from "./contacts.js";

/**
 * Registers the listeners of the contact dialog.
 */
export function initContactDialog() {
  document.getElementById("dialog-overlay").addEventListener("click", handleOverlayClick);
}

/**
 * Closes the dialog when the dark overlay itself is clicked.
 * @param {MouseEvent} event - The click event
 */
function handleOverlayClick(event) {
  if (event.target === event.currentTarget) closeContactDialog();
}

/**
 * Opens the contact dialog overlay.
 */
export function openContactDialog() {
  document.getElementById("dialog-overlay").classList.add("active");
}

/**
 * Closes the contact dialog overlay
 */
export function closeContactDialog() {
  document.getElementById("dialog-overlay").classList.remove("active");
  clearDialogInputs();
  clearErrors();
  resetDialog();
}

/**
 * Clears all input fields in the contact dialog.
 */
function clearDialogInputs() {
  document.getElementById("input-name").value = "";
  document.getElementById("input-email").value = "";
  document.getElementById("input-phone").value = "";
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
  return document.getElementById("input-name").value.trim();
}

/**
 * Returns the email value from the contact dialog input.
 * @returns {string} The trimmed email input value
 */
function getContactEmailAdress() {
  return document.getElementById("input-email").value.trim();
}

/**
 * Returns the phone value from the contact dialog input.
 * @returns {string} The trimmed phone input value
 */
function getContactPhone() {
  return document.getElementById("input-phone").value.trim();
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
 * Deletes a contact from Firebase and refreshes the contact list.
 * @param {string} contactId - The ID of the contact to delete
 * @returns {Promise<void>}
 */
export async function deleteContact(contactId) {
  try {
    await deleteData("/contacts/" + contactId);
    clearActiveContact();
    loadContacts();
    showMessage("Contact successfully deleted");
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
}

/**
 * Fills the contact dialog inputs with the current contact's data.
 * @param {Object} currentContact - The contact object with name, email and phone
 */
function fillEditDialogInputs(currentContact) {
  document.getElementById("input-name").value = currentContact?.name || "";
  document.getElementById("input-email").value = currentContact?.email || "";
  const phoneEl = document.getElementById("detail-phone");
  document.getElementById("input-phone").value = phoneEl ? phoneEl.textContent : "";
}

/**
 * Sets up the edit dialog buttons for deleting and saving a contact.
 * @param {string} contactId - The ID of the contact to edit
 */
function setEditDialogButtons(contactId) {
  const cancelBtn = document.querySelector(".btn-cancel");
  const submitBtn = document.querySelector(".btn-submit");
  cancelBtn.textContent = "Delete ✕";
  cancelBtn.dataset.action = "delete";
  cancelBtn.dataset.id = contactId;
  submitBtn.textContent = "Save ✓";
  submitBtn.dataset.action = "save";
  submitBtn.dataset.id = contactId;
  document.querySelector(".dialog-left h1").textContent = "Edit contact";
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
  if (!validateInputs()) return;
  const updatedContact = {
    id: contactId,
    avatarColor: selectRandomAvatarColor(),
    name: document.getElementById("input-name").value.trim(),
    email: document.getElementById("input-email").value.trim(),
    phone: document.getElementById("input-phone").value.trim(),
  };
  try {
    await putData("/contacts/" + contactId, updatedContact);
    closeContactDialog();
    clearActiveContact();
    loadContacts();
    showMessage("Contact successfully updated");
  } catch (error) {
    console.error("Fehler beim Speichern des Kontakts:", error);
  }
}

/**
 * Resets the contact dialog to its default "Add contact" state.
 */
function resetDialog() {
  const cancelBtn = document.querySelector(".btn-cancel");
  const submitBtn = document.querySelector(".btn-submit");
  cancelBtn.textContent = "Cancel ✕";
  cancelBtn.dataset.action = "close-dialog";
  submitBtn.textContent = "Create contact ✓";
  submitBtn.dataset.action = "submit";
  document.querySelector(".dialog-left h1").textContent = "Add contact";
}

/**
 * Validates the contact dialog input fields.
 * @returns {boolean} True if all inputs are valid, false otherwise
 */
function validateInputs() {
  const nameInput = document.getElementById("input-name");
  const emailInput = document.getElementById("input-email");
  const phoneInput = document.getElementById("input-phone");
  const phoneRegex = /^[+\d\s\-()]{6,20}$/;
  let isValid = true;

  clearErrors();

  if (!nameInput.value.trim()) {
    showError("input-name", "err-name", "This field is required");
    isValid = false;
  }
  if (!emailInput.checkValidity()) {
    showError("input-email", "err-email", "Please enter a valid email address");
    isValid = false;
  }
  if (!phoneRegex.test(phoneInput.value.trim())) {
    showError("input-phone", "err-phone", "Please enter a valid phone number");
    isValid = false;
  }

  return isValid;
}

/**
 * Marks an input field as invalid and displays an error message below it.
 * @param {string} inputId - The ID of the input element to mark as invalid
 * @param {string} errorId - The ID of the error message element
 * @param {string} message - The error message to display
 */
function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  input.style.borderColor = "var(--error-color)";
  err.textContent = message;
  err.classList.add("visible");
}

/**
 * Clears all validation errors from the contact dialog input fields.
 * Resets border colors and removes all error message elements.
 */
function clearErrors() {
  [
    { inputId: "input-name", errorId: "err-name" },
    { inputId: "input-email", errorId: "err-email" },
    { inputId: "input-phone", errorId: "err-phone" },
  ].forEach(({ inputId, errorId }) => {
    document.getElementById(inputId).style.borderColor = "";
    const err = document.getElementById(errorId);
    err.textContent = "";
    err.classList.remove("visible");
  });
}
