export function validateInput(input, isValid, errorElement) {
  if (isValid) {
    input.classList.remove("border-primaryColor", "focus:ring-primaryColor");
    input.classList.add("border-successColor", "focus:ring-successColor");
    errorElement.classList.add("hidden");
  } else {
    input.classList.remove("border-successColor", "focus:ring-successColor");
    input.classList.add("border-primaryColor", "focus:ring-primaryColor");
    errorElement.classList.remove("hidden");
  }
}

export function attachValidation(input, validator, errorElement) {
  input.addEventListener("input", () => {
    validateInput(input, validator(input.value), errorElement);
  });
}

