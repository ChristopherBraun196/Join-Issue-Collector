import { loadData, putData } from "../../services/database.js";
import {
  getDialogBoardEditTemplate,
  getPriorityButtonTemplate,
  getContactOptionTemplate,
  getContactBadgeTemplate,
  getAssignedContactsEditTemplate,
  getSubtaskEditItemTemplate,
  getSubtaskEditingStateTemplate,
} from "../../templates/boardEditTemplates.js";
import { tasks, initTasks } from "./boardData.js";
import { openDialogBoard } from "./taskDialog.js";
import { renderTaskCard } from "./boardRender.js";
import { showMessage } from "../../components/toast.js";

let currentEditPriority = null;
let currentEditTaskId = null;

/**
 * Runs the edit dialog action that belongs to the clicked data-action.
 * @param {MouseEvent} event - The click event
 * @param {HTMLElement} target - The clicked element with the data-action
 * @param {string} action - The data-action value
 */
export function handleEditTaskAction(event, target, action) {
  const { id, priority } = target.dataset;
  if (action === "set-edit-priority") setEditPriority(target, priority);
  if (action === "toggle-edit-dropdown") toggleEditDropdown();
  if (action === "toggle-edit-contact") toggleAssignedContact(event, target, id);
  if (action === "save-task") saveEditTask(id, target);
}

/**
 * Runs the edit dialog subtask action that belongs to the clicked data-action.
 * @param {HTMLElement} target - The clicked element with the data-action
 * @param {string} action - The data-action value
 */
export function handleEditSubtaskAction(target, action) {
  const { id, index } = target.dataset;
  if (action === "clear-subtask-edit") clearSubtaskInputEdit();
  if (action === "add-subtask-edit") addSubtaskEdit(id);
  if (action === "edit-subtask-edit") editSubtaskEditMode(target.closest("li").querySelector(".subtask__text"));
  if (action === "delete-subtask-edit") deleteSubtaskEdit(id, Number(index));
  if (action === "remove-subtask-edit")
    deleteSubtaskEdit(target.closest("li").dataset.taskId, Number(target.closest("li").dataset.index));
  if (action === "confirm-subtask-edit") confirmSubtaskEditMode(target);
}

/**
 * Opens the edit dialog for a given task.
 * @param {string} taskId - The ID of the task to edit
 * @returns {Promise<void>}
 */
export async function openEditTask(taskId) {
  currentEditTaskId = taskId;
  currentEditPriority = null;
  const element = tasks.find((t) => t.id === taskId);
  const allContacts = await loadData("/contacts");
  const assignedIds = getNormalizedAssignedTo(element).map((a) => a.id);
  const priorityButtons = getPriorityButtonsTemplate(element.priority);
  const assignedHTML = buildAssignedContactsEdit(allContacts, assignedIds);
  const subtasksHTML = getSubtasksEditTemplate(element.subtasks, taskId);
  document.querySelector(".task-dialog").innerHTML = getDialogBoardEditTemplate(
    element,
    priorityButtons,
    assignedHTML,
    subtasksHTML,
  );
}

/**
 * Returns the task with the values from the edit form.
 * @param {Object} element - The task before editing
 * @returns {Object} The updated task object
 */
function getEditedTaskData(element) {
  return {
    ...element,
    title: document.querySelector(".task-edit__input--title").value,
    description: document.querySelector(".task-edit__input--description").value,
    dueDate: document.querySelector(".task-edit__input--due-date").value,
    priority: currentEditPriority ?? element.priority,
  };
}

/**
 * Saves the edited task, shows its detail view again and updates its card.
 * @param {string} taskId - The ID of the task to save
 * @param {HTMLButtonElement} button - The clicked save button
 * @returns {Promise<void>}
 */
async function saveEditTask(taskId, button) {
  const element = tasks.find((t) => t.id === taskId);
  button.disabled = true;
  try {
    await putData("/tasks/" + taskId, getEditedTaskData(element));
  } catch {
    button.disabled = false;
    return;
  }
  await openDialogBoard(taskId);
  await renderTaskCard(taskId);
  showMessage("Task successfully updated");
}

/**
 * Sets the active priority for the edit dialog and updates the button styles.
 * @param {HTMLElement} button - The clicked priority button
 * @param {string} priority - The selected priority (e.g. "urgent", "medium", "low")
 */
function setEditPriority(button, priority) {
  currentEditPriority = priority;
  document
    .querySelectorAll(".task-edit__priority-btn")
    .forEach((btn) => btn.classList.remove("task-edit__priority-btn--active"));
  button.classList.add("task-edit__priority-btn--active");
}

/**
 * Returns the HTML for the subtask list in the edit dialog.
 * @param {Object[]} subtasks - Array of subtask objects
 * @param {string} taskId - The ID of the parent task
 * @returns {string} HTML string of all subtask edit items
 */
function getSubtasksEditTemplate(subtasks, taskId) {
  if (!subtasks) return "";
  return subtasks.map((s, i) => getSubtaskEditItemTemplate(s, taskId, i)).join("");
}

/**
 * Toggles the visibility of the subtask confirm buttons based on the input value.
 */
export function onSubtaskInputEdit() {
  const input = document.querySelector(".task-dialog .subtask__input");
  const btns = document.querySelector(".task-dialog .subtask__confirm");
  btns.classList.toggle("subtask__confirm--visible", input.value.trim().length > 0);
}

/**
 * Clears the subtask input field and updates the button visibility.
 */
function clearSubtaskInputEdit() {
  document.querySelector(".task-dialog .subtask__input").value = "";
  onSubtaskInputEdit();
}

/**
 * Adds a new subtask to the task and refreshes the edit dialog.
 * @param {string} taskId - The ID of the parent task
 * @returns {Promise<void>}
 */
async function addSubtaskEdit(taskId) {
  const input = document.querySelector(".task-dialog .subtask__input");
  const title = input.value.trim();
  if (!title) return;
  const element = tasks.find((t) => t.id === taskId);
  const subtasks = element.subtasks ? [...element.subtasks] : [];
  subtasks.push({ title, completed: false });
  await putData("/tasks/" + taskId + "/subtasks", subtasks);
  await initTasks();
  await openEditTask(taskId);
}

/**
 * Deletes a subtask from the task and refreshes the edit dialog.
 * @param {string} taskId - The ID of the parent task
 * @param {number} subtaskIndex - The index of the subtask to delete
 * @returns {Promise<void>}
 */
async function deleteSubtaskEdit(taskId, subtaskIndex) {
  const element = tasks.find((t) => t.id === taskId);
  const subtasks = [...element.subtasks];
  subtasks.splice(subtaskIndex, 1);
  await putData("/tasks/" + taskId + "/subtasks", subtasks);
  await initTasks();
  await openEditTask(taskId);
}

/**
 * Toggles the open state of the assigned contacts dropdown in the edit dialog.
 */
function toggleEditDropdown() {
  const dropdown = document.querySelector(".task-dialog .dropdown__menu");
  const trigger = dropdown.previousElementSibling;
  dropdown.classList.toggle("dropdown__menu--open");
  trigger.classList.toggle("dropdown__trigger--open");
}

/**
 * Retrieves the checkbox from a contact option and toggles it if the click was outside the checkbox.
 * @param {MouseEvent} event - The click event from the contact option
 * @param {HTMLElement} option - The clicked contact option element
 * @returns {HTMLInputElement} The checkbox element
 */
function getCheckboxState(event, option) {
  const checkbox = option.querySelector("input[type='checkbox']");
  if (event.target !== checkbox) checkbox.checked = !checkbox.checked;
  return checkbox;
}

/**
 * Returns a normalized array of assigned contacts from a task element.
 * Handles both array and object formats from Firebase.
 * @param {Object} element - The task object containing assignedTo data
 * @returns {Array<{id: string}>} Normalized array of assigned contact references
 */
function getNormalizedAssignedTo(element) {
  if (!element.assignedTo) return [];
  return Array.isArray(element.assignedTo) ? [...element.assignedTo] : Object.values(element.assignedTo);
}

/**
 * Adds or removes a contact from the assigned list and updates the UI selection state.
 * @param {HTMLInputElement} checkbox - The checkbox element indicating assignment state
 * @param {Array<{id: string}>} assignedTo - Current list of assigned contacts
 * @param {string} contactId - The ID of the contact to add or remove
 * @param {HTMLElement} currentTarget - The contact option element to toggle selected class
 * @returns {Array<{id: string}>} Updated list of assigned contacts
 */
function updateAssignedList(checkbox, assignedTo, contactId, currentTarget) {
  if (checkbox.checked) {
    assignedTo.push({ id: contactId });
    currentTarget.classList.add("dropdown__option--selected");
  } else {
    assignedTo = assignedTo.filter((a) => a.id !== contactId);
    currentTarget.classList.remove("dropdown__option--selected");
  }
  return assignedTo;
}

/**
 * Saves the updated assigned contacts to Firebase, reinitializes tasks and refreshes the badge UI.
 * @async
 * @param {string} taskId - The ID of the task to update
 * @param {Array<{id: string}>} assignedTo - Updated list of assigned contacts
 * @returns {Promise<void>}
 */
async function saveAndRefreshAssigned(taskId, assignedTo) {
  await putData("/tasks/" + taskId + "/assignedTo", assignedTo);
  await initTasks();
  const allContacts = await loadData("/contacts");
  const assignedIds = assignedTo.map((a) => a.id);
  document.querySelector(".task-edit__badges").innerHTML = buildContactBadges(allContacts, assignedIds);
}

/**
 * Toggles a contact's assignment on a task and updates the UI.
 * @param {MouseEvent} event - The click event from the contact option
 * @param {HTMLElement} option - The clicked contact option element
 * @param {string} contactId - The ID of the contact to toggle
 * @returns {Promise<void>}
 */
async function toggleAssignedContact(event, option, contactId) {
  const checkbox = getCheckboxState(event, option);
  const element = tasks.find((t) => t.id === currentEditTaskId);
  let assignedTo = getNormalizedAssignedTo(element);
  assignedTo = updateAssignedList(checkbox, assignedTo, contactId, option);
  await saveAndRefreshAssigned(currentEditTaskId, assignedTo);
}

/**
 * Builds the HTML of all contact options for the edit dropdown, sorted by name.
 * @param {Object} allContacts - All contacts from Firebase, keyed by ID
 * @param {string[]} assignedIds - IDs of the contacts assigned to the task
 * @returns {string} HTML string of the contact options
 */
function buildContactOptions(allContacts, assignedIds) {
  return Object.entries(allContacts)
    .sort(([, a], [, b]) => a.name.localeCompare(b.name))
    .map(([id, contact]) => {
      const checked = assignedIds.includes(id) ? "checked" : "";
      return getContactOptionTemplate(id, contact, checked);
    })
    .join("");
}

/**
 * Builds the HTML of the avatar badges for all assigned contacts.
 * @param {Object} allContacts - All contacts from Firebase, keyed by ID
 * @param {string[]} assignedIds - IDs of the contacts assigned to the task
 * @returns {string} HTML string of the badges
 */
function buildContactBadges(allContacts, assignedIds) {
  return Object.entries(allContacts)
    .filter(([id]) => assignedIds.includes(id))
    .map(([id, contact]) => getContactBadgeTemplate(contact))
    .join("");
}

/**
 * Builds the complete "Assigned to" section of the edit dialog.
 * @param {Object} allContacts - All contacts from Firebase, keyed by ID
 * @param {string[]} assignedIds - IDs of the contacts assigned to the task
 * @returns {string} HTML string of the dropdown options and badges
 */
function buildAssignedContactsEdit(allContacts, assignedIds) {
  const optionsHTML = buildContactOptions(allContacts, assignedIds);
  const badgesHTML = buildContactBadges(allContacts, assignedIds);
  return getAssignedContactsEditTemplate(optionsHTML, badgesHTML);
}

/**
 * Adds the subtask on Enter and clears the input on Escape in the edit dialog.
 * @param {KeyboardEvent} event - The keydown event of the subtask input
 * @param {string} taskId - The ID of the edited task
 */
export function handleSubtaskKeyEdit(event, taskId) {
  if (event.key === "Enter") {
    event.preventDefault();
    addSubtaskEdit(taskId);
  }
  if (event.key === "Escape") clearSubtaskInputEdit();
}

/**
 * Switches a subtask in the edit dialog into editing mode and selects its text.
 * @param {HTMLElement} span - The text element of the subtask
 */
function editSubtaskEditMode(span) {
  const li = span.closest("li");
  li.innerHTML = getSubtaskEditingStateTemplate(span.textContent);
  li.querySelector("input").select();
}

/**
 * Saves the renamed subtask, or deletes it if the text is empty, and refreshes the edit dialog.
 * @param {HTMLElement} element - The confirm button or the edit input inside the subtask item
 * @returns {Promise<void>}
 */
async function confirmSubtaskEditMode(element) {
  const li = element.closest("li");
  const text = li.querySelector(".subtask__edit-input").value.trim();
  const { taskId, index } = li.dataset;
  if (!text) return deleteSubtaskEdit(taskId, Number(index));
  const subtasks = [...tasks.find((t) => t.id === taskId).subtasks];
  subtasks[index] = { ...subtasks[index], title: text };
  await putData("/tasks/" + taskId + "/subtasks", subtasks);
  await initTasks();
  await openEditTask(taskId);
}

/**
 * Confirms the subtask rename with Enter and cancels it with Escape.
 * @param {KeyboardEvent} event - The keydown event in the edit input
 */
export function handleEditSubtaskKey(event) {
  if (event.key === "Enter") confirmSubtaskEditMode(event.target);
  if (event.key === "Escape") openEditTask(currentEditTaskId);
}

/**
 * Returns the HTML template for all priority buttons in the edit dialog.
 * @param {string} currentPriority - The currently active priority (e.g. "urgent")
 * @returns {string} HTML string of all priority buttons
 */
function getPriorityButtonsTemplate(currentPriority) {
  return ["urgent", "medium", "low"].map((p) => getPriorityButtonTemplate(p, currentPriority)).join("");
}
