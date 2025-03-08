// Imports
import { GET_LISTINGS_URL } from "../apiEndpoints.mjs";
import { getFromLocalStorage } from "../localStorage.mjs";
import { API_KEY } from "../apiEndpoints.mjs";


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