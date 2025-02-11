export function validateInput(input, isValid, errorElement) {
  if (isValid) {
    input.classList.remove("border-red-500", "focus:ring-red-500");
    input.classList.add("border-success", "focus:ring-success");
    errorElement.classList.add("hidden");
  } else {
    input.classList.remove("border-success", "focus:ring-success");
    input.classList.add("border-red-500", "focus:ring-red-500");
    errorElement.classList.remove("hidden");
  }
}

export function attachValidation(input, validator, errorElement) {
  input.addEventListener("input", () => {
    validateInput(input, validator(input.value), errorElement);
  });
}

