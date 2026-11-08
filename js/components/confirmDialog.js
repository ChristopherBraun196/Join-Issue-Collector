/**
 * Opens the confirm dialog with the given question and waits for the answer.
 * @param {string} message - The question to show
 * @returns {Promise<boolean>} True if the user confirmed, false otherwise
 */
export function confirmAction(message) {
  const dialog = document.querySelector(".confirm-dialog");
  dialog.querySelector(".confirm-dialog__text").textContent = message;
  dialog.returnValue = "false";
  dialog.addEventListener("click", handleConfirmClick);
  dialog.showModal();
  return new Promise((resolve) => {
    dialog.addEventListener(
      "close",
      () => {
        dialog.removeEventListener("click", handleConfirmClick);
        resolve(dialog.returnValue === "true");
      },
      { once: true },
    );
  });
}

/**
 * Closes the confirm dialog with the answer of the clicked button.
 * @param {MouseEvent} event - The click event inside the dialog
 */
function handleConfirmClick(event) {
  const button = event.target.closest("[data-confirm]");
  if (button) event.currentTarget.close(button.dataset.confirm);
}
