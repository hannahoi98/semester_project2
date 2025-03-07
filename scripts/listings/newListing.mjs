import { GET_LISTINGS_URL } from "../apiEndpoints.mjs";
import { API_KEY } from "../apiEndpoints.mjs";
import { getFromLocalStorage } from "../localStorage.mjs";

// DOM Elements
const form = document.getElementById("new-listing-form");
const messageContainer = document.getElementById("message-container");

// Event listener for form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent page reload

  // Get form values
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const imageUrl = document.getElementById("image-url").value.trim();
  const imageAlt = document.getElementById("avatar-alt-text").value.trim();
  const deadline = document.getElementById("deadline").value;

  // Clear previous messages
  messageContainer.classList.add("hidden");
  messageContainer.textContent = "";

  // Gettin accesstoken from local storage
  const accessToken = getFromLocalStorage("accessToken");


  // Validate required fields
  if (!title || !description || !imageUrl || !imageAlt || !deadline) {
    displayMessage("All fields are required.", "error");
    return;
  }

  // Format data for API
  const requestData = {
    title: title,
    description: description,
    media: [{ url: imageUrl, alt: imageAlt }],
    endsAt: new Date(deadline).toISOString(),
  };

  try {
    // Send POST request to API
    const response = await fetch(GET_LISTINGS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create listing");
    }


    displayMessage("Listing created successfully!", "success");
    form.reset();


    setTimeout(() => {
      window.location.href = "/";
    }, 5000);
  } catch (error) {
    displayMessage(`Error: ${error.message}`, "error");
  }
});

// Function to display messages
function displayMessage(message, type) {
  messageContainer.textContent = message;
  messageContainer.classList.remove("hidden");

  if (type === "success") {
    messageContainer.classList.add("bg-green-200", "text-green-800", "border", "border-green-600");
  } else {
    messageContainer.classList.add("bg-red-200", "text-red-800", "border", "border-red-600");
  }
}
