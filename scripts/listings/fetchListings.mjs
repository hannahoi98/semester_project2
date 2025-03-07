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

    if (validListings.length === 0) {
      listingsContainer.innerHTML = `<p class="mt-4">No valid listings found</p>`;
    } else {
      displayListings(validListings);
    }

    const totalListings = data.meta.totalCount || validListings.length;
    setupPagination(Math.ceil(totalListings / itemsPerPage));
  } catch (error) {
    listingsContainer.textContent = `Error: ${error.message}`;
  }
}



function displayListings(listings) {
  listings.forEach((listing) => {
    const { title, media, endsAt, _count, description } = listing;

    const imageUrl = media && media.length > 0 ? media[0].url : "default-image.jpg";
    const imageAlt = media && media.length > 0 ? media[0].alt : "No image available";

    const formattedDate = new Date(endsAt).toLocaleDateString("en-GB");

    const listingCard = document.createElement("div");
    listingCard.classList.add("listing-card", "border", "border-textColor", "rounded-lg");

    const imageElement = document.createElement("img");
    imageElement.classList.add("max-w-28", "max-h-8", "object-cover", "rounded-lg");
    imageElement.src = imageUrl;
    imageElement.alt = imageAlt;

    const titleElement = document.createElement("h2");
    titleElement.classList.add("text-lg", "font-heading", "mt-2");
    titleElement.textContent = title;

    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("mt-2");
    descriptionElement.textContent = description;

  
    const bidEndsElement = document.createElement("p");
    bidEndsElement.classList.add("mt-2");
    bidEndsElement.innerHTML = `Bids end: <strong>${formattedDate}</strong>`;

    const lastBidElement = document.createElement("p");
    lastBidElement.classList.add("mt-1");
    lastBidElement.innerHTML = `Last bid: <strong>${_count.bids}</strong>`;

    listingCard.appendChild(imageElement);
    listingCard.appendChild(titleElement);
    listingCard.appendChild(descriptionElement);
    listingCard.appendChild(bidEndsElement);
    listingCard.appendChild(lastBidElement);

    listingsContainer.appendChild(listingCard);
  });
}


function setupPagination(totalPages) {
  paginationContainer.innerHTML = "";

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



