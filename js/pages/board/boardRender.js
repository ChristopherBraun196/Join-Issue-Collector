import { loadData } from "../../services/database.js";
import { getInitials } from "../../utils/format.js";
import { getToDoTemplate } from "../../templates/boardTemplates.js";
import { tasks, COLUMNS } from "./boardData.js";

/**
 * Renders all task sections on the board.
 * @returns {Promise<void>}
 */
export async function renderAll() {
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
export async function renderSection(section) {
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
export function updateScrollArrows() {
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
 * @returns {Promise<Array>} Array of [solved, total, visibility]
 */
async function getSubtaskData(element) {
  const solved = await getAmountSolvedSubtasks(element["id"]);
  const total = await getNumberOfSubtasks(element["id"]);
  let visibility = "";
  if (total != 0) visibility = "show";
  return [solved, total, visibility];
}

/**
 * Returns the number of completed subtasks for a given task.
 * @param {string} taskID - The ID of the task
 * @returns {Promise<string>} The amount of completed subtasks as a string
 */
async function getAmountSolvedSubtasks(taskID) {
  const task = await loadData("/tasks/" + taskID);
  if (task.subtasks === undefined) return 0;
  let amount = 0;
  for (let i = 0; i < task.subtasks.length; i++) {
    if (task.subtasks[i]["completed"] == true) amount++;
  }
  return String(amount);
}

/**
 * Returns the total number of subtasks for a given task.
 * @param {string} taskID - The ID of the task
 * @returns {Promise<number>} The total number of subtasks
 */
async function getNumberOfSubtasks(taskID) {
  const task = await loadData("/tasks/" + taskID);
  if (task.subtasks === undefined) return 0;

  return task.subtasks.length;
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
    members.push(`<div class="avatar overflow-badge" title="+${overflow} more">+${overflow}</div>`);
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
  const htmlTemplate = `<div class="avatar" style="background:${member["avatarColor"]}">${getInitials(name)}</div>`;

  return htmlTemplate;
}

window.getAssignedToAvatars = getAssignedToAvatars;
