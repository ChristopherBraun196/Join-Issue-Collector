import { auth, db } from "./firebaseAuth.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { ref, set, get, update } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";
import { generateUUID } from "../utils/ids.js";
import { selectRandomAvatarColor } from "../utils/avatar.js";

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
 * Links an existing contact with the same email to the new account.
 * Only contacts without uid are linked, so each contact can be linked only once.
 * @param {string} uid - The Firebase user ID
 * @param {string} email - The email address of the user
 * @returns {Promise<string|null>} The linked contact ID, or null if no contact was found
 */
async function linkExistingContact(uid, email) {
  const snapshot = await get(ref(db, "contacts"));
  const contacts = Object.values(snapshot.val() || {});
  const match = contacts.find((contact) => !contact.uid && contact.email?.toLowerCase() === email.toLowerCase());
  if (!match) return null;
  await update(ref(db, `contacts/${match.id}`), { uid: uid });
  return match.id;
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
  const existingContactId = await linkExistingContact(user.uid, email);
  const contactId = existingContactId || (await createContactEntry(user.uid, name, email));
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
