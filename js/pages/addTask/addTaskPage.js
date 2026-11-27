import { init as initLayout } from "../../components/layout.js";
import { initTaskForm, renderContacts } from "../../components/taskForm.js";

/**
 * Entry point for the add task page.
 */
function init() {
  initLayout("addtask");
  initTaskForm(document.querySelector(".add-task"));
  const status = new URLSearchParams(location.search).get("status");
  if (status) document.querySelector(".task-form").dataset.status = status;
  renderContacts();
}

document.addEventListener("DOMContentLoaded", init);
