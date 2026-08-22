/**
 * Live-updates the stakeholder landing page's daily request counter.
 * Listens to Firebase's /emailRequestCount/{today} (written by the n8n workflow)
 * and toggles the "limit-reached" state once today's count hits the daily cap of 10.
 * @module stakeholder
 */
import {
  onValue,
  ref,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";
import { db } from "./firebaseAuth.js";

// "sv-SE" locale formats as YYYY-MM-DD, matching the date keys n8n writes under /emailRequestCount
const today = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Berlin",
}).format(new Date());

const counterReference = ref(db, `emailRequestCount/${today}`);

const currentCount = document
  .querySelector("#requestCounter")
  .querySelector(".counter-number strong");

const stakeholderLayout = document.querySelector("#stakeholderLayout");

/**
 * @param {Object} snapshot - Firebase DataSnapshot of today's /emailRequestCount/{today} node
 */
onValue(counterReference, (snapshot) => {
  const count = snapshot.val()?.count ?? 0;

  currentCount.textContent = count;
  stakeholderLayout.classList.toggle("limit-reached", count >= 10);
});
