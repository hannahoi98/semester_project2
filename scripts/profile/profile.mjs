// Imports
import { API_KEY, AUTH_PROFILE_URL } from "../apiEndpoints.mjs";
import { getFromLocalStorage } from "../localStorage.mjs";
import { toggleAvatarForm,updateAvatar } from "./updateAvatar.mjs";

// DOM Elements
const profileName = document.getElementById("profile-name");
const profileCredits = document.getElementById("profile-credits");
const profileMessage = document.getElementById("profile-message");
const updateAvatarButton = document.getElementById("update-avatar-button");
const avatarForm = document.getElementById("avatar-form");

/**
 * Fetches the users profile info from the API and updates the page
 * Handles errors and network issues for the user
 */
async function fetchProfile() {
  // Clears previous errors before fetching profile
  clearUserError();

  // Retrieves the stored data for the user
  const userName = getFromLocalStorage("userName");
  const accessToken = getFromLocalStorage("accessToken");

  // Dispays an error if the user is not logged in or token is missing
  if (!userName || !accessToken) {
    displayUserError("You must be logged in to view your profile.");
    return;
  }

  // Replaces placeholder with the actual username in the API URL
  const url = AUTH_PROFILE_URL.replace("<name>", userName);

  try {
    // Making the API Call to fetch the user data for the profile
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    });

    // Handles API Errors
    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg =
        errorData.errors?.[0]?.message || "Failed to load profile.";
      displayUserError(errorMsg);
      return;
    }

    // Displays profile data
    const data = await response.json();
    profileName.textContent = data.data.name;
    profileCredits.textContent = data.data.credits;

    if (data.data.avatar?.url) {
      document.getElementById("avatar-image").src = data.data.avatar.url;
      document.getElementById("avatar-image").alt = data.data.avatar.alt;
    }
  } catch {
    // Handle network or unexpected errors
    displayUserError("Network error. Please try again later.");
  }
}

/**
 * Displays an erro rmessage to the user
 * Applies styling to the message
 *
 * @param {string} message - The error message to display
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

// Call to fetch profile data
fetchProfile();


// Event listener to toggle the visibility of the avatar form
updateAvatarButton.addEventListener("click", toggleAvatarForm);


// Event listener to update/submitting the avatar form
avatarForm.addEventListener("submit", updateAvatar);