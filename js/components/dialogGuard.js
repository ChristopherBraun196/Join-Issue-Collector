/**
 * Prevents dialogs from closing via Escape, so unsaved changes are not lost by accident.
 */
function blockEscapeOnDialogs() {
  document.addEventListener(
    "cancel",
    (e) => {
      if (e.target.tagName === "DIALOG") e.preventDefault();
    },
    true,
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.querySelector("dialog[open]")) e.preventDefault();
  });
}

blockEscapeOnDialogs();
