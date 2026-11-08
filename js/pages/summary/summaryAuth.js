import { auth, db } from "../../services/firebaseAuth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

/**
 * Registers the auth listener that fills the greeting on the summary page.
 */
export function initGreeting() {
  onAuthStateChanged(auth, handleAuthChange);
}

/**
 * Redirects logged-out users, otherwise greets the guest or the logged-in user.
 * @param {Object|null} user - The Firebase user object or null if not logged in
 * @returns {Promise<void>}
 */
async function handleAuthChange(user) {
  if (!user) {
    window.location.href = "./index.html";
    return;
  }
  setGreeting(user.isAnonymous ? "Guest" : await loadUserName(user));
}

/**
 * Loads the display name of the logged-in user from their linked contact.
 * @param {Object} user - The Firebase user object
 * @returns {Promise<string>} The contact name or the user's email as fallback
 */
async function loadUserName(user) {
  const userSnap = await get(ref(db, `users/${user.uid}`));
  const contactId = userSnap.val()?.contactId;
  const contactSnap = await get(ref(db, `contacts/${contactId}`));
  return contactSnap.val()?.name || user.email;
}

/**
 * Returns a time-based greeting string.
 * @param {string} timeString - The current time in HH:MM:SS format
 * @returns {string} A greeting string (e.g. "Good morning,")
 */
function getGreeting(timeString) {
  const hour = parseInt(timeString.split(":")[0], 10);
  if (hour >= 5 && hour < 12) return "Good morning,";
  if (hour >= 12 && hour < 18) return "Good afternoon,";
  return "Good evening,";
}

/**
 * Sets the greeting message and user name in the summary page.
 * @param {string} name - The display name of the current user
 */
function setGreeting(name) {
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  document.querySelector("#greeting-msg").textContent = getGreeting(time);
  document.querySelector(".summary__greeting-name").textContent = name;
}
