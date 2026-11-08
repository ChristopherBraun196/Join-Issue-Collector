import { loadData } from "../../services/database.js";
import { getInitials } from "../../utils/format.js";
import { getToDoTemplate } from "../../templates/boardTemplates.js";
import { tasks, COLUMNS } from "./boardData.js";

/**
 * Renders all task sections on the board.
 * @returns {Promise<void>}
 */
export async function renderAll() {
  await Promise.all(COLUMNS.map((column) => renderSection(column)));

  updateNoTaskPlaceholders();
  updateScrollArrows();
}

/**
 * Render all Tasks for a given status column.
 * @param {string} section - The column name (e.g. "toDo", "inProgress")
 * @returns {Promise<void>}
 */
export async function renderSection(section) {
  await renderCards(
    section,
    tasks.filter((t) => t.status === section),
  );
}

/**
 * Builds all cards of a column first and then sets them in one step,
 * so overlapping renders cannot add the same card twice.
 * @param {string} section - The column name
 * @param {Object[]} sectionTasks - The tasks to show in this column
 * @returns {Promise<void>}
 */
async function renderCards(section, sectionTasks) {
  const container = document.querySelector(`[data-cards="${section}"]`);
  const cards = await Promise.all(sectionTasks.map(getTaskCardHTML));
  container.innerHTML = cards.join("");
}

/**
 * Builds the HTML of a single task card including subtask progress and avatars.
 * @param {Object} element - The task object
 * @returns {Promise<string>} HTML string of the task card
 */
async function getTaskCardHTML(element) {
  const [solved, total, visibility] = getSubtaskData(element);
  return getToDoTemplate(element, solved, total, visibility, calcSubtaskProgress(solved, total));
}

/**
 * Replaces only the card of the given task with a freshly rendered one.
 * @param {string} taskId - The ID of the task to update
 * @returns {Promise<void>}
 */
export async function renderTaskCard(taskId) {
  const element = tasks.find((t) => t.id === taskId);
  const card = document.querySelector(`.task-card[data-id="${taskId}"]`);
  if (!element || !card) return;
  card.outerHTML = await getTaskCardHTML(element);
}

/**
 * Renders the given columns and updates the placeholders.
 * @param  {...string} columns - Column names to re-render
 * @returns {Promise<void>}
 */
export async function reRenderColumns(...columns) {
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
export function scrollColumn(columnId, direction) {
  const container = document.querySelector(`[data-cards="${columnId}"]`);
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
export function updateScrollArrows() {
  for (const col of COLUMNS) {
    const container = document.querySelector(`[data-cards="${col}"]`);
    const body = document.querySelector(`.board__column-body[data-column="${col}"]`);
    if (!container || !body) continue;

    const arrowUp = body.querySelector(".board__arrow--up");
    const arrowDown = body.querySelector(".board__arrow--down");
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
    arrowUp.classList.add("board__arrow--hidden");
    arrowDown.classList.add("board__arrow--hidden");
  } else {
    arrowUp.classList.toggle("board__arrow--hidden", container.scrollLeft <= 2);
    arrowDown.classList.toggle(
      "board__arrow--hidden",
      container.scrollLeft + container.clientWidth >= container.scrollWidth - 2,
    );
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
    arrowUp.classList.add("board__arrow--hidden");
    arrowDown.classList.add("board__arrow--hidden");
  } else {
    arrowUp.classList.toggle("board__arrow--hidden", container.scrollTop <= 2);
    arrowDown.classList.toggle(
      "board__arrow--hidden",
      container.scrollTop + container.clientHeight >= container.scrollHeight - 2,
    );
  }
}

/**
 * Shows or hides the "no tasks" placeholder for each column.
 */
function updateNoTaskPlaceholders() {
  for (let i = 0; i < COLUMNS.length; i++) {
    const column = document.querySelector(`[data-cards="${COLUMNS[i]}"]`);
    const placeholder = document.querySelector(`[data-placeholder="${COLUMNS[i]}"]`);
    const hasTasks = column.querySelector(".task-card") !== null;
    if (!hasTasks) {
      placeholder.classList.remove("board__placeholder--hidden");
    } else {
      placeholder.classList.add("board__placeholder--hidden");
    }
  }
}

export async function findTask(input) {
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
  await Promise.all(
    COLUMNS.map((section) =>
      renderCards(
        section,
        filteredTasks.filter((t) => t.status === section),
      ),
    ),
  );
  updateNoTaskPlaceholders();
  updateScrollArrows();
}

/**
 * Calculates the subtask progress as a percentage.
 * @param {number} solved - The number of completed subtasks
 * @param {number} total - The total number of subtasks
 * @returns {number} The progress percentage (0–100)
 */
function calcSubtaskProgress(solved, total) {
  return (solved / total) * 100;
}

/**
 * Returns the subtask progress data for a given task.
 * @param {Object} element - The task object
 * @returns {Array} Array of [solved, total, visibility]
 */
function getSubtaskData(element) {
  const subtasks = element.subtasks || [];
  const solved = subtasks.filter((subtask) => subtask.completed).length;
  const total = subtasks.length;
  const visibility = total > 0 ? "task-card__progress--visible" : "";
  return [solved, total, visibility];
}

/**
 * Returns the avatar HTML for all members assigned to a task.
 * @param {Object[]} allMembersOfThisTask - Array of assigned member objects
 * @returns {Promise<string>} HTML string of avatar elements
 */
export async function getAssignedToAvatars(allMembersOfThisTask) {
  let members = [];
  if (allMembersOfThisTask == undefined) return "";
  const limit = 3;
  const totalMembers = allMembersOfThisTask.length;
  const displayCount = Math.min(totalMembers, limit);

  for (let i = 0; i < displayCount; i++) {
    const memberID = allMembersOfThisTask[i].id;
    members.push(await getMemberAvatar(memberID));
  }

  if (totalMembers > limit) {
    const overflow = totalMembers - limit;
    members.push(
      `<div class="task-card__avatar task-card__avatar--overflow" title="+${overflow} more">+${overflow}</div>`,
    );
  }
  return members.join("");
}

/**
 * Returns the avatar HTML for a single contact by ID.
 * @param {string} id - The contact ID to load the avatar for
 * @returns {Promise<string>} HTML string of the avatar element
 */
async function getMemberAvatar(id) {
  const member = await loadData("/contacts/" + id);
  if (!member) return "";

  const name = member.name;
  const htmlTemplate = `<div class="task-card__avatar" style="background:${member["avatarColor"]}">${getInitials(name)}</div>`;

  return htmlTemplate;
}
