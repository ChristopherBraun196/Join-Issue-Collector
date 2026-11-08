import { getInitials, formatDate, capitalize } from "../utils/format.js";
import { getAssignedToAvatars } from "../pages/board/boardRender.js";

/**
 * Returns the HTML template for a task card on the board.
 * @param {Object} element - The task object
 * @param {number} solvedSubtasks - The number of completed subtasks
 * @param {number} totalSubtasks - The total number of subtasks
 * @param {string} visibility - CSS class to show or hide the progress bar
 * @param {number} progress - The progress percentage (0-100)
 * @returns {Promise<string>} HTML string of the task card
 */
export async function getToDoTemplate(element, solvedSubtasks, totalSubtasks, visibility = "", progress) {
  return `  
<div class="task-card" draggable="true" data-action="open-task" data-id="${element["id"]}">

  <div class="task-card__topbar">
    <span class="category-badge" style="background-color:${element["categoryLabelColor"]}">${element["category"]}</span>
   <button class="task-card__move-btn" data-action="toggle-move" data-id="${element["id"]}" data-status="${element["status"]}" title="Move to">
      <img src="./assets/icons/move-task.svg" />
    </button>
  </div>

  <h3 class="task-card__title">${element["title"]}</h3>

  <p class="task-card__description">${element["description"]}</p>

  <div class="task-card__progress ${visibility}">
    <div class="task-card__progress-bar">
      <div class="task-card__progress-fill" style="width: ${progress}%"></div>
    </div>
    <span class="task-card__progress-label">${solvedSubtasks}/${totalSubtasks} Subtasks</span>
  </div>

  <div class="task-card__footer">
    <div class="task-card__avatars">
      ${await getAssignedToAvatars(element.assignedTo)}
    </div>
    <span><img src="./assets/icons/priority-${element["priority"]}.svg" /></span>
  </div>
</div>`;
}

/**
 * Returns the HTML template for the task detail dialog.
 * @param {Object} element - The task object
 * @param {Object[]} assignedContacts - Array of assigned contact objects
 * @param {Object[]} subtasks - Array of subtask objects
 * @returns {string} HTML string of the task detail dialog
 */
export function getDialogBoardTemplate(element, assignedContacts, subtasks, matchedCreator) {
  return `
    <header>
        <div class="flex-sb">
            <span class="category-badge" style="background-color:${element["categoryLabelColor"]}">${element["category"]}</span>
            ${element.isAiGenerated ? '<span class="ai-badge"><img src="./assets/icons/wand_stars.svg" alt="AI Icon"> Ai-generated</span>' : ""}
            <button data-action="close-task" data-status="${element.status}">✕</button>
        </div>
        <h2>${element.title}</h2>
    </header>
    <main>
        <p>${element.description}</p>
        <p class="creator-type-badge ${element.creatorType === "external" ? "creator-type-external" : "creator-type-internal"}">
           ${
             element.creatorType === "external"
               ? '<img src="./assets/icons/global.svg" alt="Global"> Extern'
               : '<img src="./assets/icons/member.svg" alt="Member"> Member'
           }
        </p>
        <p class="creator-row">
            <span>Creator: ${element.creatorName || element.creator || "Unknown"}</span>
            ${
              element.creatorType === "external"
                ? `<a href="mailto:${element.creatorEmail || ""}" class="creator-action"><img src="./assets/icons/attach_email.svg" alt="Email"> E-mail</a>`
                : `<a href="./contacts.html?id=${matchedCreator?.id || ""}" class="creator-action"><img src="./assets/icons/member.svg" alt="Member"> Profil</a>`
            }
        </p>
        <p><span>Due date:</span><span>${formatDate(element.dueDate)}</span></p>
        <p>
            <span>Priority:</span>
            <span>${capitalize(element["priority"])} <img src="./assets/icons/priority-${element["priority"]}.svg" /></span>
        </p>
        <div class="contact-list">
            <p class="dialog-gap">Assigned To:</p>
            <p>${assignedContacts.map(getAssignedContactTemplate).join("")}</p>
        </div>
        <div>
            <p>Subtasks</p>
            <ul id="subtasks">
                ${checkIfSubtasksAvaiable(subtasks, element.id)}
            </ul>
        </div>
    </main>
    <footer>
        <div class="dialog-board-actions">
            <button class="delete-edit-button" data-action="delete-task" data-id="${element.id}">
                <img src="./assets/icons/delete.svg" alt="delete Button">Delete
            </button>
            <div class="dialog-actions-divider"></div>
            <button class="delete-edit-button" data-action="edit-task" data-id="${element.id}">
                <img src="./assets/icons/edit.svg" alt="edit Button">Edit
            </button>
        </div>
    </footer>
  `;
}

/**
 * Returns the HTML template for an assigned contact in the task dialog.
 * @param {Object} contact - The contact object
 * @returns {string} HTML string of the assigned contact
 */
function getAssignedContactTemplate(contact) {
  return `
    <div class="assigned-contact">
      <span class="avatar" style="background-color:${contact.avatarColor}">${getInitials(contact.name)}</span>
      <span>${contact.name}</span>
    </div>
  `;
}

/**
 * Returns "checked" if the subtask is completed, otherwise an empty string.
 * @param {boolean} subtaskCompleted - The completed state of the subtask
 * @returns {string} "checked" or empty string
 */
function checkIfSubtaskActive(subtaskCompleted) {
  if (subtaskCompleted == true) {
    return "checked";
  } else {
    return "";
  }
}

/**
 * Returns the subtask HTML for the task card, or a fallback message.
 * @param {Object[]} subtasks - Array of subtask objects
 * @param {string} taskID - The ID of the parent task
 * @returns {string} HTML string of all subtasks or fallback message
 */
function checkIfSubtasksAvaiable(subtasks, taskID) {
  if (subtasks) {
    return subtasks.map((s, index) => getSubtasksTemplate(s, taskID, index)).join("");
  } else {
    return "<p>No Subtask avaiable in this Task</p>";
  }
}

/**
 * Returns the HTML template for a subtask list item in the task detail dialog.
 * @param {Object} subtask - The subtask object
 * @param {string} taskID - The ID of the parent task
 * @param {number} subtaskIndex - The index of the subtask
 * @returns {string} HTML string of the subtask list item
 */
function getSubtasksTemplate(subtask, taskID, subtaskIndex) {
  return `
    <li class="no-decoration board-subtask">
        <label for="${subtask.id}">
            <input type="checkbox" id="${subtask.id}"
                  data-action="toggle-subtask" data-index="${subtaskIndex}" data-completed="${subtask.completed}" data-id="${taskID}"
                   ${checkIfSubtaskActive(subtask.completed)}>
            ${subtask.title}
        </label>
    </li>
  `;
}
