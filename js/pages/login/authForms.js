import { getLoginTemplate, getSignupTemplate } from "../../templates/loginTemplates.js";

/**
 * Switches the login/signup section to the signup form.
 */
export function switchToSignup() {
  const loginSignupSection = document.getElementById("login-signup-section");
  const signupBtn = document.getElementById("signup");

  loginSignupSection.innerHTML = getSignupTemplate();
  signupBtn.classList.add("hidden");
  document.getElementById("signupResponsiv").classList.add("hidden");
  document.title = "Join | Sign up";
}

/**
 * Switches the login/signup section to the login form.
 */
export function switchToLogin() {
  const loginSignupSection = document.getElementById("login-signup-section");
  const signupBtn = document.getElementById("signup");

  loginSignupSection.innerHTML = getLoginTemplate();
  signupBtn.classList.remove("hidden");
  document.getElementById("signupResponsiv").classList.remove("hidden");
  document.title = "Join | Log in";
}
