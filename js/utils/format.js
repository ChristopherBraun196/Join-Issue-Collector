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

window.getInitials = getInitials;
