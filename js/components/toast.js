/**
 * Displays a temporary message in the message box for 5 seconds.
 * @param {string} message - The message to display
 */
export function showMessage(message) {
  const messageElement = document.getElementById("message-box");
  messageElement.classList.add("visible");
  const msgNode = document.createElement("p");
  msgNode.textContent = message.toString();
  messageElement.appendChild(msgNode);
  setTimeout(() => {
    msgNode.remove();
    if (messageElement.children.length === 0) {
      messageElement.classList.remove("visible");
    }
  }, 5000);
}
