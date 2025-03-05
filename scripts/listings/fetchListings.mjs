// Imports
import { GET_LISTINGS_URL } from "../apiEndpoints.mjs";


// DOM Elements
const listingsContainer = document.getElementById("listings-container");
const paginationContainer = document.getElementById("pagination");


// Settings for pagination
const itemsPerPage = 12;
let currentPage = 1;


async function fetchListings(page = 1) {
  try {
    currentPage = page;
    const offset = (page - 1) * itemsPerPage;

    const url = `${GET_LISTINGS_URL}?limit=${itemsPerPage}&offset=${offset}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch listings.");

    const data = await response.json();

    const now = new Date();

    const activeListings = data.data.filter(listing => new Date(listing.endsAt) > now);

    const sortedListings = activeListings.sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));

    displayListings(sortedListings);

    setupPagination(data.meta.pageCount, currentPage);
  } catch (error) {
    listingsContainer.textContent = `Error: ${error.message}`;
  }
}


function displayListings(listings) {
  listingsContainer.innerHTML = "";

  listings.forEach(listing => {
    const { title, media, endsAt, _count } = listing;

    const imageUrl = media && media.length > 0 ? media[0].url : "default-image.jpg";
    const imageAlt = media && media.length > 0 ? media[0].alt : "No image available";

    const formattedDate = new Date(endsAt).toLocaleDateString("en-GB");

    const listingCard = document.createElement("div");
    listingCard.classList.add("listing-card", "border", "rounded-lg", "p-4", "shadow-lg");

    const titleElement = document.createElement("h2");
    titleElement.classList.add("text-xl", "font-bold");
    titleElement.textContent = title;

    const imageElement = document.createElement("img");
    imageElement.classList.add("w-26", "h-26", "object-cover", "rounded", "mt-2");
    imageElement.src = imageUrl;
    imageElement.alt = imageAlt;

    const bidEndsElement = document.createElement("p");
    bidEndsElement.classList.add("mt-2");
    bidEndsElement.innerHTML = `Bids end: <strong>${formattedDate}</strong>`;

    const lastBidElement = document.createElement("p");
    lastBidElement.classList.add("mt-1");
    lastBidElement.innerHTML = `Last bid: <strong>${_count.bids}</strong>`;

    listingCard.appendChild(titleElement);
    listingCard.appendChild(imageElement);
    listingCard.appendChild(bidEndsElement);
    listingCard.appendChild(lastBidElement);

    listingsContainer.appendChild(listingCard);
  });
}

function setupPagination(totalCount, currentPage) {
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.add("px-4", "py-2", "border", "rounded");

    if (i === currentPage) {
      pageButton.classList.add("bg-primaryColor", "text-white");
    } else {
      pageButton.classList.add("bg-gray-200");
    }

    pageButton.addEventListener("click", () => {
      fetchListings(i);
    });

    paginationContainer.appendChild(pageButton);
  }
}

fetchListings();



