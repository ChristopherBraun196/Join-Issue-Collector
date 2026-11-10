const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ'-]+(\s+[A-Za-zÀ-ÖØ-öø-ÿ'-]+)+$/;
const PASSWORD_MIN_LENGTH = 6;

/**
 * Checks whether a string is a valid email address (name@domain.tld).
 * @param {string} email - The email address to check
 * @returns {boolean} True if the email has a valid format
 */
export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email.trim());
}

/**
 * Checks whether a string is a full name with at least first and last name.
 * Letters (incl. umlauts), hyphens and apostrophes are allowed.
 * @param {string} name - The name to check
 * @returns {boolean} True if the name has a valid format
 */
export function isValidName(name) {
  return NAME_PATTERN.test(name.trim());
}

/**
 * Checks whether a password has the minimum required length.
 * @param {string} password - The password to check
 * @returns {boolean} True if the password is long enough
 */
export function isValidPassword(password) {
  return password.length >= PASSWORD_MIN_LENGTH;
}
