import { getInitials } from "../utils/format.js";
import { getSidebarTemplate, getSidebarGuestTemplate, getTopbarTemplate } from "../templates/layoutTemplates.js";

/**
 * Initializes the page by generating the topbar and loading the sidebar.
 * @param {string} site - The current page identifier
 */
export function init(site, withSidebar = true) {
  generateTopbar();
  if (withSidebar) loadSidebar(site);
}

/**
 * Creates and appends the topbar element to the body.
 */
function generateTopbar() {
  let body = document.querySelector("body");
  let header = document.createElement("header");
  header.id = "topbar";
  body.appendChild(header);
  setTopbar();
}

/**
 * Renders the topbar template into the topbar element.
 */
function setTopbar() {
  const topbar = document.getElementById("topbar");
  topbar.innerHTML = getTopbarTemplate();
}

/**
 * Loads the sidebar with the active navigation link for the given page.
 * @param {string} page - The current page identifier (e.g. "summary", "board")
 */
export function loadSidebar(page) {
  const sidebar = document.getElementById("sidebar");
  const map = {
    summary: ["active", "", "", "", "", ""],
    addtask: ["", "active", "", "", "", ""],
    board: ["", "", "active", "", "", ""],
    contact: ["", "", "", "active", "", ""],
    privacy: ["", "", "", "", "active", ""],
    legal: ["", "", "", "", "", "active"],
  };
  const args = map[page] || ["", "", "", "", "", ""];
  sidebar.innerHTML = getSidebarTemplate(...args);
}

/**
 * Replaces the sidebar with a guest-only version showing just the login link
 * and privacy/legal links. Called by authGuard for unauthenticated users on public pages.
 */
export function switchToGuestSidebar() {
  const sidebar = document.getElementById("sidebar");
  const path = window.location.pathname;
  const privacy = path.includes("privacy") ? "active" : "";
  const legal = path.includes("legal") ? "active" : "";
  sidebar.classList.add("guest-sidebar");
  sidebar.innerHTML = getSidebarGuestTemplate(privacy, legal);
}

/**
 * Renders the user menu with the current user's initials and avatar color.
 */
export function renderUserMenue() {
  const user = window.currentUser;
  const um = document.getElementById("user-menue");
  if (!um) return;

  if (!user) um.innerText = "G";
  else {
    const initials = getInitials(user.name);
    um.style.backgroundColor = user.avatarColor;
    um.innerText = initials;
  }
  um.classList.add("show");
}

/**
 * Toggles the visibility of the user menu dropdown.
 */
export function toggleUserMenue(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("user-menue-dropdown");
  dropdown.classList.toggle("show");
}

document.addEventListener("click", function () {
  const dropdown = document.getElementById("user-menue-dropdown");
  if (dropdown) dropdown.classList.remove("show");
});

window.init = init;
window.loadSidebar = loadSidebar;
window.switchToGuestSidebar = switchToGuestSidebar;
window.renderUserMenue = renderUserMenue;
window.toggleUserMenue = toggleUserMenue;
