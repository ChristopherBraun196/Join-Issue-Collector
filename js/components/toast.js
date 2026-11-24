/**
 * Displays a temporary message in the message box for 5 seconds, above open dialogs.
 * @param {string} message - The message to display
 */
export function showMessage(message) {
  const messageElement = document.querySelector(".toast");
  bringToFront(messageElement);
  messageElement.classList.add("toast--visible");
  const msgNode = document.createElement("p");
  msgNode.textContent = message.toString();
  messageElement.appendChild(msgNode);
  setTimeout(() => removeMessage(messageElement, msgNode), 5000);
}

/**
 * Shows the message box as popover on top of everything, also above modal dialogs.
 * @param {HTMLElement} messageElement - The message box
 */
function bringToFront(messageElement) {
  if (messageElement.matches(":popover-open")) messageElement.hidePopover();
  messageElement.showPopover();
}

/**
 * Removes one message and hides the message box when it is empty.
 * @param {HTMLElement} messageElement - The message box
 * @param {HTMLElement} msgNode - The message to remove
 */
function removeMessage(messageElement, msgNode) {
  msgNode.remove();
  if (messageElement.children.length > 0) return;
  messageElement.classList.remove("toast--visible");
  messageElement.hidePopover();
}
