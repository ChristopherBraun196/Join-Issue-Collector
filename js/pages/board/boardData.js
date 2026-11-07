import { loadData } from "../../services/database.js";
import { STATUS } from "../../utils/constants.js";

export const tasks = [];

export const COLUMNS = Object.values(STATUS);

export const COLUMN_LABELS = {
  triage: "Triage",
  toDo: "To-do",
  inProgress: "In progress",
  await: "Await feedback",
  done: "Done",
};

/**
 * Loads all tasks from the database into the shared tasks array.
 * @returns {Promise<void>}
 */
export async function initTasks() {
  const data = await loadData("/tasks");
  tasks.length = 0;
  tasks.push(...Object.entries(data).map(([id, task]) => ({ ...task, id })));
}

/**
 * Returns the full contact objects of all contacts assigned to a task.
 * @param {Object[]|Object} assignedTo - The assigned contact references of the task
 * @returns {Promise<Object[]>} Array of assigned contact objects
 */
export async function getAssignedContacts(assignedTo) {
  const data = await loadData("/contacts");
  if (!data || !assignedTo) return [];
  const assignedArray = Array.isArray(assignedTo) ? assignedTo : Object.values(assignedTo);
  const assignedIds = assignedArray.map((a) => a.id.trim());
  return Object.entries(data)
    .map(([id, contact]) => ({ ...contact, id }))
    .filter((contact) => assignedIds.includes(contact.id.trim()));
}

window.tasks = tasks;
window.COLUMNS = COLUMNS;
window.COLUMN_LABELS = COLUMN_LABELS;
window.initTasks = initTasks;
window.getAssignedContacts = getAssignedContacts;
