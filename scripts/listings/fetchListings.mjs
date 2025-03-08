// Imports
import { GET_LISTINGS_URL } from "../apiEndpoints.mjs";
import { displayListings } from "./displayListings.mjs";
import { setupPagination } from "./pagination.mjs";


// Settings for pagination
const itemsPerPage = 12;
let currentPage = 1;


/**
 * Fetches active listings from the API and displays them.
 * @param {number} [page=1] - The page number to fetch.
 * @returns {Promise<void>}
 */
export async function fetchListings(page = 1) {
  try {
    const url = `${GET_LISTINGS_URL}?limit=${itemsPerPage}&page=${page}&_active=true&sort=created&sortOrder=desc`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch listings.");

    const data = await response.json();

    // Filter out listings with missing required fields
    const validListings = data.data.filter((listing) =>
      listing.title &&
      listing.description &&
      listing.media?.length > 0 &&
      listing.endsAt
    );

    if (validListings.length === 0 && page === 1) {
      document.getElementById("listings-container").innerHTML = `<p class="mt-4">No valid listings found</p>`;
    } else {
      displayListings(validListings);
    }

    const totalListings = data.meta.totalCount || validListings.length;
    setupPagination(totalListings, page);
  } catch (error) {
    document.getElementById("listings-container").textContent = `Error: ${error.message}`;
  }
}

export function getCurrentPage() {
  return currentPage;
}

export function setCurrentPage(page) {
  currentPage = page;
}




