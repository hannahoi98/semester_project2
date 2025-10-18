/**
 * Display a message inside a container and reveal it.
 *
 * @param {HTMLElement} container - Target element to render the message into.
 * @param {string} message - Text content to display.
 * @param {"error"|"success"} [type="error"] - Visual style for the message.
 */
export function displayMessage(container, message, type = "error") {
  container.textContent = message;
  container.className = `text-sm mt-2 ${type === "error" ? "text-primaryColor" : "text-successColor"}`;
  container.classList.remove("hidden");
}