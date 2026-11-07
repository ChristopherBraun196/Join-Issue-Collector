import { auth, db } from "./firebaseAuth.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";
import { generateUUID } from "../utils/ids.js";

export const AVATAR_COLORS = ["#FF7043", "#E91E8C", "#9C27B0", "#3F51B5", "#00BCD4", "#4CAF50", "#FF9800", "#795548"];

/**
 * Returns a randomly selected avatar color from the predefined color list.
 * @returns {string} A hex color code
 */
export function selectRandomAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

/**
 * Creates a contact entry in the database for a newly registered user.
 * @param {string} uid - The Firebase user ID
 * @param {string} name - The full name of the user
 * @param {string} email - The email address of the user
 * @returns {Promise<string>} The generated contact ID
 */
async function createContactEntry(uid, name, email) {
  const contactId = `contact-${generateUUID()}`;
  await set(ref(db, `contacts/${contactId}`), {
    id: contactId,
    name: name,
    email: email,
    avatarColor: selectRandomAvatarColor(),
    uid: uid,
  });
  return contactId;
}

/**
 * Creates a user entry in the database linking the user to their contact.
 * @param {string} uid - The Firebase user ID
 * @param {string} contactId - The associated contact ID
 * @returns {Promise<void>}
 */
async function createUserEntry(uid, contactId) {
  await set(ref(db, `users/${uid}`), {
    contactId: contactId,
  });
}

/**
 * Creates a Firebase account, its contact and user entry, then signs out again.
 * @param {string} name - The full name of the user
 * @param {string} email - The email address of the user
 * @param {string} password - The password for the new account
 * @returns {Promise<void>}
 */
export async function registerUser(name, email, password) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const contactId = await createContactEntry(user.uid, name, email);
  await createUserEntry(user.uid, contactId);
  await signOut(auth);
}

/**
 * Signs in a user with email and password.
 * @param {string} email - The email address of the user
 * @param {string} password - The user's password
 * @returns {Promise<void>}
 */
export async function signInUser(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Signs in anonymously as a guest.
 * @returns {Promise<void>}
 */
export async function signInGuest() {
  await signInAnonymously(auth);
}
