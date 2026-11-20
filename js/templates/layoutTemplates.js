/**
 * Returns the HTML template for the sidebar navigation.
 * @param {string} summary - Active class for summary link
 * @param {string} addtask - Active class for add task link
 * @param {string} board - Active class for board link
 * @param {string} contact - Active class for contacts link
 * @param {string} privacy - Active class for privacy link
 * @param {string} legal - Active class for legal link
 * @returns {string} HTML string of the sidebar
 */
export function getSidebarTemplate(summary, addtask, board, contact, privacy, legal) {
  return `
        <img src="./assets/img/logo-light.svg" class="sidebar__logo" />
        <nav class="sidebar__nav">
            <a class="sidebar__link ${summary}" href="./summary.html">
                <img src="./assets/icons/summary_icon.svg" class="sidebar__icon" />
                Summary
            </a>

            <a class="sidebar__link ${addtask}" href="./addtask.html">
                <img src="./assets/icons/addtask_icon.svg" class="sidebar__icon" />
                Add Task
            </a>

            <a class="sidebar__link ${board}" href="./board.html">
                <img src="./assets/icons/board_icon.svg" class="sidebar__icon" />
                Board
            </a>

            <a class="sidebar__link ${contact}" href="./contacts.html">
                <img src="./assets/icons/contacts_icon.svg" class="sidebar__icon" />
                Contacts
            </a>
        </nav>

        <div class="sidebar__legal">
            <a class="sidebar__link ${privacy}" href="privacy.html">Privacy Policy</a>
            <a class="sidebar__link ${legal}" href="legal.html">Legal notice</a>
        </div>

    `;
}

/**
 * Returns the HTML template for the sidebar in guest (unauthenticated) mode.
 * Shows only the logo, a login link, and privacy/legal links.
 * @param {string} privacy - Active class for privacy link
 * @param {string} legal - Active class for legal link
 * @returns {string} HTML string of the guest sidebar
 */
export function getSidebarGuestTemplate(privacy, legal) {
  return `
        <img src="./assets/img/logo-light.svg" class="sidebar__logo" />
        <nav class="sidebar__nav">
            <a class="sidebar__link" href="./welcome.html">
                <img src="./assets/icons/login.svg" class="sidebar__icon" />
                Log In
            </a>
        </nav>
        <div class="sidebar__legal">
            <a class="sidebar__link ${privacy}" href="privacy.html">Privacy Policy</a>
            <a class="sidebar__link ${legal}" href="legal.html">Legal notice</a>
        </div>
    `;
}

/**
 * Returns the HTML template for the topbar.
 * @returns {string} HTML string of the topbar
 */
export function getTopbarTemplate() {
  return `
  <div class="topbar__content">
    <p class="topbar__slogan">Kanban Project Management Tool</p>
    <img src="./assets/img/logo-dark.svg" class="topbar__logo">

    <div class="topbar__actions">
          <button class="topbar__help">
              <a href="help.html"><img src="./assets/icons/help.svg" /></a>
          </button>
          <div class="topbar__user" data-action="toggle-user-menu">
          </div>
          <div class="topbar__dropdown">
            <a href="#" class="topbar__dropdown-link topbar__dropdown-link--account" data-action="open-account">Account</a>
            <a href="./legal.html" class="topbar__dropdown-link">Legal Notice</a>
            <a href="./privacy.html" class="topbar__dropdown-link">Privacy Policy</a>
            <a href="#" class="topbar__dropdown-link" data-action="logout">Log out</a>
          </div>
    </div>
  </div>
  `;
}

/**
 * Returns the HTML of the contact dialog (add/edit contacts and own account) and of the delete-account confirm dialog.
 * @returns {string} HTML string of the contact dialog
 */
export function getContactDialogTemplate() {
  return `
    <div class="contact-dialog">
      <div class="contact-dialog__box">
        <div class="contact-dialog__left">
          <img src="./assets/img/logo-light.png" class="contact-dialog__logo" />
          <h1 class="contact-dialog__title">Add contact</h1>
          <p class="contact-dialog__text">Tasks are better with a team!</p>
          <div class="contact-dialog__underline"></div>
        </div>
        <div class="contact-dialog__right">
          <button class="contact-dialog__close" data-action="close-dialog">&#x2715;</button>

          <div class="contact-dialog__content">
            <div class="contact-dialog__photo">
              <img
                src="./assets/icons/contact_pb.svg"
                class="contact-dialog__avatar contact-dialog__avatar--icon"
                alt=""
              />
              <div class="contact-dialog__avatar contact-dialog__avatar--initials contact-dialog__avatar--hidden"></div>
              <label class="contact-dialog__photo-btn contact-dialog__photo-btn--upload" aria-label="Upload photo">
                <img class="contact-dialog__photo-icon" src="./assets/icons/camera.svg" alt="" />
                <input class="contact-dialog__photo-input" type="file" accept="image/jpeg, image/png" />
              </label>
              <button
                class="contact-dialog__photo-btn contact-dialog__photo-btn--remove"
                type="button"
                data-action="remove-photo"
                aria-label="Remove photo"
                hidden
              >
                <img class="contact-dialog__photo-icon" src="./assets/icons/delete.svg" alt="" />
              </button>
            </div>

            <div class="contact-dialog__fields">
              <div class="contact-dialog__field">
                <input
                  class="contact-dialog__input contact-dialog__input--name"
                  type="text"
                  placeholder="Name"
                  data-field="name"
                />
                <img class="contact-dialog__icon" src="./assets/icons/person.svg" alt="" />
                <span class="contact-dialog__error contact-dialog__error--name"></span>
              </div>

              <div class="contact-dialog__field">
                <input
                  class="contact-dialog__input contact-dialog__input--email"
                  type="email"
                  placeholder="Email"
                  data-field="email"
                />
                <img class="contact-dialog__icon" src="./assets/icons/mail.svg" alt="" />
                <span class="contact-dialog__error contact-dialog__error--email"></span>
              </div>

              <div class="contact-dialog__field">
                <input
                  class="contact-dialog__input contact-dialog__input--phone"
                  type="tel"
                  placeholder="Phone"
                  data-field="phone"
                />
                <img class="contact-dialog__icon" src="./assets/icons/call.svg" alt="" />
                <span class="contact-dialog__error contact-dialog__error--phone"></span>
              </div>

              <div class="contact-dialog__actions">
                <button class="contact-dialog__cancel" data-action="close-dialog">Cancel &#x2715;</button>
                <button class="contact-dialog__submit" data-action="submit">Create contact &#x2713;</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <dialog class="confirm-dialog confirm-dialog--account">
      <button class="confirm-dialog__close" type="button" data-confirm="false" aria-label="Close">&#x2715;</button>
      <svg class="confirm-dialog__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="currentColor" />
        <path d="M12 6v8" stroke="white" stroke-width="2.5" stroke-linecap="round" />
        <circle cx="12" cy="18" r="1.5" fill="white" />
      </svg>
      <p class="confirm-dialog__text" tabindex="-1" autofocus></p>
      <div class="confirm-dialog__actions">
        <button class="secondary-btn confirm-dialog__btn" type="button" data-confirm="true">Yes</button>
        <button class="primary-btn confirm-dialog__btn" type="button" data-confirm="false">No</button>
      </div>
    </dialog>
  `;
}
