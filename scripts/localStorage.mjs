/**
 * Get a value from localStorage.
 * @param {string} key
 * @returns {string|null} The stored value, or null if not found.
 */
export function getFromLocalStorage(key) {
  return localStorage.getItem(key);
}

/**
 * Remove a key from localStorage.
 * @param {string} key
 * @returns {void}
 */
export function removeFromLocalStorage(key) {
  localStorage.removeItem(key);
}