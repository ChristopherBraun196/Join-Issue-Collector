/**
 * Returns the HTML template for a task card on the board.
 * @param {Object} element - The task object
 * @param {number} solvedSubtasks - The number of completed subtasks
 * @param {number} totalSubtasks - The total number of subtasks
 * @param {string} visibility - CSS class to show or hide the progress bar
 * @param {number} progress - The progress percentage (0-100)
 * @returns {Promise<string>} HTML string of the task card
 */
async function getToDoTemplate(element, solvedSubtasks, totalSubtasks, visibility = "", progress) {
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
function getDialogBoardTemplate(element, assignedContacts, subtasks, matchedCreator) {
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
 * Returns the HTML template for the task edit dialog.
 * @param {Object} element - The task object
 * @param {string} priorityButtons - HTML string of the priority buttons
 * @param {string} assignedHTML - HTML string of the assigned contacts section
 * @param {string} subtasksHTML - HTML string of the subtasks list
 * @returns {string} HTML string of the task edit dialog
 */
function getDialogBoardEditTemplate(element, priorityButtons, assignedHTML, subtasksHTML) {
  return `
    <header>
        <div class="flex-sb">
            <span class="category-badge" style="background-color:${element["categoryLabelColor"]}">${element["category"]}</span>
            <button onclick="closeDialogBoard('${element.status}')">✕</button>
        </div>
    </header>
    <main>
        <label class="edit-margin" for="edit-title">Title</label>
        <input type="text" id="edit-title" value="${element.title}" />
        <label class="edit-margin" for="edit-description">Description</label>
        <textarea id="edit-description">${element.description}</textarea>
        <label class="edit-margin" for="edit-due-date">Due date</label>
        <input type="date" id="edit-due-date" value="${element.dueDate}" />
        <label class="edit-margin">Priority</label>
        <div class="priority-buttons">${priorityButtons}</div>
        <label class="edit-margin">Assigned To</label>
        <div class="contacts-edit-list">${assignedHTML}</div>
        <label class="edit-margin">Subtasks</label>
        <div class="subtask-input-wrapper">
            <input type="text" id="new-subtask-input" placeholder="Add new subtask"
                   oninput="onSubtaskInputEdit()"
                   onkeydown="handleSubtaskKeyEdit(event, '${element.id}')">
            <div id="subtask-confirm-btns-edit" class="subtask-confirm-btns">
                <button class="subtask-icon-btn" type="button" onclick="clearSubtaskInputEdit()">
                    <img src="./assets/icons/close.svg">
                </button>
                <div class="subtask-divider-edit"></div>
                <button class="subtask-icon-btn" type="button" onclick="addSubtaskEdit('${element.id}')">
                    <img src="./assets/icons/check-dark.svg">
                </button>
            </div>
        </div>
        <ul id="subtasks">${subtasksHTML}</ul>
    </main>
    <footer>
        <div class="dialog-actions">
            <button class="save-edit-button" onclick="saveEditTask('${element.id}')">
                Ok <img src="./assets/icons/check.svg" alt="save Button">
            </button>
        </div>
    </footer>
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
function getSubtasksTemplate(subtask, taskID, subtaskIndex, toggleFn = "toggleSubtask") {
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

/**
 * Returns the HTML for a single priority button.
 * @param {string} priority - The priority value (e.g. "urgent")
 * @param {string} currentPriority - The currently active priority
 * @returns {string} HTML string of the priority button
 */
function getPriorityButtonTemplate(priority, currentPriority) {
  const active = getPriorityActiveClass(priority, currentPriority);
  return `<button class="prio-btn ${active}" data-priority="${priority}" onclick="setEditPriority(event, '${priority}')">
    ${capitalize(priority)} <span><img src="./assets/icons/priority-${priority}.svg" /></span>
  </button>`;
}

/**
 * Returns the HTML template for a contact option in the assignment dropdown.
 * @param {string} id - The contact ID
 * @param {Object} contact - The contact object
 * @param {string} checked - The checked attribute string if selected
 * @returns {string} HTML string of the contact option
 */
function getContactOptionTemplate(id, contact, checked) {
  return `
    <div class="custom-option" onclick="toggleAssignedContact(event, '${id}')">
      <span class="avatar" style="background:${contact.avatarColor}">${getInitials(contact.name)}</span>
      <span>${contact.name}</span>
      <input type="checkbox" value="${id}" ${checked} style="margin-left:auto" />
    </div>`;
}

/**
 * Returns the HTML template for a contact badge.
 * @param {Object} contact - The contact object
 * @returns {string} HTML string of the contact badge
 */
function getContactBadgeTemplate(contact) {
  return `<div class="badge-avatar" style="background:${contact.avatarColor}">${getInitials(contact.name)}</div>`;
}

/**
 * Returns the HTML template for the assigned contacts section in the edit dialog.
 * @param {string} optionsHTML - HTML string of the contact options
 * @param {string} badgesHTML - HTML string of the contact badges
 * @returns {string} HTML string of the assigned contacts edit section
 */
function getAssignedContactsEditTemplate(optionsHTML, badgesHTML) {
  return `
    <div class="custom-select-wrapper">
      <div class="custom-select-trigger" onclick="toggleEditDropdown()">
        <span>Select contacts to assign</span>
        <img src="./assets/icons/arrow_drop_down.svg" class="select-arrow">
      </div>
      <div class="custom-select-dropdown" id="edit-assigned-dropdown">
        <div class="custom-select-dropdown-inner">${optionsHTML}</div>
      </div>
    </div>
    <div id="edit-assigned-badges" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">${badgesHTML}</div>
  `;
}

/**
 * Returns the HTML template for a subtask edit list item.
 * @param {Object} subtask - The subtask object
 * @param {string} taskId - The ID of the parent task
 * @param {number} index - The index of the subtask
 * @returns {string} HTML string of the subtask edit list item
 */
function getSubtaskEditItemTemplate(subtask, taskId, index) {
  return `
    <li class="subtask-edit-item" data-task-id="${taskId}" data-index="${index}">
      <span class="subtask-text" onclick="editSubtaskEditMode(this)">${subtask.title}</span>
      <div class="subtask-item-actions">
        <button class="subtask-icon-btn" type="button" onclick="editSubtaskEditMode(this.closest('li').querySelector('.subtask-text'))">
          <img src="./assets/icons/edit.svg">
        </button>
        <div class="subtask-divider"></div>
        <button class="subtask-icon-btn" type="button" onclick="deleteSubtaskEdit('${taskId}', ${index})">
          <img src="./assets/icons/delete.svg">
        </button>
      </div>
    </li>
  `;
}

/**
 * Returns the HTML template for a subtask in editing state.
 * @param {string} currentText - The current subtask title
 * @returns {string} HTML string of the subtask editing state
 */
function getSubtaskEditingStateTemplate(currentText) {
  return `
    <input class="subtask-edit-input" type="text" value="${currentText}">
    <div class="subtask-item-actions">
      <button class="subtask-icon-btn" type="button" onclick="this.closest('li').remove()">
        <img src="./assets/icons/delete.svg">
      </button>
      <div class="subtask-divider"></div>
      <button class="subtask-icon-btn" type="button" onclick="confirmSubtaskEditMode(this)">
        <img src="./assets/icons/check-dark.svg">
      </button>
    </div>
  `;
}

/**
 * Returns the HTML template for subtask edit action buttons.
 * Contains a delete button and a confirm button separated by a divider.
 * @returns {string} HTML string with delete and confirm action buttons
 */
function getSubtaskEditActionsTemplate() {
  return `
        <button class="subtask-icon-btn" onclick="removeSubtask(this)" type="button">
            <img src="./assets/icons/delete.svg" alt="Delete">
        </button>
        <div class="subtask-divider"></div>
        <button class="subtask-icon-btn" onclick="confirmEditSubtask(this)" type="button">
            <img src="./assets/icons/check-dark.svg" alt="Confirm">
        </button>
    `;
}
