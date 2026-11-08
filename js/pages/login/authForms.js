import { getLoginTemplate, getSignupTemplate } from "../../templates/loginTemplates.js";

/**
 * Switches the login/signup section to the signup form.
 */
export function switchToSignup() {
  const loginSignupSection = document.querySelector(".login__card");
  const signupBtn = document.querySelector(".login__signup");

  loginSignupSection.innerHTML = getSignupTemplate();
  signupBtn.classList.add("login__signup--hidden");
  document.querySelector(".login__signup-mobile").classList.add("login__signup-mobile--hidden");
  document.title = "Join | Sign up";
}

/**
 * Switches the login/signup section to the login form.
 */
export function switchToLogin() {
  const loginSignupSection = document.querySelector(".login__card");
  const signupBtn = document.querySelector(".login__signup");

  loginSignupSection.innerHTML = getLoginTemplate();
  signupBtn.classList.remove("login__signup--hidden");
  document.querySelector(".login__signup-mobile").classList.remove("login__signup-mobile--hidden");
  document.title = "Join | Log in";
}
