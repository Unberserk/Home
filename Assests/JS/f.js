document.addEventListener("DOMContentLoaded", function () {
    loadLinks();
});

// Function to add a link from input fields
function addLink() {
    const url = document.getElementById("link-input").value.trim();
    const title = document.getElementById("title-input").value.trim();
    const imageUrl = document.getElementById("image-url-input").value.trim();
    const imageFile = document.getElementById("image-file-input").files[0];

    if (!url || !title || (!imageUrl && !imageFile)) {
        alert("Please fill out all fields and choose either an image URL or file!");
        return;
    }

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            saveAndRenderLink(url, title, imageData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveAndRenderLink(url, title, imageUrl);
    }

    // Clear input fields after adding
    document.getElementById("link-input").value = "";
    document.getElementById("title-input").value = "";
    document.getElementById("image-url-input").value = "";
    document.getElementById("image-file-input").value = "";
}

// Function to save to local storage and render
function saveAndRenderLink(url, title, image) {
    const linkData = { url: formatUrl(url), title: title, image: image };
    saveToLocalStorage(linkData);
    renderLink(linkData);
}

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

    const linkTitle = document.createElement("p");
    linkTitle.textContent = linkData.title;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-link-btn");

    removeBtn.addEventListener("click", function () {
        removeLink(linkData); // Call removeLink when clicked
    });

    linkDiv.addEventListener("click", function () {
        openIframe(linkData.url); // Open iframe when the link container is clicked
    });

    linkDiv.appendChild(img);
    linkDiv.appendChild(linkTitle);
    linkDiv.appendChild(removeBtn);

    linkContainer.appendChild(linkDiv);
}

// Function to remove link from local storage and DOM
function removeLink(linkData) {
    removeFromLocalStorage(linkData.url);
    const linkDiv = document.getElementById(linkData.url);
    linkDiv.remove();
}

// Function to remove all links
function removeAllLinks() {
    localStorage.clear();
    document.getElementById("link-container").innerHTML = ""; // Clear all links from DOM
}

// Function to open iframe with the link
function openIframe(url) {
    const iframeContainer = document.querySelector(".iframeContainer");
    const iframe = document.getElementById("iframeLink");
    iframe.src = url;
    iframeContainer.style.display = "block"; // Show the iframe container
}

// Function to close iframe
function closeIframe() {
    const iframeContainer = document.querySelector(".iframeContainer");
    iframeContainer.style.display = "none"; // Hide the iframe container
}

// Function to import links from a file
function importLinks() {
    const fileInput = document.getElementById("file-input");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to import.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const links = e.target.result.split("\n").map(line => line.trim()).filter(Boolean);
        links.forEach(linkLine => {
            const [url, title, image] = linkLine.split(","); // Format: url,title,image
            if (url && title) {
                saveAndRenderLink(url.trim(), title.trim(), image ? image.trim() : "");
            }
        });
    };
    reader.readAsText(file);
}

// Function to load links from local storage when the page is loaded
function loadLinks() {
    const storedLinks = JSON.parse(localStorage.getItem("links")) || [];
    storedLinks.forEach(link => {
        renderLink(link);
    });
}

// Function to save link to localStorage
function saveToLocalStorage(linkData) {
    const storedLinks = JSON.parse(localStorage.getItem("links")) || [];
    storedLinks.push(linkData);
    localStorage.setItem("links", JSON.stringify(storedLinks));
}

// Function to remove link from localStorage
function removeFromLocalStorage(url) {
    let storedLinks = JSON.parse(localStorage.getItem("links")) || [];
    storedLinks = storedLinks.filter(link => link.url !== url);
    localStorage.setItem("links", JSON.stringify(storedLinks));
}

// Format URL function (just an example to clean URL)
function formatUrl(url) {
    if (!url.startsWith("http")) {
        return "http://" + url;
    }
    return url;
}
