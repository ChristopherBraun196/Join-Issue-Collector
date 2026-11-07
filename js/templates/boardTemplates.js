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
<div class="task-card" draggable="true" ondragstart="startDragging('${element["id"]}')" onclick="openDialogBoard('${element["id"]}')">

  <div class="task-card-topbar">
    <span class="category-badge" style="background-color:${element["categoryLabelColor"]}">${element["category"]}</span>
    <button class="move-to-btn" onclick="toggleMoveOverlay(event, '${element["id"]}', '${element["status"]}')" title="Move to">
      <img src="./assets/icons/move-task.svg" />
    </button>
  </div>

  <h3 class="task-title">${element["title"]}</h3>

  <p class="task-description">${element["description"]}</p>

  <div class="progress-wrapper ${visibility}">
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${progress}%"></div>
    </div>
    <span class="progress-label">${solvedSubtasks}/${totalSubtasks} Subtasks</span>
  </div>

  <div class="task-footer">
    <div class="avatars">
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
            <button onclick="closeDialogBoard('${element.status}')">✕</button>
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
            <button class="delete-edit-button" onclick="deleteTask('${element.id}')">
                <img src="./assets/icons/delete.svg" alt="delete Button">Delete
            </button>
            <div class="dialog-actions-divider"></div>
            <button class="delete-edit-button" onclick="openEditTask('${element.id}')">
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
 * Returns the HTML template for a subtask list item with a configurable toggle function.
 * @param {Object} subtask - The subtask object
 * @param {string} taskID - The ID of the parent task
 * @param {number} subtaskIndex - The index of the subtask
 * @param {string} toggleFn - The toggle function name to call on click
 * @returns {string} HTML string of the subtask list item
 */
export function getSubtasksTemplate(subtask, taskID, subtaskIndex, toggleFn = "toggleSubtask") {
  return `
    <li class="no-decoration board-subtask">
        <label for="${subtask.id}">
            <input type="checkbox" id="${subtask.id}" 
                   onclick="${toggleFn}('${subtaskIndex}', ${subtask.completed}, '${taskID}')" 
                   ${checkIfSubtaskActive(subtask.completed)}>
            ${subtask.title}
        </label>
    </li>
  `;
}

window.getToDoTemplate = getToDoTemplate;
window.getDialogBoardTemplate = getDialogBoardTemplate;
window.getSubtasksTemplate = getSubtasksTemplate;
