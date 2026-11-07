let currentEditTaskId = null;

/**
 * Initializes the board by running setup, loading tasks and rendering.
 * @param {string} site - The current site/page identifier
 * @returns {Promise<void>}
 */
async function initBoard(site) {
  init(site);
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
  const main = document.querySelector("#board-main");
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

/**
 * Renders all task sections on the board.
 * @returns {Promise<void>}
 */
async function renderAll() {
  for (const column of COLUMNS) {
    await renderSection(column);
  }

  updateNoTaskPlaceholders();
  updateScrollArrows();
}

/**
 * Render all Tasks for a given status column.
 * @param {string} section - The column name (e.g. "toDo", "inProgress")
 * @returns {Promise<void>}
 */
async function renderSection(section) {
  const container = document.getElementById(section);
  container.innerHTML = "";
  const taskStatus = tasks.filter((t) => t["status"] == section);

  for (let i = 0; i < taskStatus.length; i++) {
    const element = taskStatus[i];
    const [solved, total, visibility] = await getSubtaskData(element);

    container.innerHTML += await getToDoTemplate(
      element,
      solved,
      total,
      visibility,
      calcSubtaskProgress(solved, total),
    );
  }
}

/**
 * Renders the given columns and updates the placeholders.
 * @param  {...string} columns - Column names to re-render
 * @returns {Promise<void>}
 */
async function reRenderColumns(...columns) {
  for (const col of columns) await renderSection(col);
  updateNoTaskPlaceholders();
  updateScrollArrows();
}

/**
 * Scrolls a column's task-cards container.
 * Desktop: vertical, Mobile: horizontal.
 * @param {string} columnId - e.g. "toDo"
 * @param {number} direction - -1 = up/left, 1 = down/right
 */
function scrollColumn(columnId, direction) {
  const container = document.getElementById(columnId);
  if (!container) return;
  const isMobile = window.innerWidth <= 1200;
  const scrollAmount = isMobile ? 260 : 280;

  if (isMobile) {
    container.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
  } else {
    container.scrollBy({ top: direction * scrollAmount, behavior: "smooth" });
  }
  setTimeout(() => updateScrollArrows(), 400);
}

/**
 * Updates scroll arrow visibility for all board columns based on scroll position and overflow.
 * Delegates to mobile or desktop handler depending on screen width.
 * @returns {void}
 */
function updateScrollArrows() {
  for (const col of COLUMNS) {
    const container = document.getElementById(col);
    const body = document.querySelector(`.board-task-body[data-column="${col}"]`);
    if (!container || !body) continue;

    const arrowUp = body.querySelector(".arrow-up");
    const arrowDown = body.querySelector(".arrow-down");
    if (!arrowUp || !arrowDown) continue;

    const isMobile = window.innerWidth <= 1200;

    if (isMobile) {
      handleMobileArrows(container, arrowUp, arrowDown);
    } else {
      handleDesktopArrows(container, arrowUp, arrowDown);
    }
  }
}

/**
 * Shows or hides scroll arrows for horizontal (mobile) scroll containers.
 * @param {HTMLElement} container - The scrollable column container
 * @param {HTMLElement} arrowUp - The left scroll arrow element
 * @param {HTMLElement} arrowDown - The right scroll arrow element
 * @returns {void}
 */
function handleMobileArrows(container, arrowUp, arrowDown) {
  const hasOverflow = container.scrollWidth > container.clientWidth + 2;
  if (!hasOverflow) {
    arrowUp.classList.add("hidden");
    arrowDown.classList.add("hidden");
  } else {
    arrowUp.classList.toggle("hidden", container.scrollLeft <= 2);
    arrowDown.classList.toggle("hidden", container.scrollLeft + container.clientWidth >= container.scrollWidth - 2);
  }
}
/**
 * Shows or hides scroll arrows for vertical (desktop) scroll containers.
 * @param {HTMLElement} container - The scrollable column container
 * @param {HTMLElement} arrowUp - The upward scroll arrow element
 * @param {HTMLElement} arrowDown - The downward scroll arrow element
 * @returns {void}
 */
function handleDesktopArrows(container, arrowUp, arrowDown) {
  const hasOverflow = container.scrollHeight > container.clientHeight + 2;
  if (!hasOverflow) {
    arrowUp.classList.add("hidden");
    arrowDown.classList.add("hidden");
  } else {
    arrowUp.classList.toggle("hidden", container.scrollTop <= 2);
    arrowDown.classList.toggle("hidden", container.scrollTop + container.clientHeight >= container.scrollHeight - 2);
  }
}

/* =========================================================
   PLACEHOLDER
   ========================================================= */

/**
 * Shows or hides the "no tasks" placeholder for each column.
 */
function updateNoTaskPlaceholders() {
  for (let i = 0; i < COLUMNS.length; i++) {
    const column = document.getElementById(COLUMNS[i]);
    const placeholder = document.getElementById("placeholder-" + COLUMNS[i]);
    const hasTasks = column.querySelector(".task-card") !== null;
    if (!hasTasks) {
      placeholder.classList.remove("hidden");
    } else {
      placeholder.classList.add("hidden");
    }
  }
}

async function findTask(input) {
  const query = input.value.toLowerCase();

  if (query.length < 1) {
    renderAll();
    return;
  }

  const matches = tasks.filter(
    (t) => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query),
  );

  await renderFilteredTasks(matches);
}

async function renderFilteredTasks(filteredTasks) {
  for (const section of COLUMNS) {
    const container = document.getElementById(section);
    container.innerHTML = "";

    const sectionTasks = filteredTasks.filter((t) => t.status === section);

    for (const element of sectionTasks) {
      const [solved, total, visibility] = await getSubtaskData(element);
      container.innerHTML += await getToDoTemplate(
        element,
        solved,
        total,
        visibility,
        calcSubtaskProgress(solved, total),
      );
    }
  }
  updateNoTaskPlaceholders();
  updateScrollArrows();
}

function buildContactOptions(allContacts, assignedIds) {
  return Object.entries(allContacts)
    .map(([id, contact]) => {
      const checked = assignedIds.includes(id) ? "checked" : "";
      return getContactOptionTemplate(id, contact, checked);
    })
    .join("");
}

function buildContactBadges(allContacts, assignedIds) {
  return Object.entries(allContacts)
    .filter(([id]) => assignedIds.includes(id))
    .map(([id, contact]) => getContactBadgeTemplate(contact))
    .join("");
}

function buildAssignedContactsEdit(allContacts, assignedIds) {
  const optionsHTML = buildContactOptions(allContacts, assignedIds);
  const badgesHTML = buildContactBadges(allContacts, assignedIds);
  return getAssignedContactsEditTemplate(optionsHTML, badgesHTML);
}

function handleSubtaskKeyEdit(event, taskId) {
  if (event.key === "Enter") {
    event.preventDefault();
    addSubtaskEdit(taskId);
  }
  if (event.key === "Escape") clearSubtaskInputEdit();
}

function editSubtaskEditMode(span) {
  const li = span.closest("li");
  li.innerHTML = getSubtaskEditingStateTemplate(span.textContent);
  li.querySelector("input").focus();
}

function confirmSubtaskEditMode(btn) {
  const li = btn.closest("li");
  const text = li.querySelector(".subtask-edit-input").value.trim();
  if (!text) {
    li.remove();
    return;
  }
  li.outerHTML = getSubtaskEditItemTemplate({ title: text }, li.dataset.taskId, li.dataset.index);
}

/**
 * Returns the active CSS class for a priority button.
 * @param {string} priority - The priority to check
 * @param {string} currentPriority - The currently active priority
 * @returns {string} "active" or empty string
 */
function getPriorityActiveClass(priority, currentPriority) {
  return currentPriority === priority ? "active" : "";
}

/**
 * Returns the HTML template for all priority buttons in the edit dialog.
 * @param {string} currentPriority - The currently active priority (e.g. "urgent")
 * @returns {string} HTML string of all priority buttons
 */
function getPriorityButtonsTemplate(currentPriority) {
  return ["urgent", "medium", "low"].map((p) => getPriorityButtonTemplate(p, currentPriority)).join("");
}
