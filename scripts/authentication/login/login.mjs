// Imports
import { AUTH_LOGIN_URL } from "../../constants.mjs";
import { isValidEmail, isValidPassword } from "../validate.mjs";
import { validateInput, attachValidation } from "../formValidations.mjs";
import { displayMessage } from "../../ui/displayMessage.mjs";

// Local Storage
function addToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

function getFromLocalStorage(key) {
  return localStorage.getItem(key)
}

// Form, Input and Span elements
const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");


//Attaching Validation To Inputs
attachValidation(emailInput, isValidEmail, emailError);
attachValidation(passwordInput, isValidPassword, passwordError);


// Creating a container for success/error messages
const messageContainer = document.createElement("p");
messageContainer.classList.add("text-md", "mt-4", "hidden");
loginForm.appendChild(messageContainer);


/**
 * Sends a request to login a user.
 *  * Clears input fields if login fails.
 * @async
 * @param {Object} userDetails - The user login data.
 * @param {string} userDetails.email - The user's email.
 * @param {string} userDetails.password - The user's password.
 * @returns {Promise<void>}
 */
async function loginUser(userDetails) {
  try {
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(AUTH_LOGIN_URL, fetchOptions);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || "Login failed. Please try again.");
    }

    const accessToken = json.data.accessToken;
    if (!accessToken) {
      throw new Error("No access token received. Please try again.");
    }
    addToLocalStorage("accessToken", accessToken);

    const storedToken = getFromLocalStorage("accessToken");
    if (!storedToken) {
      throw new Error("Failed to store access token. Please try again.");
    }

    // Display Success message
    displayMessage(messageContainer, "Login successful! Redirecting to your profile...", "success");

    // Redirects user to log in page after successful registration
    setTimeout(() => {
      window.location.href = "/account/profile"; 
    }, 2000);

  } catch (error) {
    // Display error message
    displayMessage(messageContainer, error.message, "error");

    // Clear Input fields on failure
    emailInput.value = "";
    passwordInput.value = "";
  }
}


/**
 * Handles form submission for login.
 * Validates input before sending data to loginUser().
 * @param {SubmitEvent} event - The form submit event.
 */
function onLoginFormSubmit(event) {
  event.preventDefault();

  const emailValid = isValidEmail(emailInput.value.trim());
  const passwordValid = isValidPassword(passwordInput.value.trim());
  
  validateInput(emailInput, emailValid, emailError);
  validateInput(passwordInput, passwordValid, passwordError);

  if (!emailValid || !passwordValid) {
    displayMessage(messageContainer, "Please enter a valid email and password.", "error");
    return;
  }

  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData);
  loginUser(formFields);
}

// Checking for Form Submission
loginForm.addEventListener("submit", onLoginFormSubmit);