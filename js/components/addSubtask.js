import { getSubtaskEditActionsTemplate } from "../templates/boardEditTemplates.js";

/**
 * Runs the subtask action that belongs to the clicked data-action.
 * @param {string} action - The data-action value of the clicked element
 * @param {HTMLElement} target - The clicked element with the data-action
 */
export function handleSubtaskAction(action, target) {
  if (action === "clear-subtask") clearSubtaskInput();
  if (action === "add-subtask") addSubtask();
  if (action === "edit-subtask") editSubtask(target.closest("li").querySelector(".subtask-text"));
  if (action === "remove-subtask") removeSubtask(target);
  if (action === "confirm-subtask") confirmEditSubtask(target);
}

/**
 * Sets the focus to the subtask input field.
 */
function focusSubtaskInput() {
  document.getElementById("subtask-input").focus();
}

/**
 * Clears the subtak input field
 */
function clearSubtaskInput() {
  document.getElementById("subtask-input").value = "";
  onSubtaskInput();
}

/**
 * Handles keyboard input for the subtask field.
 * @param {KeyboardEvent} event - The keyboard event
 */
export function handleSubtaskKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addSubtask();
  }
  if (event.key === "Escape") clearSubtaskInput();
}

/**
 * Toggles the visibility of the subtask confirm buttons based on the input value.
 */
export function onSubtaskInput() {
  const input = document.getElementById("subtask-input");
  const confirmBtns = document.getElementById("subtask-confirm-btns");
  const hasText = input.value.trim().length > 0;
  confirmBtns.classList.toggle("visible", hasText);
}

/**
 * Adds a new subtask to the subtask list.
 */
function addSubtask() {
  const input = document.getElementById("subtask-input");
  const text = input.value.trim();
  if (!text) return;

  const list = document.getElementById("subtask-list");
  const li = createSubtaskItem(text);
  list.appendChild(li);
  clearSubtaskInput();
}

/**
 * Creates a subtask list item element with edit and delete buttons.
 * @param {string} text - The subtask title
 * @returns {HTMLElement} The created list item element
 */
function createSubtaskItem(text) {
  const li = document.createElement("li");
  li.innerHTML = `
        <span class="subtask-text" data-action="edit-subtask">${text}</span>
        <div class="subtask-item-actions">
            <button class="subtask-icon-btn" data-action="edit-subtask" type="button">
                <img src="./assets/icons/edit.svg" alt="Edit">
            </button>
            <div class="subtask-divider"></div>
            <button class="subtask-icon-btn" data-action="remove-subtask" type="button">
                <img src="./assets/icons/delete.svg" alt="Delete">
            </button>
        </div>
    `;
  return li;
}

/**
 * Switches a subtask list item into edit mode.
 * Replaces the text span with an input field and swaps the action buttons
 * to show delete and confirm options. Supports keyboard interaction.
 *
 * @param {HTMLElement} span - The subtask text span element that was clicked
 * @returns {void}
 */
function editSubtask(span) {
  const li = span.closest("li");
  const currentText = span.textContent;

  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.className = "subtask-edit-input";
  li.replaceChild(input, span);
  input.focus();
  input.select();

  const actions = li.querySelector(".subtask-item-actions");
  actions.innerHTML = getSubtaskEditActionsTemplate();

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") confirmEditSubtask(actions.querySelector('[alt="Confirm"]').closest("button"));
    if (e.key === "Escape") cancelEditSubtask(input, currentText);
  });
}

/**
 * Confirms the subtask edit and replaces the list item with the updated text.
 * @param {HTMLElement} btn - The confirm button that was clicked
 */
function confirmEditSubtask(btn) {
  const li = btn.closest("li");
  const input = li.querySelector(".subtask-edit-input");
  const newText = input.value.trim();
  if (!newText) {
    li.remove();
    return;
  }

  const newLi = createSubtaskItem(newText);
  li.replaceWith(newLi);
}

/**
 * Cancels the subtask edit and restores the original text.
 * @param {HTMLElement} input - The subtask input element
 * @param {string} originalText - The original subtask text to restore
 */
function cancelEditSubtask(input, originalText) {
  input.closest("li").replaceWith(createSubtaskItem(originalText));
}

/**
 * Removes the subtask list item of the clicked button.
 * @param {HTMLElement} btn - The delete button that was clicked
 */
function removeSubtask(btn) {
  btn.closest("li").remove();
}
