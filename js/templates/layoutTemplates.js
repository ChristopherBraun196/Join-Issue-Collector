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
        <img src="./assets/img/logo-light.svg" class="logo sidebar_logo" />
        <nav>
            <a class="nav-link ${summary}" id="summary-link" href="./summary.html">
                <img src="./assets/icons/summary_icon.svg" class="nav-link-icon ${summary}" />
                Summary
            </a>

            <a class="nav-link ${addtask}" id="addtask-link" href="./addtask.html">
                <img src="./assets/icons/addtask_icon.svg" class="nav-link-icon ${addtask}" />
                Add Task
            </a>

            <a class="nav-link ${board}" id="board-link" href="./board.html">
                <img src="./assets/icons/board_icon.svg" class="nav-link-icon ${board}" />
                Board
            </a>

            <a class="nav-link ${contact}" href="./contacts.html">
                <img src="./assets/icons/contacts_icon.svg" class="nav-link-icon ${contact}" />
                Contacts
            </a>
        </nav>

        <div class="privacy">
            <a class="nav-link ${privacy}" href="privacy.html">Privacy Policy</a>
            <a class="nav-link ${legal}" href="legal.html">Legal notice</a>
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
        <img src="./assets/img/logo-light.svg" class="logo sidebar_logo" />
        <nav>
            <a class="nav-link" href="./index.html">
                <img src="./assets/icons/login.svg" class="nav-link-icon" />
                Log In
            </a>
        </nav>
        <div class="privacy">
            <a class="nav-link ${privacy}" href="privacy.html">Privacy Policy</a>
            <a class="nav-link ${legal}" href="legal.html">Legal notice</a>
        </div>
    `;
}

/**
 * Returns the HTML template for the topbar.
 * @returns {string} HTML string of the topbar
 */
export function getTopbarTemplate() {
  return `
  <div id="topbar-content">
    <p id="slogan">Kanban Project Management Tool</p>
    <img src="./assets/img/logo-dark.svg" class="topbar_logo">

    <div class="right-topbar-side">
          <button id="help">
              <a href="help.html"><img src="./assets/icons/help.svg" /></a>
          </button>
          <div id="user-menue" data-action="toggle-user-menu">
          </div>
          <div id="user-menue-dropdown">
            <a href="./legal.html">Legal Notice</a>
            <a href="./privacy.html">Privacy Policy</a>
            <a href="#" data-action="logout">Log Out</a>
          </div>
    </div>
  </div>
  `;
}
