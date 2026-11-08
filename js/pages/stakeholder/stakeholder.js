/**
 * Live-updates the stakeholder landing page's daily request counter.
 * Listens to Firebase's /emailRequestCount/{today} (written by the n8n workflow)
 * and switches to the limit state once today's count hits the daily cap of 10.
 * @module stakeholder
 */
import { onValue, ref } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";
import { db } from "../../services/firebaseAuth.js";

const DAILY_LIMIT = 10;

/**
 * Entry point for the stakeholder page.
 */
function init() {
  onValue(ref(db, `emailRequestCount/${getTodayKey()}`), renderRequestCount);
}

/**
 * Returns today's date in Berlin time as YYYY-MM-DD, matching the keys n8n writes under /emailRequestCount.
 * @returns {string} Today's date key
 */
function getTodayKey() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(new Date());
}

/**
 * Shows today's request count and switches to the limit state once the daily limit is reached.
 * @param {Object} snapshot - Firebase DataSnapshot of today's /emailRequestCount/{today} node
 */
function renderRequestCount(snapshot) {
  const count = snapshot.val()?.count ?? 0;
  document.querySelector("#requestCounter .stakeholder__count strong").textContent = count;
  document.querySelector("#stakeholderLayout").classList.toggle("stakeholder__layout--limit", count >= DAILY_LIMIT);
}

document.addEventListener("DOMContentLoaded", init);
