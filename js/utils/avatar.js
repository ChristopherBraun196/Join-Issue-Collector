const AVATAR_COLORS = ["#FF7043", "#E91E8C", "#9C27B0", "#3F51B5", "#00BCD4", "#4CAF50", "#FF9800", "#795548"];

/**
 * Returns a randomly selected avatar color from the predefined color list.
 * @returns {string} A hex color code
 */
export function selectRandomAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}
