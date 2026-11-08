import { loadData, putData, deleteData } from "../../services/database.js";
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
} from "./taskEdit.js";

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
  const contactsData = (await loadData("/contacts")) || {};
  const contactsList = Object.entries(contactsData).map(([id, contact]) => ({
    ...contact,
    id,
  }));

  const matchedCreator = contactsList.find(
    (c) =>
      (c.email && (c.email === element.creatorEmail || c.email === element.creator)) ||
      (c.name && (c.name === element.creator || c.name === element.creatorName)),
  );

  const dialogBoard = document.querySelector(".task-dialog");
  dialogBoard.innerHTML = getDialogBoardTemplate(element, assignedContacts, element.subtasks, matchedCreator);
  dialogBoard.showModal();
  document.querySelector("body > main").style.overflowY = "hidden";
}

/**
 * Closes the task detail dialog and updates only the card of this task.
 * @param {string} taskId - The ID of the task whose card is updated
 * @returns {Promise<void>}
 */
export async function closeDialogBoard(taskId) {
  const dialogBoard = document.querySelector(".task-dialog");
  dialogBoard.close();
  document.querySelector("body > main").style.overflowY = "";
  await renderTaskCard(taskId);
}

/**
 * Deletes a task from the board and Firebase.
 * @param {string} id - The ID of the task to delete
 * @returns {Promise<void>}
 */
async function deleteTask(id) {
  try {
    await deleteData(`/tasks/${id}`);
    showMessage("Task wurde gelöscht");
    document.querySelector(".task-dialog").close();
    await initTasks();
    renderAll();
  } catch (error) {
    console.error("Fehler beim Löschen des Tasks:", error);
  }
}

/**
 * Toggles the completed state of a subtask and refreshes the task dialog.
 * @param {number} subtaskIndex - The index of the subtask in the subtasks array
 * @param {boolean} isSubtaskCompleted - The current completed state of the subtask
 * @param {string} taskID - The ID of the parent task
 * @returns {Promise<void>}
 */
async function toggleSubtask(subtaskIndex, isSubtaskCompleted, taskID) {
  if (isSubtaskCompleted) {
    await putData("/tasks/" + taskID + "/subtasks/" + subtaskIndex + "/completed", false);
  }
  if (isSubtaskCompleted == false) {
    await putData("/tasks/" + taskID + "/subtasks/" + subtaskIndex + "/completed", true);
  }
  await openDialogBoard(taskID);
}

/**
 * Handles all clicks inside the task detail dialog via data-action.
 * @param {MouseEvent} event - The click event
 */
export function handleDialogBoardClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const { action, id, index, completed } = target.dataset;
  if (action === "close-task") closeDialogBoard(id);
  if (action === "delete-task") deleteTask(id);
  if (action === "edit-task") openEditTask(id);
  if (action === "toggle-subtask") toggleSubtask(index, completed === "true", id);
  handleEditTaskAction(event, target, action);
  handleEditSubtaskAction(target, action);
}
