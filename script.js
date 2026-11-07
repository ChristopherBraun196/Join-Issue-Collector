const loginSignupSection = document.getElementById("login-signup-section");
const signupBtn = document.getElementById("signup");
const sidebar = document.getElementById("sidebar");
const animatedImgWrapper = document.getElementById("animated-img-wrapper");
const navLogo = document.getElementById("navbar-logo");

/**
 * Measures the navbar logo position and sets CSS variables for the intro animation target.
 * Temporarily makes the hidden logo visible to read its coordinates via getBoundingClientRect.
 */
function setLogoAnimationTarget() {
  const logo = document.getElementById("navbar-logo");
  if (!logo) return;

  logo.style.visibility = "hidden";
  logo.classList.remove("hide");

  const rect = logo.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const translateX = centerX - window.innerWidth / 2;
  const translateY = centerY - window.innerHeight / 2;

  document.documentElement.style.setProperty("--logo-x", `${translateX}px`);
  document.documentElement.style.setProperty("--logo-y", `${translateY}px`);

  // Zielgröße des echten Logos übernehmen
  document.documentElement.style.setProperty("--logo-w", `${rect.width}px`);
  document.documentElement.style.setProperty("--logo-h", `${rect.height}px`);

  logo.classList.add("hide");
  logo.style.visibility = "";
}

setLogoAnimationTarget();

/**
 * Registers the animation end event on the logo wrapper element.
 * Hides the wrapper and reveals the nav logo after the animation completes.
 */
function initLogoAnimation() {
  if (animatedImgWrapper) {
    animatedImgWrapper.addEventListener("animationend", (e) => {
      if (e.target === animatedImgWrapper) {
        animatedImgWrapper.style.display = "none";
        navLogo.classList.remove("hide");
      }
    });
  }
}

initLogoAnimation();

document.addEventListener(
  "cancel",
  (e) => {
    if (e.target.tagName === "DIALOG") e.preventDefault();
  },
  true,
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.querySelector("dialog[open]")) e.preventDefault();
});

/**
 * Initializes the page by generating the topbar and loading the sidebar.
 * @param {string} site - The current page identifier
 */
function init(site, withSidebar = true) {
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
 * Switches the login/signup section to the signup form.
 */
function switchToSignup() {
  loginSignupSection.innerHTML = getSignupTemplate();
  signupBtn.classList.add("hidden");
  document.getElementById("signupResponsiv").classList.add("hidden");
  document.title = "Join | Sign up";
}

/**
 * Switches the login/signup section to the login form.
 */
function switchToLogin() {
  loginSignupSection.innerHTML = getLoginTemplate();
  signupBtn.classList.remove("hidden");
  document.getElementById("signupResponsiv").classList.remove("hidden");
  document.title = "Join | Log in";
}

/**
 * Loads the sidebar with the active navigation link for the given page.
 * @param {string} page - The current page identifier (e.g. "summary", "board")
 */
function loadSidebar(page) {
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
function switchToGuestSidebar() {
  const path = window.location.pathname;
  const privacy = path.includes("privacy") ? "active" : "";
  const legal = path.includes("legal") ? "active" : "";
  sidebar.classList.add("guest-sidebar");
  sidebar.innerHTML = getSidebarGuestTemplate(privacy, legal);
}

/**
 * Renders the user menu with the current user's initials and avatar color.
 */
function renderUserMenue() {
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
function toggleUserMenue(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("user-menue-dropdown");
  dropdown.classList.toggle("show");
}

document.addEventListener("click", function () {
  const dropdown = document.getElementById("user-menue-dropdown");
  if (dropdown) dropdown.classList.remove("show");
});
