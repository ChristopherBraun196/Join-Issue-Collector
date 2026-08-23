let currentDraggedElement;

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
  const dropzone = document.querySelector(
    `.board-task-body[data-column="${columnId}"]`,
  );
  if (dropzone) dropzone.classList.add("drag-area-highlight");
}

/**
 * Removes the highlight from a column.
 * @param {string} columnId - The column ID to unhighlight
 */
function removeHighlight(columnId) {
  const dropzone = document.querySelector(
    `.board-task-body[data-column="${columnId}"]`,
  );
  if (dropzone) dropzone.classList.remove("drag-area-highlight");
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
