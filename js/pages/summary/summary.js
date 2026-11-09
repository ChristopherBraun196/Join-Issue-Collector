import { initGreeting } from "./summaryAuth.js";
import { init as initLayout } from "../../components/layout.js";
import { loadData } from "../../services/database.js";
import { STATUS } from "../../utils/constants.js";

/**
 * Entry point for the summary page.
 */
function init() {
  initLayout("summary");
  initGreeting();
  initSummary();
  document.querySelector(".summary").addEventListener("click", handleBubbleClick);
}

/**
 * Opens the board when a summary bubble is clicked.
 * @param {MouseEvent} event - The click event
 */
function handleBubbleClick(event) {
  if (event.target.closest(".summary__bubble")) window.location.href = "./board.html";
}

/**
 * Calculates the summary counts for all task statuses and priorities.
 * @param {Object[]} tasks - Array of task objects
 * @returns {Object} Object containing all counts and the upcoming deadline
 */
function getSummaryCounts(tasks) {
  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && t.status !== STATUS.DONE);
  return {
    toDoCount: tasks.filter((t) => t.status === STATUS.TO_DO).length,
    doneCount: tasks.filter((t) => t.status === STATUS.DONE).length,
    progressCount: tasks.filter((t) => t.status === STATUS.IN_PROGRESS).length,
    feedbackCount: tasks.filter((t) => t.status === STATUS.AWAIT).length,
    boardCount: tasks.length,
    urgentCount: urgentTasks.length,
    deadline: getNextDeadline(urgentTasks),
    emailRequestsCount: tasks.filter((t) => t.isAiGenerated).length,
  };
}

/**
 * Renders the summary counts into the corresponding DOM elements.
 * @param {Object} counts - The counts object returned by getSummaryCounts
 */
function renderSummaryElements(counts) {
  document.querySelector('[data-count="todo"]').textContent = counts.toDoCount;
  document.querySelector('[data-count="done"]').textContent = counts.doneCount;
  document.querySelector('[data-count="progress"]').textContent = counts.progressCount;
  document.querySelector('[data-count="feedback"]').textContent = counts.feedbackCount;
  document.querySelector('[data-count="board"]').textContent = counts.boardCount;
  document.querySelector('[data-count="urgent"]').textContent = counts.urgentCount;
  document.querySelector(".summary__deadline").textContent = counts.deadline;
  document.querySelector('[data-count="email-requests"]').textContent = counts.emailRequestsCount;
}

/**
 * Initializes the summary page by loading tasks and updating all counters.
 * @returns {Promise<void>}
 */
async function initSummary() {
  const data = await loadData("/tasks");
  const tasks = data ? Object.entries(data).map(([id, task]) => ({ ...task, id })) : [];
  renderSummaryElements(getSummaryCounts(tasks));
  if (window.innerWidth <= 1200) setTimeout(fadeOutGreeting, 1000);
}

/**
 * Fades out the mobile greeting overlay and hides it once the transition has finished.
 */
function fadeOutGreeting() {
  const greeting = document.querySelector(".summary__greeting");
  if (!greeting) return;
  greeting.classList.add("summary__greeting--fade-out");
  greeting.addEventListener("transitionend", () => greeting.classList.add("summary__greeting--hidden"), {
    once: true,
  });
}

/**
 * Returns the nearest upcoming deadline from a list of urgent tasks.
 * @param {Object[]} urgentTasks - Array of urgent task objects
 * @returns {string} The formatted deadline date or "No deadline"
 */
function getNextDeadline(urgentTasks) {
  const withDeadline = urgentTasks.filter((t) => t.dueDate).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  if (withDeadline.length === 0) return "No deadline";

  const date = new Date(withDeadline[0].dueDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: window.innerWidth <= 380 ? "short" : "long",
    day: "numeric",
  });
}

document.addEventListener("DOMContentLoaded", init);
