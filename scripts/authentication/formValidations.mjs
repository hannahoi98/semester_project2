/**
 * Update input + error state based on validity.
 * @param {HTMLInputElement|HTMLTextAreaElement} input
 * @param {boolean} isValid
 * @param {HTMLElement} errorElement
 */
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

/**
 * Add live validation to an input.
 * @param {HTMLInputElement|HTMLTextAreaElement} input
 * @param {(value: string) => boolean} validator
 * @param {HTMLElement} errorElement
 */
export function attachValidation(input, validator, errorElement) {
  input.addEventListener("input", () => {
    validateInput(input, validator(input.value), errorElement);
  });
}