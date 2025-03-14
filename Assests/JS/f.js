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

            // Create title element
            const titleElement = document.createElement("span");
            titleElement.classList.add("link-title");
            titleElement.textContent = link.title || link.url;

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
                title: linkInput.value, // You can use a custom name here
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