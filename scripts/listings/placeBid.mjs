import { GET_LISTINGS_URL } from "../apiEndpoints.mjs";
import { getFromLocalStorage } from "../localStorage.mjs";
import { API_KEY } from "../apiEndpoints.mjs";

/**
 * Place a bid on a listing.
 *
 * Requires a valid access token in localStorage.
 *
 * @async
 * @param {string} listingId - The ID of the listing to bid on.
 * @param {number} amount - The bid amount (must be a positive number).
 * @returns {Promise<boolean>} Resolves to `true` on success, `false` on failure or missing token.
 */
export async function placeBid(listingId, amount) {
  const accessToken = getFromLocalStorage("accessToken");
  if (!accessToken) {
    return false;
  }

  try {
    const response = await fetch(`${GET_LISTINGS_URL}/${listingId}/bids`, {
      method: "POST",
      headers: {
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,

      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}