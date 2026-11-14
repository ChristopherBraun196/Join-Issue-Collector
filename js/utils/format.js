/**
 * Number of bytes in one megabyte.
 * @type {number}
 */
const BYTES_PER_MB = 1024 * 1024;

/**
 * Returns the initials of a full name.
 * @param {string} name - The full name to extract initials from
 * @returns {string} The uppercase initials
 */
export function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
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

/**
 * Formats a file size in bytes as a readable string.
 * @param {number} bytes - The file size in bytes.
 * @returns {string} The size in KB below 1 MB (e.g. "240 KB"), otherwise in MB (e.g. "1.2 MB").
 */
export function formatFileSize(bytes) {
  if (bytes < BYTES_PER_MB) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / BYTES_PER_MB).toFixed(1)} MB`;
}
