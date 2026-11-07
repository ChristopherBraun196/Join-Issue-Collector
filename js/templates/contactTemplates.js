/**
 * Returns the HTML template for a contact list item.
 * @param {Object} contact - The contact object
 * @param {string} initials - The initials of the contact
 * @param {string} color - The avatar background color
 * @returns {string} HTML string of the contact list item
 */
export function getContactItemTemplate(contact, initials, color) {
  return `
    <div class="contact-avatar" style="background-color: ${color};">
      ${initials}
    </div>
    <div class="contact-info">
      <span class="contact-name">${contact.name}</span>
      <span class="contact-email">${contact.email}</span>
    </div>
  `;
}

/**
 * Returns the HTML template for the contact detail view.
 * @param {Object} contact - The contact object
 * @param {string} initials - The initials of the contact
 * @param {string} color - The avatar background color
 * @returns {string} HTML string of the contact detail view
 */
export function getContactDetailTemplate(contact, initials, color) {
  return `
    <div class="contact-detail-header">
      <div class="contact-detail-avatar" style="background-color: ${color};">
        ${initials}
      </div>
      <div class="contact-detail-name-actions">
        <h2>${contact.name}</h2>
        <div class="contact-detail-actions">
          <button data-action="edit" data-id="${contact.id}" class="detail-action-btn">
            <img src="./assets/icons/edit.svg" alt="Edit"> Edit
          </button>
          <button data-action="delete" data-id="${contact.id}" class="detail-action-btn">
            <img src="./assets/icons/delete.svg" alt="Delete"> Delete
          </button>
        </div>
      </div>
    </div>

    <p class="contact-info-label">Contact Information</p>

    <div class="contact-detail-info">
      <p class="detail-info-title">Email</p>
      <a class="detail-info-email" href="mailto:${contact.email}">${contact.email}</a>
    </div>

    <div class="contact-detail-info">
      <p class="detail-info-title">Phone</p>
      <p class="detail-info-value" id="detail-phone">${contact.phone || "–"}</p>
    </div>
  `;
}

window.getContactItemTemplate = getContactItemTemplate;
window.getContactDetailTemplate = getContactDetailTemplate;
