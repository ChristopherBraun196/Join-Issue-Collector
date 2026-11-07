import { putData } from "../../services/database.js";
import { tasks, COLUMNS, COLUMN_LABELS } from "./boardData.js";

/**
 * Returns all other columns a task can move to (excluding its current column).
 * @param {string} currentStatus - The current column ID
 * @returns {Object[]} Array of {id, label, direction}
 */
function getMoveTargets(currentStatus) {
  const idx = COLUMNS.indexOf(currentStatus);
  return COLUMNS.filter((col) => col !== currentStatus).map((col) => ({
    id: col,
    label: COLUMN_LABELS[col],
    direction: COLUMNS.indexOf(col) < idx ? "up" : "down",
  }));
}

/**
 * Toggles the move-to overlay on a task card.
 * @param {Event} event - The click event
 * @param {string} taskId - The task ID
 * @param {string} currentStatus - The current column of the task
 */
export function toggleMoveOverlay(event, taskId, currentStatus) {
  event.stopPropagation();
  const existingOverlay = document.getElementById("move-overlay-" + taskId);
  closeAllOverlays();
  if (existingOverlay) return;

  const card = event.target.closest(".task-card");
  const targets = getMoveTargets(currentStatus);
  const overlay = document.createElement("div");
  overlay.className = "move-overlay";
  overlay.id = "move-overlay-" + taskId;
  overlay.innerHTML = getMoveOverlayHTML(taskId, targets);
  card.appendChild(overlay);
}

/**
 * Returns the HTML for the move overlay content.
 */
function getMoveOverlayHTML(taskId, targets) {
  let html = '<p class="move-overlay-title">Move to</p>';
  for (const t of targets) {
    const arrow = t.direction === "up" ? "↑" : "↓";
    html += `<button class="move-overlay-option" data-action="move-task" data-id="${taskId}" data-status="${t.id}">
      <span class="move-arrow">${arrow}</span> ${t.label}
    </button>`;
  }
  return html;
}

/**
 * Moves a task to a new column via the overlay.
 */
export async function moveTaskTo(event, taskId, newStatus) {
  event.stopPropagation();
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;
  const oldStatus = task.status;
  if (oldStatus === newStatus) return;

  task.status = newStatus;
  try {
    await putData("/tasks/" + task.id, task);
  } catch {
    task.status = oldStatus;
  }
  await reRenderColumns(oldStatus, newStatus);
}

/**
 * Closes all open move overlays.
 */
function closeAllOverlays() {
  document.querySelectorAll(".move-overlay").forEach((el) => el.remove());
}

/**
 * Handles clicks outside overlays to close them.
 */
export function handleOutsideClick(event) {
  if (!event.target.closest(".move-overlay") && !event.target.closest(".move-to-btn")) {
    closeAllOverlays();
  }
}

window.toggleMoveOverlay = toggleMoveOverlay;
window.moveTaskTo = moveTaskTo;
window.handleOutsideClick = handleOutsideClick;
