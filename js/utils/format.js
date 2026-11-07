/**
 * Returns the initials of a full name.
 * @param {string} name - The full name to extract initials from
 * @returns {string} The uppercase initials
 */
export function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

/**
 * Formats a date string from YYYY-MM-DD to DD/MM/YYYY.
 * @param {string} date - The date string in YYYY-MM-DD format
 * @returns {string} The formatted date string in DD/MM/YYYY format
 */
export function formatDate(date) {
  if (!date || date === "null") return "No due date";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} text - The string to capitalize
 * @returns {string} The string with the first letter capitalized
 */
export function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Formats a kebab-case string into a capitalized label.
 * @param {string} str - The kebab-case string to format (e.g. "user-story")
 * @returns {string} The formatted label (e.g. "User Story")
 */
export function formatLabel(str) {
  return str
    .split("-")
    .map((word) => capitalize(word))
    .join(" ");
}

window.getInitials = getInitials;
window.formatDate = formatDate;
window.capitalize = capitalize;
window.formatLabel = formatLabel;
