export function displayMessage(container, message, type = "error") {
  container.textContent = message;
  container.className = `text-sm mt-2 ${type === "error" ? "text-primaryColor" : "text-successColor"}`;
  container.classList.remove("hidden");
}