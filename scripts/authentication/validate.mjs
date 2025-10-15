/**
 * Validate a Noroff student email address.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/.test(email);
}

/**
 * Check password length (>= 8).
 * @param {string} password
 * @returns {boolean}
 */
export function isValidPassword(password) {
  return password.length >= 8;
}