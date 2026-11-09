import { getInitials } from "../utils/format.js";
import { loadData } from "../services/database.js";
import { getAddTaskDialogTemplate } from "../templates/addTaskTemplates.js";
import { validateOnBlur, validateDate, clearFieldError } from "./validation.js";
import { handleSubtaskAction, handleSubtaskKey, onSubtaskInput } from "./addSubtask.js";
import { createTask } from "./taskFormData.js";

let addTaskDialog;
let contacts = [];

/**
 * Registers all event listeners of the add task form on the given container.
 * @param {HTMLElement} container - The add task section or the add task dialog
 */
export function initTaskForm(container) {
  container.addEventListener("click", handleTaskFormClick);
  container.addEventListener("submit", handleTaskFormSubmit);
  container.addEventListener("focusout", handleTaskFormBlur);
  container.addEventListener("change", handleTaskFormChange);
  container.addEventListener("input", handleTaskFormInput);
  container.addEventListener("keydown", handleTaskFormKey);
}

/**
 * Handles all clicks inside the add task form via data-action.
 * @param {MouseEvent} event - The click event
 */
function handleTaskFormClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const { action, dropdown } = target.dataset;
  if (action === "set-priority") setPriority(target);
  if (action === "toggle-dropdown") toggleDropdown(dropdown);
  if (action === "select-category") selectCategory(target);
  if (action === "clear-form") clearTaskForm(event.currentTarget);
  if (action === "close-dialog") closeAddTaskDialog();
  if (action === "toggle-contact") toggleContact(target);
  handleSubtaskAction(action, target);
}

/**
 * Validates a required field when it loses focus.
 * @param {FocusEvent} event - The focusout event
 */
function handleTaskFormBlur(event) {
  const input = event.target.closest("[data-error-msg]");
  if (input) validateOnBlur(input, input.dataset.errorMsg);
}

/**
 * Validates the due date when its value changes.
 * @param {Event} event - The change event
 */
function handleTaskFormChange(event) {
  if (event.target.matches("[data-validate-date]")) validateDate(event.target);
}

/**
 * Shows or hides the subtask confirm buttons while typing.
 * @param {InputEvent} event - The input event
 */
function handleTaskFormInput(event) {
  if (event.target.matches(".subtask__input")) onSubtaskInput();
}

/**
 * Handles Enter and Escape inside the subtask input.
 * @param {KeyboardEvent} event - The keydown event
 */
function handleTaskFormKey(event) {
  if (event.target.matches(".subtask__input")) handleSubtaskKey(event);
}

/**
 * Prevents the native form submit and creates the task with the form's status.
 * @param {SubmitEvent} event - The submit event
 */
function handleTaskFormSubmit(event) {
  event.preventDefault();
  createTask(event.target.dataset.status);
}

/**
 * Clears the form, either inside the dialog or on the add task page.
 * @param {HTMLElement} container - The container the listener is registered on
 */
function clearTaskForm(container) {
  if (container.classList.contains("add-task-dialog")) {
    clearDialogAddTaskForm(container.querySelector("form").dataset.status);
  } else {
    clearAddTaskForm();
  }
}

/**
 * Opens the add task dialog and renders the contact list.
 * @param {string} status - The initial status for the new task
 */
export function openAddTaskDialog(status) {
  let main = document.querySelector("main");
  let dialogSection = document.createElement("dialog");
  dialogSection.className = "add-task-dialog";
  main.appendChild(dialogSection);
  dialogSection.innerHTML = getAddTaskDialogTemplate(status);
  initTaskForm(dialogSection);
  dialogSection.showModal();
  addTaskDialog = dialogSection;
  renderContacts();
}

/**
 * Closes and removes the add task dialog.
 */

function closeAddTaskDialog() {
  addTaskDialog.close();
  addTaskDialog.remove();
}

/**
 * Clears and resets the add task form in add task dialog.
 * @param {string} status - The initial status for the new task
 */
function clearDialogAddTaskForm(status) {
  const dialogSection = document.querySelector(".add-task-dialog");
  dialogSection.innerHTML = "";
  dialogSection.innerHTML = getAddTaskDialogTemplate(status);
  renderContacts();
}

/**
 * Resets the add task form in addtask.html including all custom dropdowns, priority buttons, and subtasks.
 */
function clearAddTaskForm() {
  document.querySelector(".task-form").reset();
  document.querySelectorAll(".dropdown--assigned .dropdown__option--selected").forEach((opt) => {
    opt.classList.remove("dropdown__option--selected");
    opt.querySelector('input[type="checkbox"]').checked = false;
  });
  document.querySelector(".task-form__badges").innerHTML = "";
  document
    .querySelectorAll(".dropdown--category .dropdown__option--selected")
    .forEach((opt) => opt.classList.remove("dropdown__option--selected"));
  document.querySelector('.dropdown--category input[name="category"]').value = "";
  document.querySelector(".dropdown--category .dropdown__placeholder").textContent = "Select task category";
  document.querySelector(".dropdown--category .dropdown__placeholder").style.color = "";
  document
    .querySelectorAll(".task-form__priority-btn")
    .forEach((btn) => btn.classList.remove("task-form__priority-btn--active"));
  document.querySelector(".task-form__priority-btn--medium").classList.add("task-form__priority-btn--active");
  document.querySelector(".subtask__list").innerHTML = "";

  document.querySelectorAll(".task-form .task-form__input--invalid").forEach((input) => clearFieldError(input));
  document.querySelectorAll(".task-form .task-form__error").forEach((el) => (el.style.visibility = "hidden"));
}

/**
 * Sets the active priority button and removes the active state from the others.
 * @param {HTMLElement} clickedButton - The priority button that was clicked
 */
function setPriority(clickedButton) {
  const buttons = document.querySelectorAll(".task-form__priority-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("task-form__priority-btn--active");
  });
  clickedButton.classList.add("task-form__priority-btn--active");
}

/**
 * Loads all contacts from the database and stores them globally.
 * @returns {Promise<void>}
 */
async function loadContacts() {
  const data = (await loadData("/contacts")) || {};
  contacts = Object.entries(data)
    .map(([id, contact]) => ({ id, name: contact.name, color: contact.avatarColor }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Loads and renders all contacts into the assignment dropdown.
 * @returns {Promise<void>}
 */
export async function renderContacts() {
  await loadContacts();
  const container = document.querySelector(".dropdown--assigned .dropdown__list");

  container.innerHTML = contacts
    .map(
      (contact) => `
        <div class="dropdown__option" 
             data-action="toggle-contact" 
             data-id="${contact.id}">
            <div class="dropdown__avatar" style="background:${contact.color}">
                ${getInitials(contact.name)}
            </div>
            <span class="dropdown__label">${contact.name}</span>
            <input type="checkbox">
        </div>
    `,
    )
    .join("");
}

/**
 * Toggles the open state of a dropdown and closes all other open dropdowns.
 * @param {string} id - The ID of the dropdown to toggle
 */
function toggleDropdown(id) {
  const wrapper = document.querySelector(`.dropdown--${id}`);
  const trigger = wrapper.querySelector(".dropdown__trigger");
  const dropdown = wrapper.querySelector(".dropdown__menu");
  const isOpen = dropdown.classList.contains("dropdown__menu--open");

  document.querySelectorAll(".dropdown__menu--open").forEach((d) => d.classList.remove("dropdown__menu--open"));
  document.querySelectorAll(".dropdown__trigger--open").forEach((t) => t.classList.remove("dropdown__trigger--open"));

  if (!isOpen) {
    dropdown.classList.add("dropdown__menu--open");
    trigger.classList.add("dropdown__trigger--open");
  } else if (id === "category") {
    const hiddenInput = wrapper.querySelector('input[name="category"]');
    if (hiddenInput) validateOnBlur(hiddenInput, "Please select a category");
  }
}

/**
 * Selects a category option and updates the dropdown display.
 * @param {HTMLElement} option - The selected category option element
 */
function selectCategory(option) {
  document
    .querySelectorAll(".dropdown--category .dropdown__option")
    .forEach((o) => o.classList.remove("dropdown__option--selected"));
  option.classList.add("dropdown__option--selected");

  const placeholder = document.querySelector(".dropdown--category .dropdown__placeholder");
  placeholder.textContent = option.querySelector("span").textContent;
  placeholder.style.color = "#2a3647";

  const hiddenInput = document.querySelector('.dropdown--category input[name="category"]');
  hiddenInput.value = option.dataset.value;
  clearFieldError(hiddenInput);

  toggleDropdown("category");
}

/**
 * Toggles the selection state of a contact option in the dropdown.
 * @param {HTMLElement} option - The selected contact option element
 */
function toggleContact(option) {
  const checkbox = option.querySelector('input[type="checkbox"]');
  const isSelected = option.classList.toggle("dropdown__option--selected");
  checkbox.checked = isSelected;
  updateAssignedBadges();
}

/**
 * Updates the assigned contact badges based on the selected contacts.
 */
function updateAssignedBadges() {
  const badges = document.querySelector(".task-form__badges");
  badges.innerHTML = "";
  const limit = 5;
  const selected = document.querySelectorAll(".dropdown--assigned .dropdown__option--selected");
  const total = selected.length;

  selected.forEach((opt, i) => {
    if (i >= limit) return;
    const avatar = opt.querySelector(".dropdown__avatar");
    const badge = document.createElement("div");
    badge.className = "task-form__badge";
    badge.style.background = avatar.style.background;
    badge.textContent = avatar.textContent.trim();
    badges.appendChild(badge);
  });

  if (total > limit) {
    const overflow = document.createElement("div");
    overflow.className = "task-form__badge task-form__badge--overflow";
    overflow.textContent = `+${total - limit}`;
    badges.appendChild(overflow);
  }
}

/**
 * Renders the avatar icons for all selected contacts.
 */
function renderSelectedAvatars() {
  const container = document.getElementById("selected-avatars");
  if (!container) return;
  container.innerHTML = selectedContacts
    .map(
      (c) => `
        <div class="contact-avatar" style="background:${c.color}" title="${c.name}">
            ${getInitials(c.name)}
        </div>
    `,
    )
    .join("");
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown__menu--open").forEach((d) => {
      d.classList.remove("dropdown__menu--open");

      const wrapper = d.closest(".dropdown");
      const hiddenInput = wrapper?.querySelector('input[name="category"]');
      if (hiddenInput) validateOnBlur(hiddenInput, "Please select a category");
    });
    document.querySelectorAll(".dropdown__trigger--open").forEach((t) => t.classList.remove("dropdown__trigger--open"));
  }
});
