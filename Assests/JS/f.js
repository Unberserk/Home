// Function to render a single link
function renderLink(linkData) {
    const linkContainer = document.getElementById("link-container");

    const linkDiv = document.createElement("div");
    linkDiv.classList.add("link-entry");
    linkDiv.id = linkData.url; // Setting unique ID for each link

    const img = document.createElement("img");
    img.src = linkData.image;
    img.alt = linkData.title;
    img.classList.add("link-image");

    // Add click event to image to open iframe
    img.addEventListener("click", function () {
        openIframe(linkData.url); // Open iframe when the image is clicked
    });

    // Add remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-link-btn");

    removeBtn.addEventListener("click", function () {
        removeLink(linkData); // Call removeLink when clicked
    });

    linkDiv.appendChild(img);
    linkDiv.appendChild(removeBtn);

    linkContainer.appendChild(linkDiv);
}

// Function to remove all links
function removeAllLinks() {
    localStorage.clear();
    document.getElementById("link-container").innerHTML = ""; // Clear all links from DOM
}
