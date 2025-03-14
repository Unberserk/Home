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
            const titleElement = document.createElement("p");
            titleElement.classList.add("link-title");
            titleElement.textContent = link.name;

            // Create remove button
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.classList.add("remove-button");
            removeButton.onclick = function () {
                removeLink(index);
            };

            // Create file input for custom image upload
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.classList.add("image-upload");
            fileInput.onchange = function (event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        links[index].image = e.target.result;
                        saveLinks();
                        renderLinks();
                    };
                    reader.readAsDataURL(file);
                }
            };

            // Wrap everything in a container
            linkElement.appendChild(imageElement);
            linkElement.appendChild(titleElement);
            linkElement.appendChild(fileInput);
            linkElement.appendChild(removeButton);
            linksContainer.appendChild(linkElement);
        });
    }

    function addLink(url) {
        if (!url.trim()) return;

        const newLink = { url, name: url, image: "" }; // Default with no image
        links.push(newLink);
        saveLinks();
        renderLinks();

        // Fetch page title with delay
        setTimeout(() => fetchTitle(newLink, links.length - 1), 5000);
    }

    function fetchTitle(link, index) {
        fetch(link.url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const title = doc.querySelector("title") ? doc.querySelector("title").innerText : link.url;
                links[index].name = title;
                saveLinks();
                renderLinks();
            })
            .catch(() => {
                links[index].name = link.url;
                saveLinks();
                renderLinks();
            });
    }

    function removeLink(index) {
        links.splice(index, 1);
        saveLinks();
        renderLinks();
    }

    // Add button event
    addButton.addEventListener("click", function () {
        const url = linkInput.value.trim();
        if (url) {
            addLink(url);
            linkInput.value = "";
        }
    });

    // Initial render
    renderLinks();
});