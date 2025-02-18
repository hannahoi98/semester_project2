import { getFromLocalStorage, removeFromLocalStorage } from "../localStorage.mjs";

// Selecting elements
const userMenuButton = document.querySelector("#user-menu-button");
const dropdownMenu = document.querySelector("#dropdown-menu");
const dropdownList = document.querySelector("#dropdown-list");

// Function to toggle dropdown menu
function toggleDropdown() {
  dropdownMenu.classList.toggle("hidden");
}

// Function to handle logout and redirect to login-page
function handleLogout() {
  removeFromLocalStorage("accessToken");
  window.location.href = "/account/login/";
}

// Function to create menu items
function createMenuItem(text, href, isButton = false) {
  const li = document.createElement("li");
  if (isButton) {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = "block w-full text-left px-4 py-2 text-sm hover:underline";
    button.addEventListener("click", handleLogout);
    li.appendChild(button);
  } else {
    const link = document.createElement("a");
    link.textContent = text;
    link.href = href;
    link.className = "block px-4 py-2 text-sm hover:underline";
    li.appendChild(link);
  }
  return li;
}

// Function to update the menu based on login status
function updateMenu() {
  dropdownList.innerHTML = "";

  const accessToken = getFromLocalStorage("accessToken");

  if (accessToken) {
    dropdownList.appendChild(createMenuItem("My Profile", "/account/profile/"));
    dropdownList.appendChild(createMenuItem("Logout", "", true));
  } else {
    dropdownList.appendChild(createMenuItem("Login", "/account/login/"));
    dropdownList.appendChild(createMenuItem("Register", "/account/register/"));
  }

  dropdownMenu.appendChild(dropdownList);
}

// Add event listeners
userMenuButton.addEventListener("click", toggleDropdown);
document.addEventListener("click", (e) => {
  if (!dropdownMenu.contains(e.target) && e.target !== userMenuButton) {
    dropdownMenu.classList.add("hidden");
  }
});

// Call the menu updater immediately
updateMenu();