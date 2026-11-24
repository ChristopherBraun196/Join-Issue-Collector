import { capitalize, getDisplayName } from "../utils/format.js";
import { getAvatarContent } from "../utils/avatar.js";

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
    <header class="task-dialog__header">
        <div class="task-dialog__top task-dialog__top--edit">
            <button class="task-dialog__close" data-action="close-task" data-id="${element.id}" aria-label="Close"><img class="task-dialog__close-icon" src="./assets/icons/close.svg" alt=""></button>
        </div>
    </header>
    <main class="task-dialog__body">
        <div class="task-edit__columns">
            <div class="task-edit__column task-edit__column--left">
                <div class="task-edit__field">
                    <label class="task-edit__label" for="edit-title">Title<span class="task-form__required">*</span></label>
                    <input type="text" class="task-edit__input task-edit__input--title" id="edit-title" value="${element.title}" required data-error-msg="Please enter a title" />
                    <span class="task-form__error"></span>
                </div>
                <div class="task-edit__field">
                    <label class="task-edit__label" for="edit-description">Description</label>
                    <textarea class="task-edit__input task-edit__input--description" id="edit-description">${element.description}</textarea>
                </div>
                <div class="task-edit__field">
                    <label class="task-edit__label" for="edit-due-date">Due date<span class="task-form__required">*</span></label>
                    <input type="date" class="task-edit__input task-edit__input--due-date" id="edit-due-date" value="${element.dueDate}" required data-error-msg="Please pick a due date" />
                    <span class="task-form__error"></span>
                </div>
                <div class="task-edit__field">
                    <p class="task-edit__label">Prio</p>
                    <div class="task-edit__priority">${priorityButtons}</div>
                </div>
                <div class="task-edit__field">
                    <p class="task-edit__label">Category<span class="task-form__required">*</span></p>
                    <div class="dropdown dropdown--category task-edit__category">
                        <div class="dropdown__trigger" data-action="toggle-edit-category">
                            <span class="task-edit__category-label">${element.category}</span>
                            <img src="./assets/icons/arrow_drop_down.svg" class="dropdown__arrow" alt="">
                        </div>
                        <div class="dropdown__menu">
                            <div class="dropdown__list">
                                <div class="dropdown__option" data-action="select-edit-category" data-value="Technical Task">
                                    <span class="dropdown__label">Technical Task</span>
                                </div>
                                <div class="dropdown__option" data-action="select-edit-category" data-value="User Story">
                                    <span class="dropdown__label">User Story</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="task-edit__column">
                <div class="task-edit__field attachments">
                    <label class="task-edit__label" for="attachmentsInput">Attachments</label>
                    <div class="attachments__header">
                        <p class="attachments__hint" id="attachmentsHint">Allowed file types are JPEG and PNG</p>
                        <button class="attachments__delete-all" type="button" data-action="delete-all-attachments" hidden>
                            <img class="attachments__delete-icon" src="./assets/icons/delete.svg" alt="">
                            Delete all
                        </button>
                    </div>
                    <label class="attachments__dropzone">
                        <span class="attachments__text--desktop">Drag a file or browse</span>
                        <span class="attachments__text--mobile">Upload file</span>
                        <svg class="attachments__plus-icon" viewBox="0 0 19 19" aria-hidden="true"><path d="M8 10.6667H0V8H8V0H10.6667V8H18.6667V10.6667H10.6667V18.6667H8V10.6667Z" fill="currentColor"/></svg>
                        <input class="attachments__input" id="attachmentsInput" type="file" accept="image/jpeg, image/png" multiple aria-describedby="attachmentsHint">
                    </label>
                    <span class="attachments__error" role="alert"></span>
                    <ul class="attachments__list"></ul>
                </div>
                <div class="task-edit__field">
                    <label class="task-edit__label" for="edit-subtask">Subtasks</label>
                    <div class="subtask__input-wrap">
                        <input type="text" class="subtask__input" id="edit-subtask" placeholder="Add new subtask" data-id="${element.id}">
                        <div class="subtask__confirm">
                            <button class="subtask__btn" type="button" data-action="clear-subtask-edit" aria-label="Cancel">
                                <img class="subtask__btn-icon" src="./assets/icons/close.svg" alt="">
                            </button>
                            <div class="task-edit__divider"></div>
                            <button class="subtask__btn" type="button" data-action="add-subtask-edit" data-id="${element.id}" aria-label="Add subtask">
                                <img class="subtask__btn-icon" src="./assets/icons/check-dark.svg" alt="">
                            </button>
                        </div>
                        <label class="subtask__btn subtask__plus" for="edit-subtask" aria-label="Add subtask">
                            <svg class="subtask__btn-icon" viewBox="0 0 19 19" aria-hidden="true"><path d="M8 10.6667H0V8H8V0H10.6667V8H18.6667V10.6667H10.6667V18.6667H8V10.6667Z" fill="currentColor"/></svg>
                        </label>
                    </div>
                    <ul class="task-dialog__subtasks">${subtasksHTML}</ul>
                </div>
                <div class="task-edit__field">
                    <p class="task-edit__label">Assigned to</p>
                    <div class="task-edit__contacts">${assignedHTML}</div>
                </div>
            </div>
        </div>
    </main>
    <footer class="task-dialog__footer task-edit__footer">
        <p class="task-edit__required-hint"><span class="task-form__required">*</span>This field is required</p>
        <button class="task-edit__save" data-action="save-task" data-id="${element.id}">
            Ok <img src="./assets/icons/check.svg" alt="">
        </button>
    </footer>
  `;
}

/**
 * Returns the active CSS class for a priority button.
 * @param {string} priority - The priority to check
 * @param {string} currentPriority - The currently active priority
 * @returns {string} "active" or empty string
 */
function getPriorityActiveClass(priority, currentPriority) {
  return currentPriority === priority ? "task-edit__priority-btn--active" : "";
}

/**
 * Returns the HTML for a single priority button.
 * @param {string} priority - The priority value (e.g. "urgent")
 * @param {string} currentPriority - The currently active priority
 * @returns {string} HTML string of the priority button
 */
export function getPriorityButtonTemplate(priority, currentPriority) {
  const active = getPriorityActiveClass(priority, currentPriority);
  return `<button class="task-edit__priority-btn ${active}" data-priority="${priority}" data-action="set-edit-priority">
    ${capitalize(priority)} <span><img class="task-edit__priority-img" src="./assets/icons/priority-${priority}.svg" alt="" /></span>
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
    <div class="dropdown__option" data-action="toggle-edit-contact" data-id="${id}">
      <span class="task-edit__option-avatar" style="background:${contact.avatarColor}">${getAvatarContent(contact)}</span>
      <span class="dropdown__label">${getDisplayName({ id, name: contact.name })}</span>
      <input type="checkbox" value="${id}" ${checked} style="margin-left:auto" aria-label="Assign ${contact.name}" />
    </div>`;
}

/**
 * Returns the HTML template for a contact badge.
 * @param {Object} contact - The contact object
 * @returns {string} HTML string of the contact badge
 */
export function getContactBadgeTemplate(contact) {
  return `<div class="task-edit__badge" style="background:${contact.avatarColor}">${getAvatarContent(contact)}</div>`;
}

/**
 * Returns the HTML template for the assigned contacts section in the edit dialog.
 * @param {string} optionsHTML - HTML string of the contact options
 * @param {string} badgesHTML - HTML string of the contact badges
 * @returns {string} HTML string of the assigned contacts edit section
 */
export function getAssignedContactsEditTemplate(optionsHTML, badgesHTML) {
  return `
    <div class="dropdown">
      <div class="dropdown__trigger" data-action="toggle-edit-dropdown">
        <span>Select contacts to assign</span>
        <img src="./assets/icons/arrow_drop_down.svg" class="dropdown__arrow" alt="">
      </div>
      <div class="dropdown__menu">
        <div class="dropdown__list">${optionsHTML}</div>
      </div>
    </div>
    <div class="task-edit__badges" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">${badgesHTML}</div>
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
    <li class="task-edit__subtask" data-task-id="${taskId}" data-index="${index}">
      <span class="subtask__text" data-action="edit-subtask-edit">${subtask.title}</span>
      <div class="subtask__item-actions">
        <button class="subtask__btn" type="button" data-action="edit-subtask-edit" aria-label="Edit subtask">
          <img class="subtask__btn-icon" src="./assets/icons/edit.svg" alt="">
        </button>
        <div class="subtask__divider"></div>
        <button class="subtask__btn" type="button" data-action="delete-subtask-edit" data-id="${taskId}" data-index="${index}" aria-label="Delete subtask">
          <img class="subtask__btn-icon" src="./assets/icons/delete.svg" alt="">
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
    <input class="subtask__edit-input" type="text" value="${currentText}">
    <div class="subtask__item-actions">
      <button class="subtask__btn" type="button" data-action="remove-subtask-edit" aria-label="Delete subtask">
        <img class="subtask__btn-icon" src="./assets/icons/delete.svg" alt="">
      </button>
      <div class="subtask__divider"></div>
      <button class="subtask__btn" type="button" data-action="confirm-subtask-edit" aria-label="Save subtask">
        <img class="subtask__btn-icon" src="./assets/icons/check-dark.svg" alt="">
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
        <button class="subtask__btn" data-action="remove-subtask" type="button">
            <img class="subtask__btn-icon" src="./assets/icons/delete.svg" alt="Delete">
        </button>
        <div class="subtask__divider"></div>
        <button class="subtask__btn" data-action="confirm-subtask" type="button">
            <img class="subtask__btn-icon" src="./assets/icons/check-dark.svg" alt="Confirm">
        </button>
    `;
}
