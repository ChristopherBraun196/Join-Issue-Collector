/**
 * Returns the HTML template for a contact list item.
 * @param {Object} contact - The contact object
 * @param {string} initials - The initials of the contact
 * @param {string} color - The avatar background color
 * @returns {string} HTML string of the contact list item
 */
export function getContactItemTemplate(contact, initials, color) {
  return `
    <div class="contacts__avatar" style="background-color: ${color};">
      ${initials}
    </div>
    <div class="contacts__info">
      <span class="contacts__name">${contact.name}</span>
      <span class="contacts__email">${contact.email}</span>
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
    <div class="contacts__detail-header">
      <div class="contacts__detail-avatar" style="background-color: ${color};">
        ${initials}
      </div>
      <div class="contacts__detail-name-actions">
        <h2 class="contacts__detail-name">${contact.name}</h2>
        <div class="contacts__detail-actions">
          <button data-action="edit" data-id="${contact.id}" class="contacts__action-btn">
            <img src="./assets/icons/edit.svg" alt="Edit" class="contacts__action-icon"> Edit
          </button>
          <button data-action="delete" data-id="${contact.id}" class="contacts__action-btn">
            <img src="./assets/icons/delete.svg" alt="Delete" class="contacts__action-icon"> Delete
          </button>
        </div>
      </div>
    </div>

    <p class="contacts__info-label">Contact Information</p>

    <div class="contacts__detail-info">
      <p class="contacts__info-title">Email</p>
      <a class="contacts__info-email" href="mailto:${contact.email}">${contact.email}</a>
    </div>

    <div class="contacts__detail-info">
      <p class="contacts__info-title">Phone</p>
      <p class="contacts__info-value">${contact.phone || "–"}</p>
    </div>
  `;
}
