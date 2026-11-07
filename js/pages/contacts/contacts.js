import { init as initLayout } from "../../components/layout.js";
import { getInitials } from "../../utils/format.js";
import { loadData } from "../../services/database.js";
import { getContactItemTemplate, getContactDetailTemplate } from "../../templates/contactTemplates.js";
import {
  initContactDialog,
  openContactDialog,
  closeContactDialog,
  submitContact,
  saveContact,
  editContact,
  deleteContact,
} from "./contactDialog.js";

let mobileActiveContact = null;
let contactsArray = [];

/**
 * Entry point for the contacts page.
 */
function init() {
  initLayout("contact");
  initContactDialog();
  loadContacts();
  document.addEventListener("click", handleContactsClick);
}

/**
 * Handles all clicks on the contacts page via event delegation.
 * @param {MouseEvent} event - The click event
 */
function handleContactsClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const { action, id } = target.dataset;
  if (action === "open-dialog") openContactDialog();
  if (action === "close-dialog") closeContactDialog();
  if (action === "submit") submitContact();
  if (action === "save") saveContact(id);
  if (action === "edit") editContact(id);
  if (action === "delete") deleteContact(id);
  if (action === "delete") closeContactDialog();
  if (action === "back") backToContacts();
}

/**
 * Groups an array of contacts alphabetically by their first name letter.
 * @param {Object[]} contacts - Array of contact objects
 * @returns {Object} An object with letters as keys and contact arrays as values
 */
function groupContactsByLetter(contacts) {
  const sorted = contacts.sort((a, b) => a.name.localeCompare(b.name));
  const grouped = {};
  sorted.forEach((contact) => {
    const letter = contact.name[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(contact);
  });
  return grouped;
}

/**
 * Creates a contact list item element with initials and avatar color.
 * @param {Object} contact - The contact object
 * @returns {HTMLElement} The created contact item element
 */
function createContactItem(contact) {
  const initials = getInitials(contact.name);
  const item = document.createElement("div");
  item.className = "contact-item";
  item.dataset.id = contact.id;
  item.innerHTML = getContactItemTemplate(contact, initials, contact.avatarColor);
  item.addEventListener("click", (event) => openContactDetail(contact, event));
  return item;
}

/**
 * Creates a letter divider element for the contact list.
 * @param {string} letter - The letter to display as a section header
 * @returns {HTMLElement} The created divider element
 */
function createLetterDivider(letter) {
  const divider = document.createElement("div");
  divider.className = "contact-divider";
  divider.innerHTML = `
    <span class="contact-letter">${letter}</span>
    <hr class="contact-divider-line">
  `;
  return divider;
}

/**
 * Creates a contact list element grouped alphabetically by letter.
 * @param {Object} grouped - An object with letters as keys and contact arrays as values
 * @returns {HTMLElement} The created contact list element
 */
function buildContactList(grouped) {
  const list = document.createElement("div");
  list.className = "contacts-list";
  Object.keys(grouped)
    .sort()
    .forEach((letter) => {
      list.appendChild(createLetterDivider(letter));
      grouped[letter].forEach((contact) => list.appendChild(createContactItem(contact)));
    });
  return list;
}

/**
 * Renders the contacts list grouped alphabetically into the sidebar.
 * @param {Object[]} contacts - Array of contact objects to render
 */
function renderContacts(contacts) {
  const sidebar = document.getElementById("sidebar_contacts");
  const existingList = sidebar.querySelector(".contacts-list");
  if (existingList) existingList.remove();
  const grouped = groupContactsByLetter(contacts);
  sidebar.appendChild(buildContactList(grouped));
}

/**
 * Loads all contacts from Firebase and renders them into the sidebar.
 * @returns {Promise<void>}
 */
export async function loadContacts() {
  try {
    const data = await loadData("/contacts");
    if (!data) return;

    contactsArray = Object.entries(data).map(([id, contact]) => ({
      ...contact,
      id,
    }));

    renderContacts(contactsArray);
    openContactFromUrl();
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
  }
}

/**
 * Opens the contact detail view for a contact ID given in the URL (e.g. contacts.html?id=abc123).
 */
function openContactFromUrl() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  const contact = contactsArray.find((c) => c.id === id);
  const item = document.querySelector(`.contact-item[data-id="${id}"]`);
  if (!contact || !item) return;

  openContactDetail(contact, { currentTarget: item });
}

/**
 * Clears the active contact selection and removes the detail view.
 */
export function clearActiveContact() {
  document.querySelectorAll(".contact-item").forEach((el) => el.classList.remove("active"));
  const existing = document.querySelector(".contact-detail");
  if (existing) existing.remove();
  document.querySelector(".main_contacts").classList.remove("contact-open");
  document.getElementById("sidebar_contacts").style.display = "";
  document.querySelector(".fab-add-contact").style.display = "";
  mobileActiveContact = null;
}

/**
 * Appends the contact detail view to the main content area.
 * @param {Object} contact - The contact object to display
 */
function appendContactDetail(contact) {
  const main = document.querySelector(".main_contacts");
  const initials = getInitials(contact.name);
  const detail = document.createElement("div");
  detail.className = "contact-detail";
  detail.innerHTML = getContactDetailTemplate(contact, initials, contact.avatarColor);
  main.appendChild(detail);
}

/**
 * Opens the contact detail view for the selected contact.
 * @param {Object} contact - The contact object to display
 * @param {MouseEvent} event - The click event from the contact item
 */
function openContactDetail(contact, event) {
  const clickedItem = event.currentTarget;
  const isAlreadyActive = clickedItem.classList.contains("active");
  clearActiveContact();
  if (isAlreadyActive) return;
  clickedItem.classList.add("active");
  mobileActiveContact = contact;
  appendContactDetail(contact);
  if (window.innerWidth <= 1200) {
    document.querySelector(".main_contacts").classList.add("contact-open");
    document.getElementById("sidebar_contacts").style.display = "none";
    document.querySelector(".fab-add-contact").style.display = "none";
  }
}

/**
 * Clears the active contact and returns to the contact list.
 */
function backToContacts() {
  clearActiveContact();
}

/**
 * Returns the data of the currently active contact item.
 * @param {string} contactId - The ID of the contact
 * @returns {Object|null} The active contact data or null if none is active
 */
export function getActiveContactData(contactId) {
  let currentContact = null;
  document.querySelectorAll(".contact-item").forEach((item) => {
    if (item.classList.contains("active")) {
      currentContact = {
        id: contactId,
        name: item.querySelector(".contact-name").textContent,
        email: item.querySelector(".contact-email").textContent,
      };
    }
  });
  return currentContact;
}

document.addEventListener("DOMContentLoaded", init);
