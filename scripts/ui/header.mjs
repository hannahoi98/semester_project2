import { getFromLocalStorage, removeFromLocalStorage } from "../localStorage.mjs";

// Selecting elements

const dropdownMenu = document.querySelector("#dropdown-menu");
const dropdownList = document.querySelector("#dropdown-list");
const userMenuContainer = document.querySelector("#user-menu-container");


/**
 * Toggles the visibility of the dropdown menu.
 */
function toggleDropdown() {
  dropdownMenu.classList.toggle("hidden");
}


/**
 * Handles user logout with confirmation.
 * Removes the access token and redirects to the login page upon confirmation.
 */
function handleLogout() {
  const confirmLogout = confirm("Are you sure you want to log out?");

  if (confirmLogout){
    removeFromLocalStorage("accessToken");
    window.location.href = "/account/login/";
  }
}

// Function to create menu items
function createMenuItem(text, href, isButton = false) {
  const li = document.createElement("li");
  li.className = "hover:underline";
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
    link.className = "block px-4 py-2";
    li.appendChild(link);
  }
  return li;
}


/**
 * Updates the dropdown menu based on the user's login status.
 */
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

// Add event listeners
userMenuContainer.addEventListener("click", toggleDropdown);

// Close dropdown when clicking outside of it
document.addEventListener("click", (e) => {
  if (!userMenuContainer.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.add("hidden");
  }
});

// Call the menu updater immediately
updateMenu();