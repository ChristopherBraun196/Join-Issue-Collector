import { db } from "./firebaseAuth.js";
import { ref, get, set, remove } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

/**
 * Loads data from Firebase at the given path.
 * @param {string} path - The database path to read from
 * @returns {Promise<Object|null>} The data at the given path or null
 */
async function loadData(path = "") {
  try {
    const snapshot = await get(ref(db, path));
    return snapshot.val();
  } catch (error) {
    showMessage(error);
  }
}

/**
 * Creates a new entry at the given path with a generated UUID as key.
 * @param {string} path - The database path to write to
 * @param {Object} data - The data to store
 * @returns {Promise<Object>} An object containing the generated key
 */
async function postData(path = "", data = {}) {
  try {
    const newRef = ref(db, path + "/" + crypto.randomUUID());
    await set(newRef, data);
    return { name: newRef.key };
  } catch (error) {
    showMessage(error);
  }
}

/**
 * Writes data to Firebase at the given path, overwriting existing data.
 * @param {string} path - The database path to write to
 * @param {Object} data - The data to store
 * @returns {Promise<void>}
 */
async function putData(path = "", data = {}) {
  try {
    await set(ref(db, path), data);
  } catch (error) {
    showMessage("No permission for this action.");
    throw error;
  }
}

/**
 * Deletes data from Firebase at the given path.
 * @param {string} path - The database path to delete
 * @returns {Promise<void>}
 */
async function deleteData(path = "") {
  try {
    await remove(ref(db, path));
  } catch (error) {
     showMessage("No permission for this action.");
    throw error;
  }
}

window.loadData = loadData;
window.postData = postData;
window.putData = putData;
window.deleteData = deleteData;