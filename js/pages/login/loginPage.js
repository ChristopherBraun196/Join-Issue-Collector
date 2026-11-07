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
import "./logoAnimation.js";

/**
 * Entry point for the login page.
 */
function init() {
  const section = document.getElementById("login-signup-section");
  switchToLogin();
  document.addEventListener("click", handleLoginPageClick);
  section.addEventListener("submit", handleFormSubmit);
  section.addEventListener("focusout", handleFieldBlur);
  section.addEventListener("input", handlePwdInput);
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
 * @param {SubmitEvent} event - The submit event
 */
function handleFormSubmit(event) {
  event.preventDefault();
  if (event.target.dataset.form === "login") handleLogin();
  if (event.target.dataset.form === "signup") handleSignup();
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
 * Shows or hides the password toggle button while typing.
 * @param {InputEvent} event - The input event
 */
function handlePwdInput(event) {
  if (event.target.matches("[data-pwd-input]")) togglePwdVisibilityBtn(event.target);
}

document.addEventListener("DOMContentLoaded", init);
