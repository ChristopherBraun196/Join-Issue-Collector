import { generateUUID } from "../utils/ids.js";
import { formatLabel } from "../utils/format.js";
import { STATUS } from "../utils/constants.js";
import { putData } from "../services/database.js";
import { validateForm } from "./validation.js";

/**
 * Generates a task object from the current form values.
 * @param {string} taskID - The ID for the new task
 * @param {string} statusArg - The initial status of the task (default: STATUS.TO_DO)
 * @returns {Object} The generated task object
 */
function generateTaskJson(taskID, statusArg = STATUS.TO_DO) {
  return {
    id: taskID,
    title: getTaskTitle(),
    description: getTaskDescription(),
    dueDate: getTaskDueDate(),
    priority: getTaskPriority(),
    category: getTaskCategory(),
    categoryLabelColor: getTaskCategoryLabelColor(getTaskCategory()),
    assignedTo: getAssignedTo(),
    subtasks: getSubtasks(),
    status: statusArg,
    creatorName: window.currentUser.name,
    creatorType: "internal",
  };
}

/**
 * Returns the title value from the task form input.
 * @returns {string} The trimmed title input value
 */
function getTaskTitle() {
  return document.querySelector('input[name="title"]').value.trim();
}

/**
 * Returns the description value from the task form textarea.
 * @returns {string} The trimmed description input value
 */
function getTaskDescription() {
  return document.querySelector('textarea[name="description"]').value.trim();
}

/**
 * Returns the due date value from the task form input.
 * @returns {string} The trimmed due date input value
 */
function getTaskDueDate() {
  return document.querySelector('input[name="due-date"]').value.trim();
}

/**
 * Returns the selected priority from the priority buttons.
 * @returns {string} The active priority ("urgent", "medium" or "low")
 */
function getTaskPriority() {
  const priorityBtn = document.querySelector(".task-form__priority-btn--active");
  const priority = ["urgent", "medium", "low"].find((p) => priorityBtn.classList.contains(`task-form__priority-btn--${p}`));
  return priority;
}

/**
 * Returns the selected and formatted category from the task form.
 * @returns {string} The formatted category label
 */
function getTaskCategory() {
  const category = document.querySelector('input[name="category"]').value.trim();
  return formatLabel(category);
}

/**
 * Returns the label color for a given task category.
 * @param {string} category - The category name (e.g. "User Story")
 * @returns {string} The hex color code for the category
 */
function getTaskCategoryLabelColor(category) {
  switch (category) {
    case "User Story":
      return "#0038FF";
    case "Technical Task":
      return "#1FD7C1";
  }
}

/**
 * Returns all selected contacts as an array of ID objects.
 * @returns {Object[]} Array of objects containing the contact ID
 */
function getAssignedTo() {
  return [...document.querySelectorAll(".dropdown--assigned .dropdown__option--selected")].map((opt) => ({
    id: opt.dataset.id,
  }));
}

/**
 * Returns all subtasks from the subtask list as an array of objects.
 * @returns {Object[]} Array of subtask objects with id, title and completed state
 */
function getSubtasks() {
  return [...document.querySelectorAll(".subtask__list .subtask__item")].map((li) => ({
    id: "subtask-" + generateUUID(),
    title: li.querySelector(".subtask__text").textContent,
    completed: false,
  }));
}

/**
 * Creates a new task in Firebase and redirects to the board.
 * @param {string} status - The initial status of the new task
 * @returns {Promise<void>}
 */
export async function createTask(status) {
  const form = document.querySelector(".task-form");
  if (!validateForm(form)) return;

  const taskID = generateUUID();
  let task = generateTaskJson(taskID, status);
  await putData("/tasks/task-" + taskID, task);
  location.href = "./board.html";
}
