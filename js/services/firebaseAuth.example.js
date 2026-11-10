import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth }                from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getDatabase }            from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";


const firebaseConfig = {
  apiKey: "<KEY>",
  authDomain: "<DOMAIN>",
  databaseURL: "<DB-URL>",
  projectId: "<PORJECT-ID>>",
  storageBucket: "<STORAGE-BUCKET>",
  messagingSenderId: "<MS-ID>",
  appId: "<APP-ID>",
  measurementId: "<M-ID>"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db   = getDatabase(app);