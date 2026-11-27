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
        <img src="./assets/img/logo-light.svg" class="sidebar__logo" alt="Join logo" />
        <nav class="sidebar__nav">
            <a class="sidebar__link ${summary}" href="./summary.html">
                <img src="./assets/icons/summary_icon.svg" class="sidebar__icon" alt="" />
                Summary
            </a>

            <a class="sidebar__link ${addtask}" href="./addtask.html">
                <img src="./assets/icons/addtask_icon.svg" class="sidebar__icon" alt="" />
                Add Task
            </a>

            <a class="sidebar__link ${board}" href="./board.html">
                <img src="./assets/icons/board_icon.svg" class="sidebar__icon" alt="" />
                Board
            </a>

            <a class="sidebar__link ${contact}" href="./contacts.html">
                <img src="./assets/icons/contacts_icon.svg" class="sidebar__icon" alt="" />
                Contacts
            </a>
        </nav>

        <nav class="sidebar__legal" aria-label="Legal">
            <a class="sidebar__link ${privacy}" href="privacy.html">Privacy Policy</a>
            <a class="sidebar__link ${legal}" href="legal.html">Legal notice</a>
        </nav>

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
        <img src="./assets/img/logo-light.svg" class="sidebar__logo" alt="Join logo" />
        <nav class="sidebar__nav">
            <a class="sidebar__link" href="./welcome.html">
                <img src="./assets/icons/login.svg" class="sidebar__icon" alt="" />
                Log In
            </a>
        </nav>
        <nav class="sidebar__legal" aria-label="Legal">
            <a class="sidebar__link ${privacy}" href="privacy.html">Privacy Policy</a>
            <a class="sidebar__link ${legal}" href="legal.html">Legal notice</a>
        </nav>
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
    <img src="./assets/img/logo-dark.svg" class="topbar__logo" alt="Join logo">

    <div class="topbar__actions">
          <a class="topbar__help" href="help.html" aria-label="Help"><img src="./assets/icons/help.svg" alt="" /></a>
          <button class="topbar__user" type="button" data-action="toggle-user-menu" aria-label="Open user menu" aria-haspopup="true"></button>
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
    <div class="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contactDialogTitle">
      <div class="contact-dialog__box">
        <div class="contact-dialog__left">
          <img src="./assets/img/logo-light.png" class="contact-dialog__logo" alt="" />
          <h1 class="contact-dialog__title" id="contactDialogTitle">Add contact</h1>
          <p class="contact-dialog__text">Tasks are better with a team!</p>
          <div class="contact-dialog__underline"></div>
        </div>
        <div class="contact-dialog__right">
          <button class="contact-dialog__close" data-action="close-dialog" aria-label="Close">&#x2715;</button>

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
                  aria-label="Name"
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
                  aria-label="Email"
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
                  aria-label="Phone"
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

/**
 * Returns the HTML of the image viewer dialog used for task attachments.
 * @returns {string} HTML string of the image viewer
 */
export function getImageViewerTemplate() {
  return `
    <dialog class="viewer" aria-label="Image viewer" autofocus>
      <header class="viewer__bar">
        <p class="viewer__info"><span class="viewer__name"></span><span class="viewer__size"></span></p>
        <div class="viewer__actions">
          <a class="viewer__btn viewer__download" href="" download aria-label="Download image">
            <svg class="viewer__icon" viewBox="0 -960 960 960" aria-hidden="true">
              <path
                d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"
                fill="currentColor"
              />
            </svg>
          </a>
          <button class="viewer__btn" type="button" data-action="close-viewer" aria-label="Close">
            <svg class="viewer__icon" viewBox="0 -960 960 960" aria-hidden="true">
              <path
                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </header>
      <figure class="viewer__stage">
        <img class="viewer__image" src="" alt="" />
      </figure>
      <nav class="viewer__controls" aria-label="Image controls">
        <button
          class="viewer__btn viewer__arrow viewer__arrow--prev"
          type="button"
          data-action="previous-image"
          aria-label="Previous image"
        >
          <svg class="viewer__icon" viewBox="0 -960 960 960" aria-hidden="true">
            <path d="m313-440 224 224-57 57-320-320 320-320 57 57-224 224h487v80H313Z" fill="currentColor" />
          </svg>
        </button>
        <div class="viewer__zoom">
          <button class="viewer__btn" type="button" data-action="zoom-out" aria-label="Zoom out">
            <svg class="viewer__icon" viewBox="0 -960 960 960" aria-hidden="true">
              <path
                d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400ZM280-540v-80h200v80H280Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button class="viewer__btn" type="button" data-action="zoom-in" aria-label="Zoom in">
            <svg class="viewer__icon" viewBox="0 -960 960 960" aria-hidden="true">
              <path
                d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Zm-40-60v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <button
          class="viewer__btn viewer__arrow viewer__arrow--next"
          type="button"
          data-action="next-image"
          aria-label="Next image"
        >
          <svg class="viewer__icon" viewBox="0 -960 960 960" aria-hidden="true">
            <path d="M647-440H160v-80h487L423-744l57-57 320 320-320 320-57-57 224-224Z" fill="currentColor" />
          </svg>
        </button>
      </nav>
    </dialog>
  `;
}
