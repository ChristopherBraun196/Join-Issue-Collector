import { generateUUID } from "../../utils/ids.js";
import { selectRandomAvatarColor } from "../../utils/avatar.js";
import { showMessage } from "../../components/toast.js";
import { putData, deleteData } from "../../services/database.js";
import { clearActiveContact, loadContacts, getActiveContactData } from "./contacts.js";

/**
 * Registers the listeners of the contact dialog.
 */
export function initContactDialog() {
  document.querySelector(".contact-dialog").addEventListener("click", handleOverlayClick);
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
  if (!validateInputs()) return;
  const updatedContact = {
    id: contactId,
    avatarColor: selectRandomAvatarColor(),
    name: document.querySelector(".contact-dialog__input--name").value.trim(),
    email: document.querySelector(".contact-dialog__input--email").value.trim(),
    phone: document.querySelector(".contact-dialog__input--phone").value.trim(),
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
  const cancelBtn = document.querySelector(".contact-dialog__cancel");
  const submitBtn = document.querySelector(".contact-dialog__submit");
  cancelBtn.textContent = "Cancel ✕";
  cancelBtn.dataset.action = "close-dialog";
  submitBtn.textContent = "Create contact ✓";
  submitBtn.dataset.action = "submit";
  document.querySelector(".contact-dialog__title").textContent = "Add contact";
}

/**
 * Validates the contact dialog input fields.
 * @returns {boolean} True if all inputs are valid, false otherwise
 */
function validateInputs() {
  const nameInput = document.querySelector(".contact-dialog__input--name");
  const emailInput = document.querySelector(".contact-dialog__input--email");
  const phoneInput = document.querySelector(".contact-dialog__input--phone");
  const phoneRegex = /^[+\d\s\-()]{6,20}$/;
  let isValid = true;

  clearErrors();

  if (!nameInput.value.trim()) {
    showError(".contact-dialog__input--name", ".contact-dialog__error--name", "This field is required");
    isValid = false;
  }
  if (!emailInput.checkValidity()) {
    showError(".contact-dialog__input--email", ".contact-dialog__error--email", "Please enter a valid email address");
    isValid = false;
  }
  if (!phoneRegex.test(phoneInput.value.trim())) {
    showError(".contact-dialog__input--phone", ".contact-dialog__error--phone", "Please enter a valid phone number");
    isValid = false;
  }

  return isValid;
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
 * Clears all validation errors from the contact dialog input fields.
 * Resets border colors and removes all error message elements.
 */
function clearErrors() {
  [
    { input: ".contact-dialog__input--name", error: ".contact-dialog__error--name" },
    { input: ".contact-dialog__input--email", error: ".contact-dialog__error--email" },
    { input: ".contact-dialog__input--phone", error: ".contact-dialog__error--phone" },
  ].forEach(({ input, error }) => {
    document.querySelector(input).style.borderColor = "";
    const err = document.querySelector(error);
    err.textContent = "";
    err.classList.remove("contact-dialog__error--visible");
  });
}
