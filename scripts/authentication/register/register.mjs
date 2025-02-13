// Imports
import { AUTH_REGISTER_URL } from "../../constants.mjs";
import { isValidEmail, isValidPassword } from "../validate.mjs";
import { validateInput, attachValidation } from "../formValidations.mjs";
import { displayMessage } from "../../ui/displayMessage.mjs";


// Form, Input and Span elements
const registerForm = document.querySelector("#register-form");
const nameInput = document.querySelector("#name");
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
registerForm.appendChild(messageContainer);


/**
 * Sends a request to register a new user.
 *  * Clears input fields if registration fails.
 * @async
 * @param {Object} userDetails - The user registration data.
 * @param {string} userDetails.name - The user's name.
 * @param {string} userDetails.email - The user's email.
 * @param {string} userDetails.password - The user's password.
 * @returns {Promise<void>}
 */
async function registerUser(userDetails) {
  try {
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(AUTH_REGISTER_URL, fetchOptions);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Registration failed. Please try again.");
    }

    // Display Success message
    displayMessage(messageContainer, "Registration successful! Redirecting to login...", "success");

    // Redirects user to log in page after successful registration
    setTimeout(() => {
      window.location.href = "/account/login/index.html"; 
    }, 2000);

  } catch (error) {
    // Display error message
    displayMessage(messageContainer, error.message, "error");

    // Clear Input fields on failure
    nameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
  }
}


/**
 * Handles form submission for registration.
 * Validates input before sending data to registerUser().
 * @param {SubmitEvent} event - The form submit event.
 */
function onRegisterFormSubmit(event) {
  event.preventDefault();

  const emailValid = isValidEmail(emailInput.value.trim());
  const passwordValid = isValidPassword(passwordInput.value.trim());
  
  validateInput(emailInput, emailValid, emailError);
  validateInput(passwordInput, passwordValid, passwordError);

  if (!emailValid || !passwordValid) return;

  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData);
  registerUser(formFields);
}

// Checking for Form Submission
registerForm.addEventListener("submit", onRegisterFormSubmit);
