import { getInitials } from "./format.js";

const AVATAR_COLORS = ["#FF7043", "#E91E8C", "#9C27B0", "#3F51B5", "#00BCD4", "#4CAF50", "#FF9800", "#795548"];

/**
 * Returns a randomly selected avatar color from the predefined color list.
 * @returns {string} A hex color code
 */
export function selectRandomAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

/**
 * Returns the inner HTML of an avatar: the contact photo if there is one, otherwise the initials.
 * @param {{name: string, photo: (string|undefined)}} contact - The contact
 * @returns {string} HTML string of the photo or the initials
 */
export function getAvatarContent(contact) {
  if (contact.photo) return `<img class="avatar-photo" src="${contact.photo}" alt="">`;
  return getInitials(contact.name);
}
