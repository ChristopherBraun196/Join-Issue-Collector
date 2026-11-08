import { registerUser, signInUser, signInGuest } from "../../services/authService.js";
import { switchToLogin } from "./authForms.js";
import { showMessage } from "../../components/toast.js";
import { isValidEmail, isValidName, isValidPassword } from "../../utils/validators.js";

const SIGNUP_ERROR_MESSAGES = {
  "auth/email-already-in-use": { field: "email", text: "This email is already registered." },
  "auth/invalid-email": { field: "email", text: "Invalid email address." },
  "auth/weak-password": { field: "password", text: "Password too weak (min. 6 characters)." },
};

/**
 * Registers a new user with email and password and redirects to the summary page.
 * @param {string} name - The full name of the user
 * @param {string} email - The email address of the user
 * @param {string} password - The password for the new account
 * @returns {Promise<void>}
 */
async function signup(name, email, password) {
  try {
    await registerUser(name, email, password);
    showMessage("Signup successful!");
    setTimeout(() => {
      switchToLogin();
    }, 1000);
  } catch (error) {
    handleSignupError(error);
  }
}

/**
 * Shows an error message below a login/signup input and marks its wrapper as invalid.
 * @param {string} name - The name attribute of the input (also used for the error id)
 * @param {string} message - The error message to display
 */
function showInputError(name, message) {
  const input = document.querySelector(`#login-signup-form input[name='${name}']`);
  showFieldError(input.closest(".login__input"), document.querySelector(`#${name}-error`), message);
}

/**
 * Displays an error message at the relevant input field based on the Firebase signup error code.
 * @param {Error} error - The Firebase error object
 */
function handleSignupError(error) {
  const known = SIGNUP_ERROR_MESSAGES[error.code];
  if (known) showInputError(known.field, known.text);
  else showInputError("email", error.message);
}

/**
 * Displays an error message at the relevant input field based on the Firebase login error code.
 * @param {Error} error - The Firebase error object
 */
function handleLoginError(error) {
  if (error.code === "auth/too-many-requests") {
    showInputError("password", "Too many failed attempts. Please wait a moment.");
    return;
  }
  document.querySelector("#login-signup-form .login__input--email").classList.add("login__input--invalid");
  showInputError("password", "Wrong email address or password.");
}

/**
 * Signs in a user with email and password and redirects to the summary page.
 * @param {string} email - The email address of the user
 * @param {string} password - The user's password
 * @returns {Promise<void>}
 */
async function login(email, password) {
  try {
    await signInUser(email, password);
    showMessage("Login successful!");
    setTimeout(() => {
      window.location.href = "./summary.html";
    }, 2000);
  } catch (error) {
    handleLoginError(error);
  }
}

/**
 * Shows a field error message and highlights the input border.
 * @param {HTMLElement} inputWrapper - The parent div of the input
 * @param {HTMLElement} errorEl - The error span element
 * @param {string} message - The error message to display
 */
function showFieldError(inputWrapper, errorEl, message) {
  inputWrapper.classList.add("login__input--invalid");
  errorEl.textContent = message;
  errorEl.classList.add("login__error--visible");
}

/**
 * Clears a field error message and removes the invalid border.
 * @param {HTMLElement} inputWrapper - The parent div of the input
 * @param {HTMLElement} errorEl - The error span element
 */
function clearFieldError(inputWrapper, errorEl) {
  inputWrapper.classList.remove("login__input--invalid");
  errorEl.textContent = "";
  errorEl.classList.remove("login__error--visible");
}

/**
 * Shows or hides the password visibility toggle button based on input content.
 * @param {HTMLInputElement} input - The password input element
 */
export function togglePwdVisibilityBtn(input) {
  const wrapper = input.parentElement;
  const btn = wrapper.querySelector(".login__pwd-toggle");
  const lock = wrapper.querySelector(".login__lock");
  const hasValue = input.value.length > 0;
  if (btn) btn.classList.toggle("login__pwd-toggle--visible", hasValue);
  if (lock) lock.classList.toggle("login__lock--hidden", hasValue);
}

/**
 * Toggles the password input between plain text and password type.
 * @param {HTMLButtonElement} btn - The toggle button element
 */
export function togglePwdVisibility(btn) {
  const input = btn.parentElement.querySelector("input");
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  btn.classList.toggle("login__pwd-toggle--showing", isHidden);
}

/**
 * Validates a field on blur and shows an error if it is empty or not a valid email.
 * @param {HTMLInputElement} input - The input element
 * @param {string} errorId - The ID of the error span
 */
export function validateField(input, errorId) {
  const errorEl = document.getElementById(errorId);
  const message = getFieldErrorMessage(input);
  if (message) showFieldError(input.parentElement, errorEl, message);
  else clearFieldError(input.parentElement, errorEl);
}

/**
 * Returns the error message for a field or an empty string if the field is valid.
 * @param {HTMLInputElement} input - The input element to check
 * @returns {string} The error message or ""
 */
function getFieldErrorMessage(input) {
  const value = input.value.trim();
  const isSignup = input.form.dataset.form === "signup";
  if (!value) return "This field is required";
  if (input.type === "email" && !isValidEmail(value)) return "Not a valid email address";
  if (input.name === "fullname" && !isValidName(value)) return "Please enter first and last name";
  if (isSignup && input.name === "password" && !isValidPassword(input.value))
    return "Password too weak (min. 6 characters).";
  return "";
}

/**
 * Validates the confirm password field on blur.
 * @param {HTMLInputElement} input - The confirm password input element
 */
export function validatePasswordConfirm(input) {
  const errorEl = document.getElementById("password-confirm-error");
  const wrapper = input.parentElement;
  const form = document.getElementById("login-signup-form");
  const password = form.querySelector("input[name='password']").value;
  if (!input.value.trim()) {
    showFieldError(wrapper, errorEl, "This field is required");
  } else if (input.value !== password) {
    showFieldError(wrapper, errorEl, "Passwords do not match");
  } else {
    clearFieldError(wrapper, errorEl);
  }
}

/**
 * Returns the email and password input elements from the login form.
 * @returns {{emailInput: HTMLElement, passwordInput: HTMLElement}}
 */
function getLoginFormInputs() {
  const form = document.getElementById("login-signup-form");
  return {
    emailInput: form.querySelector("input[name='email']"),
    passwordInput: form.querySelector("input[name='password']"),
  };
}

/**
 * Validates all login form inputs.
 * @param {HTMLElement} emailInput - The email input element
 * @param {HTMLElement} passwordInput - The password input element
 * @returns {boolean} True if all inputs are valid
 */
function validateLoginInputs(emailInput, passwordInput) {
  const emailValid = validateInputField(emailInput, "email-error");
  const passwordValid = validateInputField(passwordInput, "password-error");
  return emailValid && passwordValid;
}

/**
 * Reads the login form values and triggers the login process.
 * @returns {Promise<void>}
 */
export async function handleLogin() {
  const { emailInput, passwordInput } = getLoginFormInputs();
  if (!validateLoginInputs(emailInput, passwordInput)) return;
  await login(emailInput.value, passwordInput.value);
}

/**
 * Returns all input elements from the signup form.
 * @returns {{nameInput: HTMLElement, emailInput: HTMLElement, passwordInput: HTMLElement, passwordConfirmInput: HTMLElement, acceptCheckbox: HTMLElement}}
 */
function getSignupFormInputs() {
  const form = document.getElementById("login-signup-form");
  return {
    nameInput: form.querySelector("input[name='fullname']"),
    emailInput: form.querySelector("input[name='email']"),
    passwordInput: form.querySelector("input[name='password']"),
    passwordConfirmInput: form.querySelector("input[name='password_confirm']"),
    acceptCheckbox: form.querySelector("#accept-btn"),
  };
}

/**
 * Validates an input on submit with the same rules as on blur.
 * @param {HTMLInputElement} input - The input element
 * @param {string} errorId - The ID of the error span
 * @returns {boolean} True if the input is valid
 */
function validateInputField(input, errorId) {
  validateField(input, errorId);
  return !getFieldErrorMessage(input);
}

/**
 * Validates the password confirmation input field.
 * @param {HTMLElement} passwordInput - The original password input element
 * @param {HTMLElement} passwordConfirmInput - The confirmation input element
 * @returns {boolean} True if both passwords match
 */
function validateSignupPasswordConfirm(passwordInput, passwordConfirmInput) {
  const error = document.getElementById("password-confirm-error");
  if (!passwordConfirmInput.value.trim())
    return !showFieldError(passwordConfirmInput.closest(".login__input--password"), error, "This field is required");
  if (passwordConfirmInput.value !== passwordInput.value)
    return !showFieldError(passwordConfirmInput.closest(".login__input--password"), error, "Passwords do not match");
  clearFieldError(passwordConfirmInput.closest(".login__input--password"), error);
  return true;
}

/**
 * Validates the privacy policy checkbox.
 * @param {HTMLElement} acceptCheckbox - The checkbox element
 * @returns {boolean} True if the checkbox is checked
 */
function validateAcceptCheckbox(acceptCheckbox) {
  const error = document.getElementById("accept-error");
  if (acceptCheckbox.checked) {
    acceptCheckbox.classList.remove("login__checkbox--invalid");
    error.textContent = "";
    error.classList.remove("login__error--visible");
    return true;
  }
  acceptCheckbox.classList.add("login__checkbox--invalid");
  error.textContent = "You have to accept the privacy policy";
  error.classList.add("login__error--visible");
  return false;
}

/**
 * Validates all signup form inputs and returns the combined result.
 * @param {{nameInput: HTMLElement, emailInput: HTMLElement, passwordInput: HTMLElement, passwordConfirmInput: HTMLElement, acceptCheckbox: HTMLElement}} inputs - The form input elements
 * @returns {boolean} True if all inputs are valid
 */
function validateSignupInputs({ nameInput, emailInput, passwordInput, passwordConfirmInput, acceptCheckbox }) {
  const nameValid = validateInputField(nameInput, "fullname-error");
  const emailValid = validateInputField(emailInput, "email-error");
  const passwordValid = validateInputField(passwordInput, "password-error");
  const confirmValid = validateSignupPasswordConfirm(passwordInput, passwordConfirmInput);
  const acceptValid = validateAcceptCheckbox(acceptCheckbox);
  return nameValid && emailValid && passwordValid && confirmValid && acceptValid;
}

/**
 * Reads the signup form values, validates them and triggers the signup process.
 * @returns {Promise<void>}
 */
export async function handleSignup() {
  const inputs = getSignupFormInputs();
  if (!validateSignupInputs(inputs)) return;
  await signup(inputs.nameInput.value, inputs.emailInput.value, inputs.passwordInput.value);
}

/**
 * Signs in the user anonymously as a guest and redirects to the summary page.
 * @returns {Promise<void>}
 */
export async function guestLogin() {
  try {
    await signInGuest();
    window.location.href = "./summary.html";
  } catch (error) {
    showMessage("Gast-Login fehlgeschlagen: " + error.message);
  }
}
