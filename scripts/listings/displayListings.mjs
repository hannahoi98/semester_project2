// Imports
import { getFromLocalStorage } from "../localStorage.mjs";
import { placeBid } from "./placeBid.mjs";

/**
 * Displays listings on the page.
 * @param {Array<Object>} listings - Array of listing objects from the API.
 */
 export function displayListings(listings) {
  const listingsContainer = document.getElementById("listings-container");
  
  listings.forEach((listing) => {
    const { id, title, media, endsAt, _count, description } = listing;

    const imageUrl = media && media.length > 0 ? media[0].url : "default-image.jpg";
    const imageAlt = media && media.length > 0 ? media[0].alt : "No image available";
    const formattedDate = new Date(endsAt).toLocaleDateString("en-GB");

    const listingCard = document.createElement("div");
    listingCard.classList.add("listing-card", "border", "border-textColor", "rounded-lg", "text-center");

    const imageElement = document.createElement("img");
    imageElement.classList.add("object-cover", "rounded-lg");
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
    bidEndsElement.innerHTML = `<strong>Bids end:</strong> ${formattedDate}`;

    const lastBidElement = document.createElement("p");
    lastBidElement.classList.add("mt-1");
    lastBidElement.innerHTML = `<strong>Last bid:</strong> ${_count.bids}`;

    listingCard.appendChild(imageElement);
    listingCard.appendChild(titleElement);
    listingCard.appendChild(descriptionElement);
    listingCard.appendChild(bidEndsElement);
    listingCard.appendChild(lastBidElement);

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("mt-2", "hidden");
    listingCard.appendChild(messageContainer);

    const accessToken = getFromLocalStorage("accessToken");

    if (accessToken) {
      const bidForm = document.createElement("form");
      bidForm.classList.add("mt-4", "mb-4", "rounded-full");

      const formGroup = document.createElement("div");
      formGroup.classList.add("flex", "justify-center");

      const bidInput = document.createElement("input");
      bidInput.type = "number";
      bidInput.min = "1";
      bidInput.required = true;
      bidInput.placeholder = "Enter bid amount";
      bidInput.classList.add(
        "border", "p-3", "text-sm", "w-full",
        "rounded-t-full"
      );

      const bidButton = document.createElement("button");
      bidButton.type = "submit";
      bidButton.textContent = "Place Bid";
      bidButton.classList.add(
        "px-6", "py-3", "bg-primaryColor", "text-white",
        "rounded-r-lg"
      );

      formGroup.appendChild(bidInput);
      formGroup.appendChild(bidButton);
      bidForm.appendChild(formGroup);

      bidForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const bidAmount = parseFloat(bidInput.value);

        if (isNaN(bidAmount) || bidAmount <= 0) {
          showMessage("Please enter a valid bid amount.", "error");
          return;
        }

        const success = await placeBid(id, bidAmount);
        if (success) {
          showMessage("Bid placed successfully!", "success");
          bidInput.value = "";
        } else {
          showMessage("Failed to place bid. Please try again.", "error");
        }
      });

      function showMessage(message) {
        messageContainer.textContent = message;
        messageContainer.classList.remove("hidden");

        setTimeout(() => {
          messageContainer.classList.add("hidden");
        }, 3000);
      }
      listingCard.appendChild(bidForm);
    } else {
      const loginButton = document.createElement("button");
      loginButton.textContent = "Please log in to bid";
      loginButton.classList.add("mt-4", "px-4", "py-2", "bg-secondaryColor", "text-white", "rounded-full");
      loginButton.addEventListener("click", () => {
        window.location.href = "/account/login";
      });
      listingCard.appendChild(loginButton);
    }


    listingsContainer.appendChild(listingCard);
  });
}