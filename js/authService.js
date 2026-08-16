import { auth, db } from "./firebaseAuth.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import {
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

export const AVATAR_COLORS = [
  "#FF7043",
  "#E91E8C",
  "#9C27B0",
  "#3F51B5",
  "#00BCD4",
  "#4CAF50",
  "#FF9800",
  "#795548",
];

/**
 * Returns a randomly selected avatar color from the predefined color list.
 * @returns {string} A hex color code
 */
export function selectRandomAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

/**
 * Creates a contact entry in the database for a newly registered user.
 * @param {string} uid - The Firebase user ID
 * @param {string} name - The full name of the user
 * @param {string} email - The email address of the user
 * @returns {Promise<string>} The generated contact ID
 */
async function createContactEntry(uid, name, email) {
  const contactId = `contact-${generateUUID()}`;
  await set(ref(db, `contacts/${contactId}`), {
    id: contactId,
    name: name,
    email: email,
    avatarColor: selectRandomAvatarColor(),
    uid: uid,
  });
  return contactId;
}

/**
 * Creates a user entry in the database linking the user to their contact.
 * @param {string} uid - The Firebase user ID
 * @param {string} contactId - The associated contact ID
 * @returns {Promise<void>}
 */
async function createUserEntry(uid, contactId) {
  await set(ref(db, `users/${uid}`), {
    contactId: contactId,
  });
}

/**
 * Displays an error message at the relevant input field based on the Firebase signup error code.
 * @param {Error} error - The Firebase error object
 */
function handleSignupError(error) {
  const form = document.getElementById("login-signup-form");
  const emailInput = form.querySelector("input[name='email']");
  const passwordInput = form.querySelector("input[name='password']");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");

  const emailMessages = {
    "auth/email-already-in-use": "This email is already registered.",
    "auth/invalid-email": "Invalid email address.",
  };
  const passwordMessages = {
    "auth/weak-password": "Password too weak (min. 6 characters).",
  };

  if (emailMessages[error.code]) {
    showFieldError(
      emailInput.closest(".email-input"),
      emailError,
      emailMessages[error.code],
    );
  } else if (passwordMessages[error.code]) {
    showFieldError(
      passwordInput.closest(".pwd-input"),
      passwordError,
      passwordMessages[error.code],
    );
  } else {
    showFieldError(
      emailInput.closest(".email-input"),
      emailError,
      error.message,
    );
  }
}

/**
 * Registers a new user with email and password and redirects to the summary page.
 * @param {string} name - The full name of the user
 * @param {string} email - The email address of the user
 * @param {string} password - The password for the new account
 * @returns {Promise<void>}
 */
async function signup(name, email, password) {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const contactId = await createContactEntry(user.uid, name, email);
    await createUserEntry(user.uid, contactId);
    await signOut(auth);
    showMessage("Signup successful!");
    setTimeout(() => {
      switchToLogin();
    }, 1000);
  } catch (error) {
    handleSignupError(error);
  }
}

/**
 * Displays an error message at the relevant input field based on the Firebase login error code.
 * @param {Error} error - The Firebase error object
 */
function handleLoginError(error) {
  const form = document.getElementById("login-signup-form");
  const emailInput = form.querySelector("input[name='email']");
  const passwordInput = form.querySelector("input[name='password']");
  const passwordError = document.getElementById("password-error");

  if (error.code === "auth/too-many-requests") {
    showFieldError(
      passwordInput.closest(".pwd-input"),
      passwordError,
      "Too many failed attempts. Please wait a moment.",
    );
    return;
  }

  emailInput.closest(".email-input").classList.add("invalid");
  showFieldError(
    passwordInput.closest(".pwd-input"),
    passwordError,
    "Wrong email address or password.",
  );
}

/**
 * Signs in a user with email and password and redirects to the summary page.
 * @param {string} email - The email address of the user
 * @param {string} password - The user's password
 * @returns {Promise<void>}
 */
async function login(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
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
  inputWrapper.classList.add("invalid");
  errorEl.textContent = message;
  errorEl.classList.add("visible");
}

/**
 * Clears a field error message and removes the invalid border.
 * @param {HTMLElement} inputWrapper - The parent div of the input
 * @param {HTMLElement} errorEl - The error span element
 */
function clearFieldError(inputWrapper, errorEl) {
  inputWrapper.classList.remove("invalid");
  errorEl.textContent = "";
  errorEl.classList.remove("visible");
}

/**
 * Shows or hides the password visibility toggle button based on input content.
 * @param {HTMLInputElement} input - The password input element
 */
function togglePwdVisibilityBtn(input) {
  const wrapper = input.parentElement;
  const btn = wrapper.querySelector(".pwd-toggle-btn");
  const lock = wrapper.querySelector(".pwd-lock-icon");
  const hasValue = input.value.length > 0;
  if (btn) btn.classList.toggle("visible", hasValue);
  if (lock) lock.classList.toggle("hidden", hasValue);
}

/**
 * Toggles the password input between plain text and password type.
 * @param {HTMLButtonElement} btn - The toggle button element
 */
function togglePwdVisibility(btn) {
  const input = btn.parentElement.querySelector("input");
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  btn.classList.toggle("showing", isHidden);
}

/**
 * Validates a required field on blur and shows an error if empty.
 * @param {HTMLInputElement} input - The input element
 * @param {string} errorId - The ID of the error span
 */
function validateField(input, errorId) {
  const errorEl = document.getElementById(errorId);
  const wrapper = input.parentElement;
  if (!input.value.trim()) {
    showFieldError(wrapper, errorEl, "This field is required");
  } else {
    clearFieldError(wrapper, errorEl);
  }
}

/**
 * Validates the confirm password field on blur.
 * @param {HTMLInputElement} input - The confirm password input element
 */
function validatePasswordConfirm(input) {
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
 * Validates a single login input field and shows or clears its error.
 * @param {HTMLElement} input - The input element to validate
 * @param {HTMLElement} errorEl - The error message element
 * @param {string} wrapperClass - The CSS class of the input wrapper
 * @returns {boolean} True if the input is valid
 */
function validateLoginField(input, errorEl, wrapperClass) {
  if (!input.value.trim()) {
    showFieldError(input.closest(wrapperClass), errorEl, "This field is required");
    return false;
  }
  clearFieldError(input.closest(wrapperClass), errorEl);
  return true;
}

/**
 * Validates all login form inputs.
 * @param {HTMLElement} emailInput - The email input element
 * @param {HTMLElement} passwordInput - The password input element
 * @returns {boolean} True if all inputs are valid
 */
function validateLoginInputs(emailInput, passwordInput) {
  const emailValid = validateLoginField(emailInput, document.getElementById("email-error"), ".email-input");
  const passwordValid = validateLoginField(passwordInput, document.getElementById("password-error"), ".pwd-input");
  return emailValid && passwordValid;
}

/**
 * Reads the login form values and triggers the login process.
 * @returns {Promise<void>}
 */
async function handleLogin() {
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
 * Validates the full name input field.
 * @param {HTMLElement} nameInput - The name input element
 * @returns {boolean} True if the input is valid
 */
function validateSignupName(nameInput) {
  const error = document.getElementById("fullname-error");
  return validateLoginField(nameInput, error, ".name-input");
}

/**
 * Validates the email input field including format check.
 * @param {HTMLElement} emailInput - The email input element
 * @returns {boolean} True if the input is valid
 */
function validateSignupEmail(emailInput) {
  const error = document.getElementById("email-error");
  if (!emailInput.value.trim()) return !showFieldError(emailInput.closest(".email-input"), error, "This field is required");
  if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(emailInput.value.trim())) return !showFieldError(emailInput.closest(".email-input"), error, "Not a valid email address");
  clearFieldError(emailInput.closest(".email-input"), error);
  return true;
}

/**
 * Validates the password input field including minimum length check.
 * @param {HTMLElement} passwordInput - The password input element
 * @returns {boolean} True if the input is valid
 */
function validateSignupPassword(passwordInput) {
  const error = document.getElementById("password-error");
  if (!passwordInput.value.trim()) return !showFieldError(passwordInput.closest(".pwd-input"), error, "This field is required");
  if (passwordInput.value.length < 6) return !showFieldError(passwordInput.closest(".pwd-input"), error, "Password too weak (min. 6 characters).");
  clearFieldError(passwordInput.closest(".pwd-input"), error);
  return true;
}

/**
 * Validates the password confirmation input field.
 * @param {HTMLElement} passwordInput - The original password input element
 * @param {HTMLElement} passwordConfirmInput - The confirmation input element
 * @returns {boolean} True if both passwords match
 */
function validateSignupPasswordConfirm(passwordInput, passwordConfirmInput) {
  const error = document.getElementById("password-confirm-error");
  if (!passwordConfirmInput.value.trim()) return !showFieldError(passwordConfirmInput.closest(".pwd-input"), error, "This field is required");
  if (passwordConfirmInput.value !== passwordInput.value) return !showFieldError(passwordConfirmInput.closest(".pwd-input"), error, "Passwords do not match");
  clearFieldError(passwordConfirmInput.closest(".pwd-input"), error);
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
    acceptCheckbox.classList.remove("invalid");
    error.textContent = "";
    error.classList.remove("visible");
    return true;
  }
  acceptCheckbox.classList.add("invalid");
  error.textContent = "You have to accept the privacy policy";
  error.classList.add("visible");
  return false;
}

/**
 * Validates all signup form inputs and returns the combined result.
 * @param {{nameInput: HTMLElement, emailInput: HTMLElement, passwordInput: HTMLElement, passwordConfirmInput: HTMLElement, acceptCheckbox: HTMLElement}} inputs - The form input elements
 * @returns {boolean} True if all inputs are valid
 */
function validateSignupInputs({ nameInput, emailInput, passwordInput, passwordConfirmInput, acceptCheckbox }) {
  const nameValid = validateSignupName(nameInput);
  const emailValid = validateSignupEmail(emailInput);
  const passwordValid = validateSignupPassword(passwordInput);
  const confirmValid = validateSignupPasswordConfirm(passwordInput, passwordConfirmInput);
  const acceptValid = validateAcceptCheckbox(acceptCheckbox);
  return nameValid && emailValid && passwordValid && confirmValid && acceptValid;
}

/**
 * Reads the signup form values, validates them and triggers the signup process.
 * @returns {Promise<void>}
 */
async function handleSignup() {
  const inputs = getSignupFormInputs();
  if (!validateSignupInputs(inputs)) return;
  await signup(inputs.nameInput.value, inputs.emailInput.value, inputs.passwordInput.value);
}

/**
 * Signs in the user anonymously as a guest and redirects to the summary page.
 * @returns {Promise<void>}
 */
async function guestLogin() {
  try {
    await signInAnonymously(auth);
    window.location.href = "./summary.html";
  } catch (error) {
    showMessage("Gast-Login fehlgeschlagen: " + error.message);
  }
}

window.guestLogin = guestLogin;
window.signup = signup;
window.login = login;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.validateField = validateField;
window.validatePasswordConfirm = validatePasswordConfirm;
window.togglePwdVisibilityBtn = togglePwdVisibilityBtn;
window.togglePwdVisibility = togglePwdVisibility;
