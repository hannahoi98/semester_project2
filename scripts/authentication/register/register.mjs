import { AUTH_REGISTER_URL } from "../../constants.mjs";
import { isValidEmail, isValidPassword } from "../validate.mjs";
import { validateInput, attachValidation } from "../formValidations.mjs";


const registerForm = document.querySelector("#register-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");

//Attaching Validation To Inputs
attachValidation(emailInput, isValidEmail, emailError);
attachValidation(passwordInput, isValidPassword, passwordError);

//Form Submission
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
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

function onRegisterFormSubmit(event) {
  event.preventDefault();

  const emailValid = isValidEmail(emailInput.value.trim());
  const passwordValid = isValidPassword(passwordInput.value.trim());
  
  // Validate before submitting
  validateInput(emailInput, emailValid, emailError);
  validateInput(passwordInput, passwordValid, passwordError);

  if (!emailValid || !passwordValid) return;


  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData);
  registerUser(formFields);
}

registerForm.addEventListener("submit", onRegisterFormSubmit);
