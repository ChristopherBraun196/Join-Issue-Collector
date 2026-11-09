/**
 * Returns the HTML template for the add task dialog.
 * @param {string} status - The initial status for the new task
 * @returns {string} HTML string of the add task dialog
 */
export function getAddTaskDialogTemplate(status) {
  return `
    <section class="add-task add-task--dialog">
      <header class="add-task__dialog-header">
        <h1>Add Task</h1>
        <button class="add-task__close" data-action="close-dialog"><img src="../assets/icons/close.svg"></button>
      </header>
      <form class="task-form" data-status="${status}" id="add-task-form" novalidate>
          <div class="task-form__column">
              <div class="task-form__field">
                  <label for="title">Title<span class="task-form__required">*</span></label>
                  <input type="text" class="task-form__input" name="title" placeholder="Enter a title" required data-error-msg="Please enter a title" autofocus />
                  <span class="task-form__error"></span>
              </div>
              <div class="task-form__field">
                  <label for="description">Description</label>
                  <textarea class="task-form__input" name="description" id="description" cols="30" rows="5"></textarea>
              </div>
              <div class="task-form__field">
                  <label for="due-date">Due Date<span class="task-form__required">*</span></label>
                  <input type="date" class="task-form__input" id="due-date" name="due-date" required data-validate-date data-error-msg="Please pick a due date" />
                  <span class="task-form__error"></span>
              </div>
          </div>
          <div class="task-form__column task-form__column--right">
              <div class="task-form__field">
                  <label for="priority">Priority</label>
                  <div class="task-form__priority">
                      <button class="task-form__priority-btn task-form__priority-btn--urgent" data-action="set-priority" type="button">Urgent <span class="task-form__priority-icon"><img class="task-form__priority-img" src="./assets/icons/priority-urgent.svg" alt="Urgent priority icon"></span></button>
                      <button class="task-form__priority-btn task-form__priority-btn--medium task-form__priority-btn--active" data-action="set-priority" type="button">Medium<span class="task-form__priority-icon"><img class="task-form__priority-img" src="./assets/icons/priority-medium.svg" alt="Medium priority icon"></span></button>
                      <button class="task-form__priority-btn task-form__priority-btn--low" data-action="set-priority" type="button">Low<span class="task-form__priority-icon"><img class="task-form__priority-img" src="./assets/icons/priority-low.svg" alt="Low priority icon"></span></button>
                  </div>
              </div>
              <div class="task-form__field">
                  <label>Assigned to</label>
                  <div class="dropdown dropdown--assigned">
                      <div class="dropdown__trigger" data-action="toggle-dropdown" data-dropdown="assigned">
                          <span class="dropdown__placeholder">Select contacts to assign</span>
                          <img src="./assets/icons/arrow_drop_down.svg" class="dropdown__arrow">
                      </div>
                      <div class="dropdown__menu">
                          <div class="dropdown__list">
                          </div>
                      </div>
                  </div>
                  <div class="task-form__badges"></div>
              </div>
              <div class="task-form__field">
                  <label>Category<span class="task-form__required">*</span></label>
                  <div class="dropdown dropdown--category">
                      <input type="hidden" class="task-form__input" name="category" required data-error-msg="Please select a category" />
                      <span class="task-form__error"></span>
                      <div class="dropdown__trigger" data-action="toggle-dropdown" data-dropdown="category">
                          <span class="dropdown__placeholder">Select task category</span>
                          <img src="./assets/icons/arrow_drop_down.svg" class="dropdown__arrow">
                      </div>
                      <div class="dropdown__menu">
                          <div class="dropdown__list">
                              <div class="dropdown__option" data-action="select-category" data-value="technical-task">
                                  <span class="dropdown__label">Technical Task</span>
                              </div>
                              <div class="dropdown__option" data-action="select-category" data-value="user-story">
                                  <span class="dropdown__label">User Story</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="task-form__field">
                  <label>Subtasks</label>
                  <div class="subtask__input-wrap">
                      <input 
                          type="text" 
                          class="subtask__input"
                          placeholder="Add new Subtask"
                      />
                      <div class="subtask__actions">
                          <div class="subtask__confirm">
                              <button class="subtask__btn" data-action="clear-subtask" type="button">
                                  <img class="subtask__btn-icon" src="./assets/icons/close.svg" alt="Cancel">
                              </button>
                              <div class="subtask__divider"></div>
                              <button class="subtask__btn" data-action="add-subtask" type="button">
                                  <img class="subtask__btn-icon" src="./assets/icons/check-dark.svg" alt="Confirm">
                              </button>
                          </div>
                      </div>
                  </div>
                  <ul class="subtask__list"></ul>
              </div>
          </div>
      </form>
      <footer class="task-form__footer">
          <p><span class="task-form__required">*</span> This field is required</p>
          <div class="task-form__buttons">
              <button class="task-form__btn task-form__btn--clear" type="button" data-action="clear-form">Clear <img class="task-form__btn-icon" src="./assets/icons/close.svg" alt="Cross icon"></button>
              <button class="primary-btn task-form__btn task-form__btn--create" form="add-task-form" type="submit">Create Task <img class="task-form__btn-icon" src="./assets/icons/check.svg" alt="Check icon"></button>
          </div>
      </footer>
    </section>
  `;
}
