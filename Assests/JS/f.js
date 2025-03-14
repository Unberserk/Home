document.addEventListener("DOMContentLoaded", function () {
    const linkInput = document.getElementById("linkInput");
    const imageInput = document.getElementById("imageInput");
    const addButton = document.getElementById("addButton");
    const linksContainer = document.getElementById("linksContainer");

    // Load saved links from local storage
    let links = JSON.parse(localStorage.getItem("savedLinks")) || [];

    // Function to save links to localStorage
    function saveLinks() {
        localStorage.setItem("savedLinks", JSON.stringify(links));
    }

    // Function to render the links
    function renderLinks() {
        linksContainer.innerHTML = ""; // Clear existing content
        links.forEach((link, index) => {
            const linkElement = document.createElement("div");
            linkElement.classList.add("link-item");

            // Create image element
            const imageElement = document.createElement("img");
            imageElement.classList.add("link-image");
            imageElement.src = link.image || "./Assests/Imgs/NoIcon.png";
            imageElement.onerror = function () {
                this.src = "./Assests/Imgs/NoIcon.png"; // Fallback image if the image URL is invalid
            };

            // Create title element
            const titleElement = document.createElement("span");
            titleElement.classList.add("link-title");
            titleElement.textContent = link.title || "Untitled Link";
            
            // Set the title to be clickable and redirect to the URL
            titleElement.style.cursor = "pointer";
            titleElement.addEventListener("click", () => {
                window.location.href = link.url;
            });

            // Create remove button (X)
            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-btn");
            removeButton.textContent = "X";
            removeButton.addEventListener("click", () => {
                links.splice(index, 1); // Remove the link from the array
                saveLinks(); // Save the updated array
                renderLinks(); // Re-render the links
            });

            // Append the elements to the link item
            linkElement.appendChild(imageElement);
            linkElement.appendChild(titleElement);
            linkElement.appendChild(removeButton);

            // Add the link item to the container
            linksContainer.appendChild(linkElement);
        });
    }

    // Add new link to the list
    addButton.addEventListener("click", () => {
        const linkUrl = linkInput.value.trim();
        const imageUrl = imageInput.value.trim();
        const title = linkInput.dataset.title || linkUrl; // Use URL as title if no title is set

        // If the link and image URL are provided, save the new link
        if (linkUrl && imageUrl) {
            const newLink = {
                url: linkUrl,
                title: title,
                image: imageUrl
            };

            links.push(newLink); // Add new link to the array
            saveLinks(); // Save the updated links
            renderLinks(); // Re-render the links

            // Clear the input fields
            linkInput.value = "";
            imageInput.value = "";
            linkInput.dataset.title = ""; // Clear title input field
        }
    });

    // Initialize the page with any saved links
    renderLinks();
});