document.addEventListener("DOMContentLoaded", function () {
    const linkInput = document.getElementById("linkInput");
    const addButton = document.getElementById("addButton");
    const linksContainer = document.getElementById("linksContainer");

    // Load saved links from local storage
    let links = JSON.parse(localStorage.getItem("savedLinks")) || [];

    function saveLinks() {
        localStorage.setItem("savedLinks", JSON.stringify(links));
    }

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
                this.src = "./Assests/Imgs/NoIcon.png"; // Fallback image
            };

            // Create title element that redirects when clicked
            const titleElement = document.createElement("a");
            titleElement.classList.add("link-title");
            titleElement.href = link.url;
            titleElement.target = "_blank"; // Open in a new tab
            titleElement.textContent = link.title || link.url; // Show title if available, otherwise show URL

            // Create remove button (simple "X")
            const removeButton = document.createElement("button");
            removeButton.classList.add("remove-button");
            removeButton.textContent = "X"; // "X" to remove the link
            removeButton.onclick = () => {
                links.splice(index, 1); // Remove the link from the array
                saveLinks(); // Save updated links
                renderLinks(); // Re-render the list
            };

            // Append elements to the link container
            linkElement.appendChild(imageElement);
            linkElement.appendChild(titleElement);
            linkElement.appendChild(removeButton);
            linksContainer.appendChild(linkElement);
        });
    }

    addButton.addEventListener("click", function () {
        const url = linkInput.value;
        if (url) {
            const link = {
                url: url,
                title: linkInput.value, // Title is set once to the input value
                image: "", // Optionally add custom image URL if needed
            };
            links.push(link); // Add new link to the array
            linkInput.value = ""; // Clear the input field
            saveLinks(); // Save updated links to local storage
            renderLinks(); // Re-render the list
        }
    });

    renderLinks(); // Initial rendering of links
});