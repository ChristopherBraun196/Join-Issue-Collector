import "../../services/authGuard.js";
import { switchToLogin, switchToSignup } from "./authForms.js";
import {
  togglePwdVisibilityBtn,
  togglePwdVisibility,
  validateField,
  validatePasswordConfirm,
  handleLogin,
  handleSignup,
  guestLogin,
} from "./login.js";
import { initLogoAnimation } from "./logoAnimation.js";

/**
 * Entry point for the login page.
 */
function init() {
  initLogoAnimation();
  const section = document.querySelector(".login__card");
  switchToLogin();
  document.addEventListener("click", handleLoginPageClick);
  section.addEventListener("submit", handleFormSubmit);
  section.addEventListener("focusout", handleFieldBlur);
  section.addEventListener("input", handleFieldInput);
}

/**
 * Handles all clicks on the login page via event delegation.
 * @param {MouseEvent} event - The click event
 */
function handleLoginPageClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const { action } = target.dataset;
  if (action === "show-signup") switchToSignup();
  if (action === "show-login") switchToLogin();
  if (action === "guest-login") guestLogin();
  if (action === "toggle-pwd") togglePwdVisibility(target);
}

/**
 * Submits the login or signup form without reloading the page.
 * Disables the submit button while sending and enables it again only on failure.
 * @param {SubmitEvent} event - The submit event
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  const button = event.target.querySelector("button[type='submit']");
  button.disabled = true;
  const isLogin = event.target.dataset.form === "login";
  const success = isLogin ? await handleLogin() : await handleSignup();
  if (!success) button.disabled = false;
}

/**
 * Validates a field when it loses focus.
 * @param {FocusEvent} event - The focusout event
 */
function handleFieldBlur(event) {
  const input = event.target.closest("[data-validate]");
  if (!input) return;
  if (input.dataset.validate === "confirm") validatePasswordConfirm(input);
  else validateField(input, input.dataset.validate);
}

/**
 * Handles typing in the form: toggles the password button and
 * re-validates a field that currently shows an error.
 * @param {InputEvent} event - The input event
 */
function handleFieldInput(event) {
  if (event.target.matches("[data-pwd-input]")) togglePwdVisibilityBtn(event.target);
  if (event.target.parentElement.classList.contains("login__input--invalid")) handleFieldBlur(event);
}

document.addEventListener("DOMContentLoaded", init);
