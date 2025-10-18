import { getFromLocalStorage, removeFromLocalStorage } from "../localStorage.mjs";

/** @type {HTMLElement|null} */
const dropdownMenu = document.querySelector("#dropdown-menu");
/** @type {HTMLElement|null} */
const dropdownList = document.querySelector("#dropdown-list");
/** @type {HTMLElement|null} */
const userMenuContainer = document.querySelector("#user-menu-container");

/** Toggle the visibility of the user dropdown. */
function toggleDropdown() {
  dropdownMenu.classList.toggle("hidden");
}

/** Confirm and log the user out; clears token and redirects to login. */
function handleLogout() {
  const confirmLogout = confirm("Are you sure you want to log out?");
  if (confirmLogout){
    removeFromLocalStorage("accessToken");
    window.location.href = "/account/login/";
  }
}

/**
 * Create a menu item (link or button).
 * @param {string} text - Visible label.
 * @param {string} href - Link target (ignored for button).
 * @param {boolean} [isButton=false] - If true, renders a logout button.
 * @returns {HTMLLIElement}
 */
function createMenuItem(text, href, isButton = false) {
  const li = document.createElement("li");
  if (isButton) {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = "block w-full px-4 py-2 hover:underline";
    button.addEventListener("click", handleLogout);
    li.appendChild(button);
  } else {
    const link = document.createElement("a");
    link.textContent = text;
    link.href = href;
    link.className = "block px-4 py-2 hover:underline";
    li.appendChild(link);
  }
  return li;
}

/** Populate dropdown options based on auth state. */
function updateMenu() {
  dropdownList.innerHTML = "";

  const accessToken = getFromLocalStorage("accessToken");

  if (accessToken) {
    dropdownList.appendChild(createMenuItem("My Profile", "/account/profile/"));
    dropdownList.appendChild(createMenuItem("New Listing", "/listing/new/"));
    dropdownList.appendChild(createMenuItem("Logout", "", true));
  } else {
    dropdownList.appendChild(createMenuItem("Login", "/account/login/"));
    dropdownList.appendChild(createMenuItem("Register", "/account/register/"));
  }

  dropdownMenu.appendChild(dropdownList);
}

/** Open/close on avatar/menu click. */
userMenuContainer.addEventListener("click", toggleDropdown);

/** Close when clicking outside the menu. */
document.addEventListener("click", (e) => {
  if (!userMenuContainer.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.add("hidden");
  }
});

/** Initialize dropdown content. */
updateMenu();