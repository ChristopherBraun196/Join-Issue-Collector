import { moveTaskTo } from "./moveOverlay.js";

let currentDraggedElement;

/**
 * Registers the delegated drag and drop listeners on the board.
 */
export function initDragDrop() {
  const board = document.querySelector(".board__columns");
  board.addEventListener("dragover", handleDragOver);
  board.addEventListener("dragleave", handleDragLeave);
  board.addEventListener("drop", handleDrop);
  board.addEventListener("dragstart", handleDragStart);
}

/**
 * Stores the ID of the task card that starts being dragged.
 * @param {DragEvent} event - The dragstart event
 */
function handleDragStart(event) {
  const card = event.target.closest(".task-card");
  if (card) startDragging(card.dataset.id);
}

/**
 * Allows dropping and highlights the column the task is dragged over.
 * @param {DragEvent} event - The dragover event
 */
function handleDragOver(event) {
  const column = event.target.closest("[data-column]");
  if (!column) return;
  allowDrop(event);
  highlight(column.dataset.column);
}

/**
 * Removes the highlight from the column the task is dragged out of.
 * @param {DragEvent} event - The dragleave event
 */
function handleDragLeave(event) {
  const column = event.target.closest("[data-column]");
  if (column) removeHighlight(column.dataset.column);
}

/**
 * Drops the dragged task into the column it was released over.
 * @param {DragEvent} event - The drop event
 */
function handleDrop(event) {
  const column = event.target.closest("[data-column]");
  if (column) dropTask(event, column.dataset.column);
}

/**
 * Starts dragging a task card. Stores which task is being dragged.
 * @param {string} id - The ID of the task being dragged
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Allows a dragged element to be dropped on this target.
 * @param {DragEvent} ev - The drag event
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Highlights a column while a task is being dragged over it.
 * @param {string} columnId - The column ID to highlight
 */
function highlight(columnId) {
  const dropzone = document.querySelector(`.board__column-body[data-column="${columnId}"]`);
  if (dropzone) dropzone.classList.add("board__column-body--highlight");
}

/**
 * Removes the highlight from a column.
 * @param {string} columnId - The column ID to unhighlight
 */
function removeHighlight(columnId) {
  const dropzone = document.querySelector(`.board__column-body[data-column="${columnId}"]`);
  if (dropzone) dropzone.classList.remove("board__column-body--highlight");
}

/**
 * Handles dropping a dragged task card onto a column, reusing the
 * existing moveTaskTo() logic (same as the Move overlay).
 * @param {DragEvent} ev - The drop event
 * @param {string} newStatus - The column ID the task was dropped on
 */
async function dropTask(ev, newStatus) {
  ev.preventDefault();
  removeHighlight(newStatus);
  if (!currentDraggedElement) return;
  await moveTaskTo(ev, currentDraggedElement, newStatus);
}
