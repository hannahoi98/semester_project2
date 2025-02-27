// Imports
import { API_KEY, AUTH_PROFILE_URL } from "../apiEndpoints.mjs";
import { getFromLocalStorage } from "../localStorage.mjs";


// DOM Elements
const updateAvatarButton = document.getElementById("update-avatar-button");
const avatarForm = document.getElementById("avatar-form");
const avatarImage = document.getElementById("avatar-image");
const avatarUrlInput = document.getElementById("avatar-url");
const avatarAltInput = document.getElementById("avatar-alt-text");
const profileMessage = document.getElementById("profile-message");


/**
 * Toggles the visibility of the avatar update form.
 */
function toggleAvatarForm() {
  avatarForm.classList.toggle("hidden");
}


/**
 * Updates the users avatar by sending a PUT request to API
 * Displays success or error messages and refreshes the page after a successful update.
 * 
 * @param {Event} event - The form submit event
 * 
 */
async function updateAvatar(event) {
  //Preventing default behaviour of the form
  event.preventDefault();

  // Clearing any earlier user errors
  clearUserError();

  // Retrieveing username and accesstoken from local storage
  const userName = getFromLocalStorage("userName");
  const accessToken = getFromLocalStorage("accessToken");

  // Cheks if the user is logged in
  if (!userName || !accessToken) {
    displayUserError("You must be logged in to update your avatar.");
    return;
  }

  // Get input values
  const newAvatarUrl = avatarUrlInput.value.trim();
  const newAvatarAlt = avatarAltInput.value.trim();

  // Checking that both url and alt text is provided
  if (!newAvatarUrl || !newAvatarAlt) {
    displayUserError("Please enter both an image URL and alt text.");
    return;
  }

  // Replaces placeholder with the actual username in the API URL
  const url = AUTH_PROFILE_URL.replace("<name>", userName);

  // Creating the request
  const requestBody = {
    avatar: {
      url: newAvatarUrl,
      alt: newAvatarAlt,
    },
  };

  try {
    // Sending the PUT request to the API to update the avatar
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    // Handles errors if the request fails
    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg =
        errorData.errors?.[0]?.message || "Failed to update avatar.";
      displayUserError(errorMsg);
      return;
    }

    const data = await response.json();

    // Updating the avatar image on the page
    avatarImage.src = data.data.avatar.url;
    avatarImage.alt = data.data.avatar.alt;

    // Clear input fields and hide the form after successful update
    avatarUrlInput.value = "";
    avatarAltInput.value = "";
    avatarForm.classList.add("hidden");

    // Displays success message
    displaySuccessMessage("Avatar updated successfully!");

    // Refreshes page after 3 seconds to show new avatar
    setTimeout(() => {
      location.reload();
    }, 3000);
  } catch  {
    // Handling network errors
    displayUserError("Network error. Please try again later.");
  }
}


/**
 * Displays and error message to the user
 * The message dissapears after 3 seconds
 * 
 * @param {string} message - The error message to display for the user
 */
function displayUserError(message) {
  profileMessage.textContent = message;

  setTimeout(() => {
    clearUserError();
  }, 3000);
}


/**
 * Displays a success message to the user.
 * 
 * @param {string} message - The success message to display to the user.
 */
function displaySuccessMessage(message) {
  profileMessage.textContent = message;
}


/**
 * Clears any displayed error messages.
 */
function clearUserError() {
  profileMessage.textContent = "";
  profileMessage.className = "";
}

// Event Listeners
updateAvatarButton.addEventListener("click", toggleAvatarForm);
avatarForm.addEventListener("submit", updateAvatar);

// Exporting functions to use in profile
export { toggleAvatarForm, updateAvatar };