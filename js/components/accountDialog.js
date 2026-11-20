import {
  openContactDialog,
  closeContactDialog,
  showContactAvatar,
  validateInputs,
  getContactName,
  getContactEmailAdress,
  getContactPhone,
  setContactList,
  setDialogReadOnly,
} from "./contactForm.js";
import { getDialogPhoto } from "./contactPhoto.js";
import { loadData, updateData, deleteData, removeContactFromTasks } from "../services/database.js";
import { renderUserMenue } from "./layout.js";
import { showMessage } from "./toast.js";
import { formatPhone } from "../utils/format.js";
import { confirmAction } from "./confirmDialog.js";
import { auth } from "../services/firebaseAuth.js";
import { deleteUser } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const RECENT_LOGIN_MS = 5 * 60 * 1000;

/**
 * Fills the dialog inputs with the data of the logged-in user.
 * @param {Object} user - The current user with name, email and phone
 */
function fillAccountInputs(user) {
  document.querySelector(".contact-dialog__input--name").value = user.name;
  document.querySelector(".contact-dialog__input--email").value = user.email;
  document.querySelector(".contact-dialog__input--phone").value = user.phone ? formatPhone(user.phone) : "";
}

/**
 * Sets the title and the buttons of the dialog for the account mode.
 */
function setAccountDialogButtons() {
  const cancelBtn = document.querySelector(".contact-dialog__cancel");
  const submitBtn = document.querySelector(".contact-dialog__submit");
  cancelBtn.textContent = "Delete my account";
  cancelBtn.dataset.action = "delete-account";
  submitBtn.textContent = "Edit";
  submitBtn.dataset.action = "edit-account";
  submitBtn.dataset.id = window.currentUser.id;
  document.querySelector(".contact-dialog__title").textContent = "My account";
  document.querySelector(".contact-dialog__text").hidden = true;
}

/**
 * Opens the contact dialog with the data of the logged-in user.
 */
export function openAccountDialog() {
  const user = window.currentUser;
  openContactDialog();
  document.querySelector(".contact-dialog").classList.add("contact-dialog--account");
  fillAccountInputs(user);
  showContactAvatar({ ...user, color: user.avatarColor });
  setAccountDialogButtons();
  setDialogReadOnly(true);
}

/**
 * Switches the account dialog from viewing to editing.
 */
function enableAccountEdit() {
  const submitBtn = document.querySelector(".contact-dialog__submit");
  submitBtn.textContent = "Save";
  submitBtn.dataset.action = "save-account";
  document.querySelector(".contact-dialog__title").textContent = "Edit account";
  setDialogReadOnly(false);
  document.querySelector(".contact-dialog__input--name").focus();
}

/**
 * Saves the changed account data and updates the current user and the topbar avatar.
 * @returns {Promise<void>}
 */
export async function saveAccount() {
  const user = window.currentUser;
  await refreshContactList();
  if (!validateInputs(user.id)) return;
  const changes = {
    name: getContactName(),
    email: getContactEmailAdress(),
    phone: getContactPhone(),
    photo: getDialogPhoto(),
  };
  await updateData("/contacts/" + user.id, changes);
  window.currentUser = { ...user, ...changes };
  closeContactDialog();
  renderUserMenue();
  showMessage("Account successfully updated");
}

/**
 * Loads all contacts so the email check can find addresses that are already taken.
 * @returns {Promise<void>}
 */
async function refreshContactList() {
  const data = (await loadData("/contacts")) || {};
  setContactList(Object.entries(data).map(([id, contact]) => ({ ...contact, id })));
}

/**
 * Handles the clicks on the account buttons inside the dialog.
 * @param {MouseEvent} event - The click event
 */
function handleAccountDialogClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  if (target.dataset.action === "save-account") saveAccount();
  if (target.dataset.action === "edit-account") enableAccountEdit();
  if (target.dataset.action === "delete-account") deleteAccount();
}

/**
 * Registers the click listener for the account buttons in the dialog.
 */
export function initAccountDialog() {
  document.querySelector(".contact-dialog").addEventListener("click", handleAccountDialogClick);
}

/**
 * Checks whether the last login is recent enough for Firebase to allow deleting the account.
 * @returns {boolean} True if the user logged in less than 5 minutes ago
 */
function isRecentLogin() {
  const lastLogin = new Date(auth.currentUser.metadata.lastSignInTime).getTime();
  return Date.now() - lastLogin < RECENT_LOGIN_MS;
}

/**
 * Removes the user from all tasks and deletes the contact and the user entry.
 * @param {Object} user - The current user with id
 * @returns {Promise<void>}
 */
async function deleteAccountData(user) {
  await removeContactFromTasks(user.id);
  await deleteData("/contacts/" + user.id);
  await deleteData("/users/" + auth.currentUser.uid);
}

/**
 * Asks for confirmation, deletes all account data and the login, then goes to the start page.
 * @returns {Promise<void>}
 */
export async function deleteAccount() {
  const question = "Are you sure you want to delete your account?";
  if (!(await confirmAction(question, ".confirm-dialog--account"))) return;
  if (!isRecentLogin()) return showMessage("Please log in again to delete your account");
  try {
    await deleteAccountData(window.currentUser);
    await deleteUser(auth.currentUser);
  } catch {
    return showMessage("Your account could not be deleted");
  }
  window.location.href = "./welcome.html";
}
