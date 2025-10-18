import { fetchListings, getCurrentPage, setCurrentPage } from "./fetchListings.mjs";

/**
 * Render a "Show More" pagination control and wire it to fetch the next page.
 *
 * Calculates total pages from the total number of listings and a fixed
 * items-per-page value, then shows a button if more pages are available.
 *
 * @param {number} totalListings - Total number of listings across all pages.
 */
export function setupPagination(totalListings) {
  /** @type {HTMLElement|null} */
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  /** @type {number} */
  const itemsPerPage = 12;
  /** @type {number} */
  const totalPages = Math.ceil(totalListings / itemsPerPage);
  /** @type {number} */
  let currentPage = getCurrentPage();

  if (currentPage < totalPages) {
    const showMoreButton = document.createElement("button");
    showMoreButton.textContent = "Show More";
    showMoreButton.classList.add(
      "px-6", "py-2", "bg-primaryColor", "font-heading", "text-backgroundColor",
      "text-lg", "rounded-full", "mt-4", "mb-4"
    );

    showMoreButton.addEventListener("click", () => {
      setCurrentPage(currentPage + 1);
      fetchListings(currentPage + 1);
    });

    paginationContainer.appendChild(showMoreButton);
  }
}