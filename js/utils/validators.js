const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/**
 * Checks whether a string is a valid email address (name@domain.tld).
 * @param {string} email - The email address to check
 * @returns {boolean} True if the email has a valid format
 */
export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email.trim());
}
