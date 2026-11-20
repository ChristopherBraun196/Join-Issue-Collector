import { generateUUID } from "../../utils/ids.js";
import { selectRandomAvatarColor } from "../../utils/avatar.js";
import { showMessage } from "../../components/toast.js";
import { putData, updateData, deleteData, removeContactFromTasks } from "../../services/database.js";
import { clearActiveContact, loadContacts, getActiveContactData, openContactById } from "./contacts.js";
import { confirmAction } from "../../components/confirmDialog.js";
import { getDialogPhoto } from "../../components/contactPhoto.js";
import {
  getContactName,
  getContactEmailAdress,
  getContactPhone,
  validateInputs,
  openContactDialog,
  closeContactDialog,
  showContactAvatar,
} from "../../components/contactForm.js";

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
    photo: getDialogPhoto(),
  };
}

/**
 * Writes data to Firebase while the submit button is disabled, so a double click cannot save twice.
 * @param {Function} writeFn - The database function to use (putData or updateData)
 * @param {string} path - The Firebase path
 * @param {Object} data - The data to write
 * @returns {Promise<boolean>} True if the data was saved
 */
async function saveWithLockedButton(writeFn, path, data) {
  const button = document.querySelector(".contact-dialog__submit");
  button.disabled = true;
  try {
    await writeFn(path, data);
    return true;
  } catch {
    return false;
  } finally {
    button.disabled = false;
  }
}

/**
 * Creates a new contact in Firebase and refreshes the contact list.
 * @returns {Promise<void>}
 */
export async function submitContact() {
  if (!validateInputs()) return;
  const contactID = "contact-" + generateUUID();
  if (!(await saveWithLockedButton(putData, "/contacts/" + contactID, generateContactJson(contactID)))) return;
  closeContactDialog();
  await loadContacts();
  openContactById(contactID);
  showMessage("Contact successfully created");
}

/**
 * Deletes a contact from Firebase, removes it from all tasks and refreshes the contact list.
 * @param {string} contactId - The ID of the contact to delete
 * @returns {Promise<void>}
 */
export async function deleteContact(contactId) {
  if (!(await confirmAction("Do you really want to delete this contact?"))) return;
  closeContactDialog();

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
  cancelBtn.textContent = "Delete";
  cancelBtn.dataset.action = "delete";
  cancelBtn.dataset.id = contactId;
  submitBtn.textContent = "Save ✓";
  submitBtn.dataset.action = "save";
  submitBtn.dataset.id = contactId;
  document.querySelector(".contact-dialog__title").textContent = "Edit contact";
  document.querySelector(".contact-dialog__text").hidden = true;
}

/**
 * Opens the contact dialog in edit mode for the given contact.
 * @param {string} contactId - The ID of the contact to edit
 */
export function editContact(contactId) {
  const currentContact = getActiveContactData(contactId);
  openContactDialog();
  fillEditDialogInputs(currentContact);
  showContactAvatar(currentContact);
  setEditDialogButtons(contactId);
}

/**
 * Saves the updated contact data to Firebase and refreshes the contact list.
 * @param {string} contactId - The ID of the contact to save
 * @returns {Promise<void>}
 */
export async function saveContact(contactId) {
  if (!validateInputs(contactId)) return;
  const changes = {
    name: getContactName(),
    email: getContactEmailAdress(),
    phone: getContactPhone(),
    photo: getDialogPhoto(),
  };
  if (!(await saveWithLockedButton(updateData, "/contacts/" + contactId, changes))) return;
  closeContactDialog();
  await loadContacts();
  openContactById(contactId);
  showMessage("Contact successfully updated");
}
