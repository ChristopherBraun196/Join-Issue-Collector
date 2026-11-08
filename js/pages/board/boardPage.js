import "../../components/dialogGuard.js";
import { init as initLayout } from "../../components/layout.js";
import { openAddTaskDialog } from "../../components/taskForm.js";
import { initTasks } from "./boardData.js";
import { renderAll, scrollColumn, updateScrollArrows, findTask } from "./boardRender.js";
import { toggleMoveOverlay, moveTaskTo, handleOutsideClick } from "./moveOverlay.js";
import { initDragDrop } from "./dragDrop.js";
import { handleDialogBoardClick, handleDialogBoardInput, handleDialogBoardKey, openDialogBoard } from "./taskDialog.js";

/**
 * Entry point for the board page: layout, listeners, tasks and rendering.
 * @returns {Promise<void>}
 */
async function init() {
  initLayout("board");
  initBoardListeners();
  initDragDrop();
  await initTasks();
  await renderAll();
  document.addEventListener("click", handleOutsideClick);
  window.addEventListener("resize", updateScrollArrows);
}

/**
 * Registers the delegated click listener for the board page.
 */
function initBoardListeners() {
  const main = document.querySelector(".board");
  const dialog = document.querySelector("#openDialogBoard");
  main.addEventListener("click", handleBoardClick);
  main.addEventListener("input", handleBoardInput);
  dialog.addEventListener("click", handleDialogBoardClick);
  dialog.addEventListener("input", handleDialogBoardInput);
  dialog.addEventListener("keydown", handleDialogBoardKey);
}

/**
 * Handles all clicks on the board page via data-action.
 * @param {MouseEvent} event - The click event
 */
function handleBoardClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const { action, id, status, target: columnId, direction } = target.dataset;
  if (action === "add-task") openAddTaskDialog(status);
  if (action === "scroll-column") scrollColumn(columnId, Number(direction));
  if (action === "search-task") findTask(target.closest(".search-input-group").querySelector(".find-task"));
  if (action === "open-task") openDialogBoard(id);
  if (action === "toggle-move") toggleMoveOverlay(event, id, status);
  if (action === "move-task") moveTaskTo(event, id, status);
}

/**
 * Filters the tasks while typing in one of the search inputs.
 * @param {InputEvent} event - The input event
 */
function handleBoardInput(event) {
  if (event.target.matches(".find-task")) findTask(event.target);
}

document.addEventListener("DOMContentLoaded", init);
