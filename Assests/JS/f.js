document.addEventListener("DOMContentLoaded", function () {
    const linkInput = document.getElementById("linkInput");
    const addButton = document.getElementById("addButton");
    const linksContainer = document.getElementById("linksContainer");

    // Load saved links from local storage
    let savedLinks = JSON.parse(localStorage.getItem("savedLinks")) || [];
    savedLinks.forEach(url => fetchMetadata(url));

    // Function to add new links
    addButton.addEventListener("click", function () {
        const url = linkInput.value.trim();
        if (url) {
            fetchMetadata(url);
            savedLinks.push(url);
            localStorage.setItem("savedLinks", JSON.stringify(savedLinks));
            linkInput.value = "";
        }
    });

    // Fetch metadata for a given URL
    function fetchMetadata(url) {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        
        fetch(proxyUrl)
            .then(response => response.json())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.contents, "text/html");

                const title = doc.querySelector("title")?.innerText || "Unknown Title";
                const favicon = doc.querySelector("link[rel~='icon']")?.href || "";
                
                // If favicon is a relative URL, convert it to absolute
                let absoluteFavicon = favicon.startsWith("http") ? favicon : new URL(favicon, url).href;

                createLinkElement(url, title, absoluteFavicon);
            })
            .catch(error => {
                console.error("Failed to fetch metadata:", error);
                createLinkElement(url, "Unknown Title", "./Assests/Imgs/NoIcon.png");
            });
    }

    // Function to create a link element
    function createLinkElement(url, title, imageSrc) {
        const linkElement = document.createElement("div");
        linkElement.classList.add("link-item");
        
        linkElement.innerHTML = `
            <img src="${imageSrc}" alt="Favicon" class="link-icon" onerror="this.src='./Assests/Imgs/NoIcon.png'">
            <a href="${url}" target="_blank" class="link-title">${title}</a>
            <button class="removeButton">Remove</button>
        `;

        // Remove button functionality
        linkElement.querySelector(".removeButton").addEventListener("click", function () {
            linkElement.remove();
            savedLinks = savedLinks.filter(link => link !== url);
            localStorage.setItem("savedLinks", JSON.stringify(savedLinks));
        });

        linksContainer.appendChild(linkElement);
    }
});