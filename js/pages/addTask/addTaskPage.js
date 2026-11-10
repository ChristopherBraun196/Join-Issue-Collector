import { init as initLayout } from "../../components/layout.js";
import { initTaskForm, renderContacts } from "../../components/taskForm.js";

/**
 * Entry point for the add task page.
 */
function init() {
  initLayout("addtask");
  initTaskForm(document.querySelector(".add-task"));
  renderContacts();
}

document.addEventListener("DOMContentLoaded", init);
