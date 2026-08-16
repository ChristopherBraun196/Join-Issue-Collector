import { auth, db } from "./firebaseAuth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });   
const greetingElement = document.getElementById('greeting-msg');
const nameElement = document.querySelector(".welcome_name");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "./index.html";
    return;
  }

  if (user.isAnonymous) {
    setGreeting("Guest");
  } else {
    const userSnap = await get(ref(db, `users/${user.uid}`));
    const contactId = userSnap.val()?.contactId;
    const contactSnap = await get(ref(db, `contacts/${contactId}`));
    setGreeting(contactSnap.val()?.name || user.email);
  }
});

/**
 * Returns a time-based greeting string.
 * @param {string} timeString - The current time in HH:MM:SS format
 * @returns {string} A greeting string (e.g. "Good morning,")
 */
function getGreeting(timeString) {
  const hour = parseInt(timeString.split(':')[0], 10);
  let greetingPart;

  switch (true) {
    case (hour >= 5 && hour < 12):
      greetingPart = "Good morning,";
      break;
    case (hour >= 12 && hour < 18):
      greetingPart = "Good afternoon,";
      break;
    case (hour >= 18 || hour < 5):
      greetingPart = "Good evening,";
      break;
    default:
      greetingPart = "Hello,";
      break;
  }
  return greetingPart;
}

/**
 * Sets the greeting message and user name in the summary page.
 * @param {string} name - The display name of the current user
 */
function setGreeting(name) {
  const greeting = getGreeting(currentTime);
  greetingElement.textContent = greeting;
  nameElement.textContent = name;
}