import { db } from "./firebaseAuth.js";
import { ref, get, set, update, remove } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";
import { showMessage } from "../components/toast.js";

/**
 * Loads data from Firebase at the given path.
 * @param {string} path - The database path to read from
 * @returns {Promise<Object|null>} The data at the given path or null
 */
export async function loadData(path = "") {
  try {
    const snapshot = await get(ref(db, path));
    return snapshot.val();
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
export async function putData(path = "", data = {}) {
  try {
    await set(ref(db, path), data);
  } catch (error) {
    showMessage("No permission for this action.");
    throw error;
  }
}

/**
 * Updates only the given fields at the path and keeps all other fields.
 * @param {string} path - The database path to update
 * @param {Object} data - The fields to change
 * @returns {Promise<void>}
 */
export async function updateData(path = "", data = {}) {
  try {
    await update(ref(db, path), data);
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
export async function deleteData(path = "") {
  try {
    await remove(ref(db, path));
  } catch (error) {
    showMessage("No permission for this action.");
    throw error;
  }
}
