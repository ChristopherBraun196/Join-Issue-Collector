/**
 * Generates a RFC 4122 compliant UUID v4.
 * Uses `crypto.randomUUID()` in secure contexts (HTTPS),
 * and falls back to `crypto.getRandomValues()` for HTTP environments.
 *
 * @returns {string} A UUID string in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 *
 * @example
 * const id = generateUUID();
 * // "3b12f1df-5232-4804-897e-917bf397618a"
 *
 * const taskID = "task-" + generateUUID();
 * // "task-3b12f1df-5232-4804-897e-917bf397618a"
 */
export function generateUUID() {
  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );
}

window.generateUUID = generateUUID; // bridge for classic scripts, remove in Phase 6
