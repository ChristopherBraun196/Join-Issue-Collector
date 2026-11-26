import { formatDate, capitalize } from "../utils/format.js";
import { getAvatarContent } from "../utils/avatar.js";
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
   <button class="task-card__move-btn" data-action="toggle-move" data-id="${element["id"]}" data-status="${element["status"]}" title="Move to" aria-label="Move task">
      <img src="./assets/icons/move-task.svg" alt="" />
    </button>
  </div>

  <h3 class="task-card__title">${element["title"]}</h3>

  <p class="task-card__description">${element["description"]}</p>

  <div class="task-card__progress ${visibility}" title="${solvedSubtasks} of ${totalSubtasks} subtasks done">
    <div class="task-card__progress-bar">
      <div class="task-card__progress-fill" style="width: ${progress}%"></div>
    </div>
    <span class="task-card__progress-label">${solvedSubtasks}/${totalSubtasks} Subtasks</span>
  </div>

  <div class="task-card__footer">
    <div class="task-card__avatars">
      ${await getAssignedToAvatars(element.assignedTo)}
    </div>
    <span><img src="./assets/icons/priority-${element["priority"]}.svg" alt="Priority ${element["priority"]}" /></span>
  </div>
</div>`;
}

/**
 * Returns the HTML template for the task detail dialog.
 * @param {Object} element - The task object
 * @param {Object[]} assignedContacts - Array of assigned contact objects
 * @param {Object[]} subtasks - Array of subtask objects
 * @param {Object} [matchedCreator] - The contact that created the task, if found
 * @returns {string} HTML string of the task detail dialog
 */
export function getDialogBoardTemplate(element, assignedContacts, subtasks, matchedCreator) {
  return `
    <header class="task-dialog__header">
        <div class="task-dialog__top">
            <div class="task-dialog__badges">
                <span class="category-badge" style="background-color:${element["categoryLabelColor"]}">${element["category"]}</span>
                ${element.isAiGenerated ? '<span class="task-dialog__ai-badge"><img src="./assets/icons/wand_stars.svg" alt=""> Ai-generated</span>' : ""}
            </div>
            <button class="task-dialog__close" data-action="close-task" data-id="${element.id}" aria-label="Close"><img class="task-dialog__close-icon" src="./assets/icons/close.svg" alt=""></button>
        </div>
        <h2 class="task-dialog__title">${element.title}</h2>
    </header>
    <main class="task-dialog__body">
        <p class="task-dialog__description">${element.description}</p>
        <div class="task-dialog__row">
            <span class="task-dialog__row-label">Source:</span>
            ${getSourceBadgeTemplate(element)}
        </div>
        <div class="task-dialog__row">
            <span class="task-dialog__row-label">Creator:</span>
            <span class="task-dialog__row-value">${element.creatorName || element.creator || "Unknown"}</span>
            ${getCreatorLinkTemplate(element, matchedCreator)}
        </div>
        <div class="task-dialog__row">
            <span class="task-dialog__row-label">Due date:</span>
            <span class="task-dialog__row-value">${formatDate(element.dueDate)}</span>
        </div>
        <div class="task-dialog__row">
            <span class="task-dialog__row-label">Priority:</span>
            <span class="task-dialog__row-value">${capitalize(element["priority"])} <img src="./assets/icons/priority-${element["priority"]}.svg" alt=""></span>
        </div>
        <div class="task-dialog__row">
            <span class="task-dialog__row-label">Assigned To:</span>
            <div class="task-dialog__avatars">${assignedContacts.map(getAssignedContactTemplate).join("")}</div>
        </div>
        ${getDialogAttachmentsTemplate(element.attachments, element.id)}
        <section class="task-dialog__section">
            <h3 class="task-dialog__section-title">Subtasks</h3>
            <ul class="task-dialog__subtasks">
                ${checkIfSubtasksAvaiable(subtasks, element.id)}
            </ul>
        </section>
    </main>
    <footer class="task-dialog__footer">
        <div class="task-dialog__actions">
            <button class="task-dialog__action-btn" data-action="delete-task" data-id="${element.id}">
              <img class="task-dialog__action-icon" src="./assets/icons/delete.svg" alt=""><span class="task-dialog__action-label" data-label="Delete">Delete</span>
            </button>
            <div class="task-dialog__divider"></div>
            <button class="task-dialog__action-btn" data-action="edit-task" data-id="${element.id}">
              <img class="task-dialog__action-icon" src="./assets/icons/edit.svg" alt=""><span class="task-dialog__action-label" data-label="Edit">Edit</span>
            </button>
        </div>
    </footer>
  `;
}

/**
 * Returns the source badge of a task: Extern (e-mail), Guest or Member.
 * @param {Object} element - The task object
 * @returns {string} HTML string of the source badge
 */
function getSourceBadgeTemplate(element) {
  if (element.creatorType === "external") {
    return `<span class="task-dialog__creator-badge task-dialog__creator-badge--external"><img src="./assets/icons/global.svg" alt=""> Extern</span>`;
  }
  if (element.creatorType === "guest" || element.creatorName === "Guest") {
    return `<span class="task-dialog__creator-badge task-dialog__creator-badge--guest"><img src="./assets/icons/person.svg" alt=""> Guest</span>`;
  }
  return `<span class="task-dialog__creator-badge task-dialog__creator-badge--internal"><img src="./assets/icons/member.svg" alt=""> Member</span>`;
}

/**
 * Returns the link to the creator: e-mail for external creators, profile for known contacts, nothing for guests.
 * @param {Object} element - The task object
 * @param {Object} [matchedCreator] - The contact that created the task, if found
 * @returns {string} HTML string of the creator link or an empty string
 */
function getCreatorLinkTemplate(element, matchedCreator) {
  if (element.creatorType === "external") {
    return `<a href="mailto:${element.creatorEmail || ""}" class="task-dialog__creator-link"><img src="./assets/icons/attach_email.svg" alt=""> E-mail</a>`;
  }
  if (!matchedCreator) return "";
  return `<a href="./contacts.html?id=${matchedCreator.id}" class="task-dialog__creator-link"><img src="./assets/icons/member.svg" alt=""> Profile</a>`;
}

/**
 * Returns the HTML template for an assigned contact in the task dialog.
 * @param {Object} contact - The contact object
 * @returns {string} HTML string of the assigned contact
 */
function getAssignedContactTemplate(contact) {
  return `
    <span class="task-dialog__avatar" style="background-color:${contact.avatarColor}" title="${contact.name}" role="img" aria-label="${contact.name}">${getAvatarContent(contact)}</span>
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
    <li class="no-decoration task-dialog__subtask">
        <label class="task-dialog__subtask-label" for="${subtask.id}">
            <input type="checkbox" id="${subtask.id}"
                  data-action="toggle-subtask" data-index="${subtaskIndex}" data-completed="${subtask.completed}" data-id="${taskID}"
                   ${checkIfSubtaskActive(subtask.completed)}>
            ${subtask.title}
        </label>
    </li>
  `;
}

/**
 * Returns one attachment thumbnail with a download link for the task detail dialog.
 * @param {{name: string, base64: string}} attachment - The image
 * @param {number} index - The position of the image in the attachments array
 * @param {string} taskId - The ID of the task the image belongs to
 * @returns {string} HTML string of the list item
 */
function getDialogAttachmentTemplate(attachment, index, taskId) {
  return `
    <li class="attachments__item">
        <button class="attachments__open" type="button" data-action="open-viewer" data-id="${taskId}" data-index="${index}" aria-label="Open ${attachment.name}">
            <img class="attachments__thumb" src="${attachment.base64}" alt="">
        </button>
        <a class="attachments__download" href="${attachment.base64}" download="${attachment.name}" aria-label="Download ${attachment.name}">
            <svg class="attachments__download-icon" viewBox="0 -960 960 960" aria-hidden="true"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" fill="currentColor"/></svg>
        </a>
        <span class="attachments__name">${attachment.name}</span>
    </li>
  `;
}

/**
 * Returns the attachments section of the task detail dialog, or an empty string if there are none.
 * @param {Array<{name: string, base64: string}>} [attachments] - The images of the task
 * @param {string} taskId - The ID of the task
 * @returns {string} HTML string of the attachments section
 */
function getDialogAttachmentsTemplate(attachments = [], taskId) {
  if (attachments.length === 0) return "";
  return `
    <section class="task-dialog__section task-dialog__attachments">
        <h3 class="task-dialog__section-title">Attachments</h3>
        <ul class="attachments__list">
            ${attachments.map((attachment, index) => getDialogAttachmentTemplate(attachment, index, taskId)).join("")}
        </ul>
    </section>
  `;
}
