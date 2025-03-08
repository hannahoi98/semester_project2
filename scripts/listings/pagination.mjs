// Imports
import { fetchListings, getCurrentPage, setCurrentPage } from "./fetchListings.mjs";

/**
 * Sets up the "Show More" pagination button.
 * @param {number} totalPages - The total number of pages available.
 * @param {Function} fetchListings - The function to fetch listings.
 */
export function setupPagination(totalListings) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const itemsPerPage = 12;
  const totalPages = Math.ceil(totalListings / itemsPerPage);
  let currentPage = getCurrentPage();

  if (currentPage < totalPages) {
    const showMoreButton = document.createElement("button");
    showMoreButton.textContent = "Show More";
    showMoreButton.classList.add(
      "px-6", "py-4", "bg-primaryColor", "font-heading", "text-backgroundColor",
      "text-lg", "rounded-full", "mt-4", "mb-4"
    );

    showMoreButton.addEventListener("click", () => {
      setCurrentPage(currentPage + 1);
      fetchListings(currentPage + 1);
    });

    paginationContainer.appendChild(showMoreButton);
  }
}

