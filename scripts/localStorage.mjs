export function getFromLocalStorage(key) {
   return localStorage.getItem(key);
}

export function removeFromLocalStorage(key) {
  localStorage.removeItem(key);
}

