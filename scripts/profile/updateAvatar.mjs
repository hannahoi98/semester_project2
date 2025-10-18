import { API_KEY, AUTH_PROFILE_URL } from "../apiEndpoints.mjs";
import { getFromLocalStorage } from "../localStorage.mjs";

/** @type {HTMLButtonElement|null} */
const updateAvatarButton = document.getElementById("update-avatar-button");
/** @type {HTMLFormElement|null} */
const avatarForm = document.getElementById("avatar-form");
/** @type {HTMLImageElement|null} */
const avatarImage = document.getElementById("avatar-image");
/** @type {HTMLInputElement|null} */
const avatarUrlInput = document.getElementById("avatar-url");
/** @type {HTMLInputElement|null} */
const avatarAltInput = document.getElementById("avatar-alt-text");
/** @type {HTMLElement|null} */
const profileMessage = document.getElementById("profile-message");

/**
 * Toggle the avatar form visibility and button label.
 */
function toggleAvatarForm() {
  const isHidden = avatarForm.classList.toggle("hidden");
  updateAvatarButton.textContent = isHidden ? "Update Avatar" : "Close Form";
}


/**
 * Update the user's avatar via API and reflect the change in the UI.
 * Reloads the page on success.
 * @param {SubmitEvent} event
 * @returns {Promise<void>}
 */
async function updateAvatar(event) {
  event.preventDefault();
  clearUserError();

  const userName = getFromLocalStorage("userName");
  const accessToken = getFromLocalStorage("accessToken");
  if (!userName || !accessToken) {
    displayUserError("You must be logged in to update your avatar.");
    return;
  }

  const newAvatarUrl = avatarUrlInput.value.trim();
  const newAvatarAlt = avatarAltInput.value.trim();
  if (!newAvatarUrl || !newAvatarAlt) {
    displayUserError("Please enter both an image URL and alt text.");
    return;
  }

  const url = AUTH_PROFILE_URL.replace("<name>", userName);
  const requestBody = {
    avatar: {
      url: newAvatarUrl,
      alt: newAvatarAlt,
    },
  };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg =
        errorData.errors?.[0]?.message || "Failed to update avatar.";
      displayUserError(errorMsg);
      return;
    }

    const data = await response.json();
    avatarImage.src = data.data.avatar.url;
    avatarImage.alt = data.data.avatar.alt;

    avatarUrlInput.value = "";
    avatarAltInput.value = "";
    avatarForm.classList.add("hidden");

    displaySuccessMessage("Avatar updated successfully!");
    setTimeout(() => {
      location.reload();
    }, 3000);
  } catch  {
    displayUserError("Network error. Please try again later.");
  }
}

/**
 * Show an error message (auto-clears after 3 seconds).
 * @param {string} message
 */
function displayUserError(message) {
  profileMessage.textContent = message;
  setTimeout(() => {
    clearUserError();
  }, 3000);
}

/**
 * Show a success message.
 * @param {string} message
 */
function displaySuccessMessage(message) {
  profileMessage.textContent = message;
}

/** Clear any displayed message and related styling. */
function clearUserError() {
  profileMessage.textContent = "";
  profileMessage.className = "";
}

updateAvatarButton.addEventListener("click", toggleAvatarForm);
avatarForm.addEventListener("submit", updateAvatar);

export { toggleAvatarForm, updateAvatar };