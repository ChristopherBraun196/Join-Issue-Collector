/**
 * Displays a temporary message in the message box for 5 seconds.
 * @param {string} message - The message to display
 */
export function showMessage(message) {
  const messageElement = document.querySelector(".toast");
  messageElement.classList.add("toast--visible");
  const msgNode = document.createElement("p");
  msgNode.textContent = message.toString();
  messageElement.appendChild(msgNode);
  setTimeout(() => {
    msgNode.remove();
    if (messageElement.children.length === 0) {
      messageElement.classList.remove("toast--visible");
    }
  }, 5000);
}
