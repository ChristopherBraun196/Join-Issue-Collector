const loginSignupSection = document.getElementById("login-signup-section");
const signupBtn = document.getElementById("signup");

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
