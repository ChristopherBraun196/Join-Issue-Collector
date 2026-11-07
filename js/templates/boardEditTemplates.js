/**
 * Returns the HTML template for the task edit dialog.
 * @param {Object} element - The task object
 * @param {string} priorityButtons - HTML string of the priority buttons
 * @param {string} assignedHTML - HTML string of the assigned contacts section
 * @param {string} subtasksHTML - HTML string of the subtasks list
 * @returns {string} HTML string of the task edit dialog
 */
export function getDialogBoardEditTemplate(element, priorityButtons, assignedHTML, subtasksHTML) {
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
 * Returns the HTML for a single priority button.
 * @param {string} priority - The priority value (e.g. "urgent")
 * @param {string} currentPriority - The currently active priority
 * @returns {string} HTML string of the priority button
 */
export function getPriorityButtonTemplate(priority, currentPriority) {
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
export function getContactOptionTemplate(id, contact, checked) {
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
export function getContactBadgeTemplate(contact) {
  return `<div class="badge-avatar" style="background:${contact.avatarColor}">${getInitials(contact.name)}</div>`;
}

/**
 * Returns the HTML template for the assigned contacts section in the edit dialog.
 * @param {string} optionsHTML - HTML string of the contact options
 * @param {string} badgesHTML - HTML string of the contact badges
 * @returns {string} HTML string of the assigned contacts edit section
 */
export function getAssignedContactsEditTemplate(optionsHTML, badgesHTML) {
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
export function getSubtaskEditItemTemplate(subtask, taskId, index) {
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
export function getSubtaskEditingStateTemplate(currentText) {
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
export function getSubtaskEditActionsTemplate() {
  return `
        <button class="subtask-icon-btn" data-action="remove-subtask" type="button">
            <img src="./assets/icons/delete.svg" alt="Delete">
        </button>
        <div class="subtask-divider"></div>
        <button class="subtask-icon-btn" data-action="confirm-subtask" type="button">
            <img src="./assets/icons/check-dark.svg" alt="Confirm">
        </button>
    `;
}

window.getDialogBoardEditTemplate = getDialogBoardEditTemplate;
window.getPriorityButtonTemplate = getPriorityButtonTemplate;
window.getContactOptionTemplate = getContactOptionTemplate;
window.getContactBadgeTemplate = getContactBadgeTemplate;
window.getAssignedContactsEditTemplate = getAssignedContactsEditTemplate;
window.getSubtaskEditItemTemplate = getSubtaskEditItemTemplate;
window.getSubtaskEditingStateTemplate = getSubtaskEditingStateTemplate;
