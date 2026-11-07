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
