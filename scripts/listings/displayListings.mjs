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
    lastBidElement.classList.add("mt-2");
    lastBidElement.innerHTML = `<strong>Last bid:</strong> ${_count.bids}`;

    listingCard.appendChild(imageElement);
    listingCard.appendChild(titleElement);
    listingCard.appendChild(descriptionElement);
    listingCard.appendChild(bidEndsElement);
    listingCard.appendChild(lastBidElement);

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("mt-2", "hidden");
    listingCard.appendChild(messageContainer);

    /**
    * Auth-gated UI:
    * - Logged in (accessToken present): render an inline bid form with amount input + submit.
    * - Logged out: render a "Please Login To Bid" button that redirects to /account/login.
    */
    const accessToken = getFromLocalStorage("accessToken");

    if (accessToken) {
      const bidForm = document.createElement("form");
      bidForm.classList.add("mt-4", "mb-4");

      const formGroup = document.createElement("div");
      formGroup.classList.add("flex", "justify-center", "font-heading");

      const bidInput = document.createElement("input");
      bidInput.type = "number";
      bidInput.min = "1";
      bidInput.required = true;
      bidInput.placeholder = "Enter amount";
      bidInput.classList.add(
        "border", "px-2", "py-2", "text-sm", "rounded-full", "border-primaryColor"
      );

      const bidButton = document.createElement("button");
      bidButton.type = "submit";
      bidButton.textContent = "Place Bid";
      bidButton.classList.add(
        "px-6", "py-2", "bg-primaryColor", "text-backgroundColor",
        "rounded-full"
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

      /**
       * Show a temporary feedback message under the card.
       * @param {string} message
       */
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
      loginButton.textContent = "Please Login To Bid";
      loginButton.classList.add("mt-4", "mb-4", "px-2", "py-2", "bg-primaryColor", "text-backgroundColor", "rounded-full", "font-heading", "hover:font-bold");

      loginButton.addEventListener("click", () => {
        window.location.href = "/account/login";
      });
      
      listingCard.appendChild(loginButton);
    }

    listingsContainer.appendChild(listingCard);
  });
}