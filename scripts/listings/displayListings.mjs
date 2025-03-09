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

    // Creating listing card element
    const listingCard = document.createElement("div");
    listingCard.classList.add("listing-card", "border", "border-textColor", "rounded-lg", "text-center");

    // Creating the image element
    const imageElement = document.createElement("img");
    imageElement.classList.add("object-cover", "rounded-lg");
    imageElement.src = imageUrl;
    imageElement.alt = imageAlt;

    // Creating the title element
    const titleElement = document.createElement("h2");
    titleElement.classList.add("text-lg", "font-heading", "mt-2");
    titleElement.textContent = title;

    // Creating the decription element
    const descriptionElement = document.createElement("p");
    descriptionElement.classList.add("mt-2");
    descriptionElement.textContent = description;

    // Creating end date element
    const bidEndsElement = document.createElement("p");
    bidEndsElement.classList.add("mt-2");
    bidEndsElement.innerHTML = `<strong>Bids end:</strong> ${formattedDate}`;

    // Creating and showing the last bid to the listing
    const lastBidElement = document.createElement("p");
    lastBidElement.classList.add("mt-2");
    lastBidElement.innerHTML = `<strong>Last bid:</strong> ${_count.bids}`;

    // Appening all elements to the listing card
    listingCard.appendChild(imageElement);
    listingCard.appendChild(titleElement);
    listingCard.appendChild(descriptionElement);
    listingCard.appendChild(bidEndsElement);
    listingCard.appendChild(lastBidElement);

    // Creating a hidden container to display messages
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("mt-2", "hidden");
    listingCard.appendChild(messageContainer);

    // Getting the accesstoken from local storage to check if the user is logged in
    const accessToken = getFromLocalStorage("accessToken");

    // Creating bid form if the accesstoken is in local storage
    if (accessToken) {
      const bidForm = document.createElement("form");
      bidForm.classList.add("mt-4", "mb-4");

      // Create a form group for styling the input and button
      const formGroup = document.createElement("div");
      formGroup.classList.add("flex", "justify-center", "font-heading");

      // Create input field
      const bidInput = document.createElement("input");
      bidInput.type = "number";
      bidInput.min = "1";
      bidInput.required = true;
      bidInput.placeholder = "Enter amount";
      bidInput.classList.add(
        "border", "px-2", "py-2", "text-sm", "rounded-full", "border-primaryColor"
      );

      // Creating button to submit the bid
      const bidButton = document.createElement("button");
      bidButton.type = "submit";
      bidButton.textContent = "Place Bid";
      bidButton.classList.add(
        "px-6", "py-2", "bg-primaryColor", "text-backgroundColor",
        "rounded-full"
      );

      // Appending the input and button to the form group, and then appending the form group to the form
      formGroup.appendChild(bidInput);
      formGroup.appendChild(bidButton);
      bidForm.appendChild(formGroup);

      // Event listener for submitting bid
      bidForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const bidAmount = parseFloat(bidInput.value);

        // Attempt to place the bid and show a success or failure message
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

      // Function to show message to the user
      function showMessage(message) {
        messageContainer.textContent = message;
        messageContainer.classList.remove("hidden");

        // Hiding message after 3 seconds
        setTimeout(() => {
          messageContainer.classList.add("hidden");
        }, 3000);
      }

      // Append the bid form to the listing card
      listingCard.appendChild(bidForm);
    } else {
      // If the user is not logged in, show a login button
      const loginButton = document.createElement("button");
      loginButton.textContent = "Please log in to bid";
      loginButton.classList.add("mt-4", "mb-4", "px-2", "py-2", "bg-primaryColor", "text-backgroundColor", "rounded-full", "font-heading");

      // Redirect to the login page when the login button is clicked
      loginButton.addEventListener("click", () => {
        window.location.href = "/account/login";
      });
      // Appending the login button to the listing card
      listingCard.appendChild(loginButton);
    }

    // Appending listing card to the listings container
    listingsContainer.appendChild(listingCard);
  });
}