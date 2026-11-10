import { init as initLayout } from "../../components/layout.js";

/**
 * Entry point for the help, legal and privacy pages.
 */
function init() {
  const page = location.pathname.split("/").pop().replace(".html", "");
  initLayout(page, false);
}

document.addEventListener("DOMContentLoaded", init);
