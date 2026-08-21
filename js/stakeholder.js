import {
  onValue,
  ref,
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";
import { db } from "./firebaseAuth.js";

const today = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Berlin",
}).format(new Date());

const counterReference = ref(db, `emailRequestCount/${today}`);

const currentCount = document
  .querySelector("#requestCounter")
  .querySelector(".counter-number strong");

const stakeholderLayout = document.querySelector("#stakeholderLayout");

onValue(counterReference, (snapshot) => {
  const count = snapshot.val()?.count ?? 0;

  currentCount.textContent = count;
  stakeholderLayout.classList.toggle("limit-reached", count >= 10);
});
