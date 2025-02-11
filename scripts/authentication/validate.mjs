// Reuseable validation functions

// For Email
export function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/.test(email);
}

//For Password
export function isValidPassword(password) {
  return password.length >= 8;
}