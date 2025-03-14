document.addEventListener("DOMContentLoaded", function () {
    const linkInput = document.getElementById("linkInput");
    const addButton = document.getElementById("addButton");
    const linksContainer = document.getElementById("linksContainer");

    // Load saved links from local storage
    let links = JSON.parse(localStorage.getItem("savedLinks")) || [];

    function saveLinks() {
        localStorage.setItem("savedLinks", JSON.stringify(links));
    }

    function fetchTitle(url, callback) {
        fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const title = doc.querySelector("title")?.innerText || url;
                callback(title);
            })
            .catch(() => callback(url)); // Fallback to URL if fetch fails
    }

    function addLink(url) {
        if (!url.trim()) return;

        fetchTitle(url, (title) => {
            links.push({ url, name: title });
            saveLinks();
            renderLinks();
        });
    }

    function removeLink(index) {
        links.splice(index, 1);
        saveLinks();
        renderLinks();
    }

    function renderLinks() {
        linksContainer.innerHTML = "";

        links.forEach((link, index) => {
            const linkItem = document.createElement("div");
            linkItem.classList.add("link-item");

            const favicon = document.createElement("img");
            favicon.src = `https://www.google.com/s2/favicons?domain=${link.url}`;
            favicon.onerror = function () {
                this.src = "./Assests/Imgs/NoIcon.png"; // Fallback icon
            };

            const linkText = document.createElement("a");
            linkText.href = link.url;
            linkText.textContent = link.name; // Display fetched title
            linkText.target = "_blank";

            const removeButton = document.createElement("button");
            removeButton.textContent = "X";
            removeButton.classList.add("remove-button");
            removeButton.onclick = () => removeLink(index);

            linkItem.appendChild(favicon);
            linkItem.appendChild(linkText);
            linkItem.appendChild(removeButton);
            linksContainer.appendChild(linkItem);
        });
    }

    addButton.addEventListener("click", function () {
        addLink(linkInput.value);
        linkInput.value = "";
    });

    renderLinks(); // Initial render
});