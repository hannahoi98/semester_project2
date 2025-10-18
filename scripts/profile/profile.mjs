import { API_KEY, AUTH_PROFILE_URL } from "../apiEndpoints.mjs";
import { getFromLocalStorage } from "../localStorage.mjs";
import { toggleAvatarForm,updateAvatar } from "./updateAvatar.mjs";

/** @type {HTMLElement|null} */
const profileName = document.getElementById("profile-name");
/** @type {HTMLElement|null} */
const profileCredits = document.getElementById("profile-credits");
/** @type {HTMLElement|null} */
const profileMessage = document.getElementById("profile-message");
/** @type {HTMLButtonElement|null} */
const updateAvatarButton = document.getElementById("update-avatar-button");
/** @type {HTMLFormElement|null} */
const avatarForm = document.getElementById("avatar-form");

/**
 * Fetch the current user's profile and render it.
 * Handles both API errors and network failures.
 * @returns {Promise<void>}
 */
async function fetchProfile() {
  clearUserError();

  const userName = getFromLocalStorage("userName");
  const accessToken = getFromLocalStorage("accessToken");

  if (!userName || !accessToken) {
    displayUserError("You must be logged in to view your profile.");
    return;
  }

  const url = AUTH_PROFILE_URL.replace("<name>", userName);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg =
        errorData.errors?.[0]?.message || "Failed to load profile.";
      displayUserError(errorMsg);
      return;
    }

    const data = await response.json();

    profileName.textContent = data.data.name;
    profileCredits.textContent = data.data.credits;

    if (data.data.avatar?.url) {
      document.getElementById("avatar-image").src = data.data.avatar.url;
      document.getElementById("avatar-image").alt = data.data.avatar.alt;
    }
  } catch {
    displayUserError("Network error. Please try again later.");
  }
}

/**
 * Show an error message to the user with basic styling.
 * @param {string} message
 */
function displayUserError(message) {
  profileMessage.textContent = message;
  profileMessage.className = "mt-4 text-center text-primaryColor p-2";
}

/**
 * Clears any displayed user error messages and removes styling.
 */
function clearUserError() {
  profileMessage.textContent = "";
  profileMessage.className = "";
}

// Initialize
fetchProfile();

// UI Events
updateAvatarButton.addEventListener("click", toggleAvatarForm);
avatarForm.addEventListener("submit", updateAvatar);