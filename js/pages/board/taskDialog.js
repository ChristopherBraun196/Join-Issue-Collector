import { loadData, putData, deleteData } from "../../services/database.js";
import { confirmAction } from "../../components/confirmDialog.js";
import { showMessage } from "../../components/toast.js";
import { getDialogBoardTemplate } from "../../templates/boardTemplates.js";
import { tasks, initTasks, getAssignedContacts } from "./boardData.js";
import { renderAll, renderTaskCard } from "./boardRender.js";
import {
  handleEditTaskAction,
  handleEditSubtaskAction,
  openEditTask,
  onSubtaskInputEdit,
  handleSubtaskKeyEdit,
  handleEditSubtaskKey,
} from "./taskEdit.js";
import { openImageViewer } from "../../components/imageViewer.js";
import { attachments, handleAttachmentAction } from "../../components/attachments.js";

/**
 * Shows or hides the edit subtask confirm buttons while typing.
 * @param {InputEvent} event - The input event
 */
export function handleDialogBoardInput(event) {
  if (event.target.matches(".subtask__input")) onSubtaskInputEdit();
}

/**
 * Handles Enter and Escape inside the edit subtask input.
 * @param {KeyboardEvent} event - The keydown event
 */
export function handleDialogBoardKey(event) {
  if (event.target.matches(".subtask__input")) handleSubtaskKeyEdit(event, event.target.dataset.id);
  if (event.target.matches(".subtask__edit-input")) handleEditSubtaskKey(event);
}

/**
 * Opens the task detail dialog for a given task.
 * @param {string} id - The ID of the task to display
 * @returns {Promise<void>}
 */
export async function openDialogBoard(id) {
  await initTasks();
  const element = tasks.find((t) => t.id === id);
  const assignedContacts = await getAssignedContacts(element.assignedTo);
  const matchedCreator = await findCreatorContact(element);
  const dialogBoard = document.querySelector(".task-dialog");

  dialogBoard.innerHTML = getDialogBoardTemplate(element, assignedContacts, element.subtasks, matchedCreator);
  dialogBoard.showModal();
  document.querySelector("body > main").style.overflowY = "hidden";
}

/**
 * Finds the contact that created the task, matched by email or name.
 * @param {Object} element - The task
 * @returns {Promise<Object|undefined>} The matching contact including its id, if any
 */
async function findCreatorContact(element) {
  const contactsData = (await loadData("/contacts")) || {};
  return Object.entries(contactsData)
    .map(([id, contact]) => ({ ...contact, id }))
    .find(
      (c) =>
        (c.email && (c.email === element.creatorEmail || c.email === element.creator)) ||
        (c.name && (c.name === element.creator || c.name === element.creatorName)),
    );
}

/**
 * Plays the closing animation of the task dialog and closes it when the animation has finished.
 * @param {HTMLDialogElement} dialog - The open task dialog
 * @returns {Promise<void>} Resolves when the dialog is closed
 */
function closeAnimated(dialog) {
  return new Promise((resolve) => {
    dialog.classList.add("task-dialog--closing");
    dialog.addEventListener(
      "animationend",
      () => {
        dialog.classList.remove("task-dialog--closing");
        dialog.close();
        resolve();
      },
      { once: true },
    );
  });
}

/**
 * Closes the task detail dialog and updates only the card of this task.
 * @param {string} taskId - The ID of the task whose card is updated
 * @returns {Promise<void>}
 */
export async function closeDialogBoard(taskId) {
  const dialogBoard = document.querySelector(".task-dialog");
  await closeAnimated(dialogBoard);
  document.querySelector("body > main").style.overflowY = "";
  await renderTaskCard(taskId);
}

/**
 * Deletes a task from the board and Firebase.
 * @param {string} id - The ID of the task to delete
 * @returns {Promise<void>}
 */
async function deleteTask(id) {
  if (!(await confirmAction("Do you really want to delete this task?"))) return;
  try {
    await deleteData(`/tasks/${id}`);
  } catch {
    return;
  }
  document.querySelector(".task-dialog").close();
  document.querySelector("body > main").style.overflowY = "";
  document.querySelectorAll(".board__search-input").forEach((input) => (input.value = ""));
  showMessage("Task successfully deleted");
  await initTasks();
  renderAll();
}

/**
 * Saves the new completed state of a subtask without rebuilding the task dialog.
 * @param {HTMLInputElement} checkbox - The clicked subtask checkbox, already toggled by the browser
 * @param {number} subtaskIndex - The index of the subtask in the subtasks array
 * @param {string} taskID - The ID of the parent task
 * @returns {Promise<void>}
 */
async function toggleSubtask(checkbox, subtaskIndex, taskID) {
  const completed = checkbox.checked;
  await putData(`/tasks/${taskID}/subtasks/${subtaskIndex}/completed`, completed);
  tasks.find((task) => task.id === taskID).subtasks[subtaskIndex].completed = completed;
}

/**
 * Handles all clicks inside the task detail dialog via data-action.
 * @param {MouseEvent} event - The click event
 */
export function handleDialogBoardClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const { action, id, index } = target.dataset;
  if (action === "close-task") closeDialogBoard(id);
  if (action === "delete-task") deleteTask(id);
  if (action === "edit-task") openEditTask(id);
  if (action === "toggle-subtask") toggleSubtask(target, index, id);
  if (action === "open-edit-viewer") openImageViewer(attachments, Number(index));
  if (action === "open-viewer") openImageViewer(tasks.find((task) => task.id === id).attachments, Number(index));
  handleEditTaskAction(event, target, action);
  handleEditSubtaskAction(target, action);
  handleAttachmentAction(action, target);
}
