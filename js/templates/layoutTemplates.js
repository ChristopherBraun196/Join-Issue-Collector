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
            <a href="./legal.html" class="topbar__dropdown-link">Legal Notice</a>
            <a href="./privacy.html" class="topbar__dropdown-link">Privacy Policy</a>
            <a href="#" class="topbar__dropdown-link" data-action="logout">Log Out</a>
          </div>
    </div>
  </div>
  `;
}
