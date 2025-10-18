import { GET_LISTINGS_URL } from "../apiEndpoints.mjs";
import { displayListings } from "./displayListings.mjs";
import { setupPagination } from "./pagination.mjs";

/** Number of items per page for listings pagination. */
const itemsPerPage = 12;
/** Current page index (1-based). */
let currentPage = 1;

/**
 * Fetch active listings and render them.
 * Filters out listings missing required fields, renders a fallback message
 * when the first page is empty, and wires pagination using totalCount.
 *
 * @param {number} [page=1] - Page number to fetch (1-based).
 * @returns {Promise<void>}
 */
export async function fetchListings(page = 1) {
  try {
    const url = `${GET_LISTINGS_URL}?limit=${itemsPerPage}&page=${page}&_active=true&sort=created&sortOrder=desc`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch listings.");

    const data = await response.json();

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

/** Get the current listings page (1-based). */
export function getCurrentPage() {
  return currentPage;
}

/**
 * Set the current listings page (1-based).
 * @param {number} page
 */
export function setCurrentPage(page) {
  currentPage = page;
}