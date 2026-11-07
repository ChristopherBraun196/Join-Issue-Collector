/**
 * Returns the HTML template for the add task dialog.
 * @param {string} status - The initial status for the new task
 * @returns {string} HTML string of the add task dialog
 */
export function getAddTaskDialogTemplate(status) {
  return `
    <section class="add-task" id="add-task-dialog-content">
      <header id="add-task-dialog-header">
        <h1>Add Task</h2>
        <button data-action="close-dialog" id="close-dialog-btn"><img src="../assets/icons/close.svg"></button>
      </header>
      <form class="add-task-form" data-status="${status}" id="add-task-form" novalidate>
          <div id="left-side-form">
              <div id="task-title">
                  <label for="title">Title<span class="required">*</span></label>
                  <input type="text" name="title" placeholder="Enter a title" required data-error-msg="Please enter a title" autofocus />
                  <span class="field-error-msg"></span>
              </div>
              <div id="task-description">
                  <label for="description">Description</label>
                  <textarea name="description" id="description" cols="30" rows="5"></textarea>
              </div>
              <div id="task-due-date">
                  <label for="due-date">Due Date<span class="required">*</span></label>
                  <input type="date" id="due-date" name="due-date" required data-validate-date />
                  <span class="field-error-msg"></span>
              </div>
          </div>
          <div id="right-side-task">
              <div id="task-priority">
                  <label for="priority">Priority</label>
                  <div id="task-priority-btns">
                      <button class="priority-btn urgent" data-action="set-priority" type="button">Urgent <span><img src="./assets/icons/priority-urgent.svg" alt="Urgent priority icon"></span></button>
                      <button class="priority-btn medium set" data-action="set-priority" type="button">Medium<span><img src="./assets/icons/priority-medium.svg" alt="Medium priority icon"></span></button>
                      <button class="priority-btn low" data-action="set-priority" type="button">Low<span><img src="./assets/icons/priority-low.svg" alt="Low priority icon"></span></button>
                  </div>
              </div>
              <div id="task-assigned-to">
                  <label>Assigned to</label>
                  <div class="custom-select-wrapper" id="assigned-wrapper">
                      <div class="custom-select-trigger" data-action="toggle-dropdown" data-dropdown="assigned">
                          <span id="assigned-placeholder">Select contacts to assign</span>
                          <img src="./assets/icons/arrow_drop_down.svg" class="select-arrow">
                      </div>
                      <div class="custom-select-dropdown" id="assigned-dropdown">
                          <div id="custom-select-dropdown-inner">
                          </div>
                      </div>
                  </div>
                  <div id="assigned-badges"></div>
              </div>
              <div id="task-category">
                  <label>Category<span class="required">*</span></label>
                  <div class="custom-select-wrapper" id="category-wrapper">
                      <input type="hidden" name="category" required data-error-msg="Please select a category" />
                      <span class="field-error-msg"></span>
                      <div class="custom-select-trigger" data-action="toggle-dropdown" data-dropdown="category">
                          <span id="category-placeholder">Select task category</span>
                          <img src="./assets/icons/arrow_drop_down.svg" class="select-arrow">
                      </div>
                      <div class="custom-select-dropdown" id="category-dropdown">
                          <div class="custom-select-dropdown-inner">
                              <div class="custom-option" data-action="select-category" data-value="technical-task">
                                  <span>Technical Task</span>
                              </div>
                              <div class="custom-option" data-action="select-category" data-value="user-story">
                                  <span>User Story</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div id="task-subtasks">
                  <label>Subtasks</label>
                  <div class="subtask-input-wrapper" id="subtask-wrapper">
                      <input 
                          type="text" 
                          id="subtask-input"
                          placeholder="Add new Subtask"
                      />
                      <div class="subtask-actions" id="subtask-actions">
                          <div class="subtask-confirm-btns" id="subtask-confirm-btns">
                              <button class="subtask-icon-btn" data-action="clear-subtask" type="button">
                                  <img src="./assets/icons/close.svg" alt="Cancel">
                              </button>
                              <div class="subtask-divider"></div>
                              <button class="subtask-icon-btn" data-action="add-subtask" type="button">
                                  <img src="./assets/icons/check-dark.svg" alt="Confirm">
                              </button>
                          </div>
                      </div>
                  </div>
                  <ul id="subtask-list"></ul>
              </div>
          </div>
      </form>
      <footer id="add-task-form-footer">
          <p><span class="required">*</span> This field is required</p>
          <div id="task-btns">
              <button id="clear-task-form" type="button" data-action="clear-form">Clear <img src="./assets/icons/close.svg" alt="Cross icon"></button>
              <button id="create-task" class="primary-btn" form="add-task-form" type="submit">Create Task <img src="./assets/icons/check.svg" alt="Check icon"></button>
          </div>
      </footer>
    </section>
  `;
}
