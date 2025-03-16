document.addEventListener("DOMContentLoaded", function () {
    loadLinks();
});

// Function to add a link from input fields
function addLink() {
    const url = document.getElementById("link-input").value.trim();
    const title = document.getElementById("title-input").value.trim();
    const imageUrl = document.getElementById("image-url-input").value.trim();
    const imageFile = document.getElementById("image-file-input").files[0];

    if (!url || !title) {
        alert("Please enter both a link and a title!");
        return;
    }

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            saveAndRenderLink(url, title, e.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else if (imageUrl) {
        saveAndRenderLink(url, title, imageUrl);
    } else {
        fetchPreviewImage(url, function (previewImage) {
            saveAndRenderLink(url, title, previewImage);
        });
    }

    // Clear input fields after adding
    document.getElementById("link-input").value = "";
    document.getElementById("title-input").value = "";
    document.getElementById("image-url-input").value = "";
    document.getElementById("image-file-input").value = "";
}

// Function to fetch preview image using an external API
function fetchPreviewImage(url, callback) {
    const apiKey = "your_api_key"; // Replace with a real API key if needed
    const apiUrl = `https://api.linkpreview.net/?key=${apiKey}&q=${encodeURIComponent(url)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.image) {
                callback(data.image);
            } else {
                callback(generateFallbackThumbnail(url));
            }
        })
        .catch(error => {
            console.error("Error fetching preview:", error);
            callback(generateFallbackThumbnail(url));
        });
}

// Function to generate a fallback thumbnail (if API fails)
function generateFallbackThumbnail(url) {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
}

// Function to save and render link
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
    linkDiv.id = linkData.url;

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
        removeLink(linkData);
    });

    linkDiv.appendChild(img);
    linkDiv.appendChild(linkTitle);
    linkDiv.appendChild(removeBtn);

    linkDiv.addEventListener("click", function () {
        openIframe(linkData.url);
    });

    linkContainer.appendChild(linkDiv);
}

// Function to open iframe
function openIframe(url) {
    const iframeContainer = document.querySelector('.iframeContainer');
    const iframeLink = document.getElementById('iframeLink');
    
    iframeContainer.style.display = 'block';
    iframeLink.src = formatUrl(url);
}

// Function to close iframe
function closeIframe() {
    document.querySelector('.iframeContainer').style.display = 'none';
    document.getElementById('iframeLink').src = "";
}

// Function to format URL
function formatUrl(url) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return "https://" + url;
    }
    return url;
}

// Function to save to local storage
function saveToLocalStorage(linkData) {
    let links = JSON.parse(localStorage.getItem("savedLinks")) || [];
    links.push(linkData);
    localStorage.setItem("savedLinks", JSON.stringify(links));
}

// Function to load saved links
function loadLinks() {
    const links = JSON.parse(localStorage.getItem("savedLinks")) || [];
    links.forEach(renderLink);
}

// Function to remove a link
function removeLink(linkData) {
    let links = JSON.parse(localStorage.getItem("savedLinks")) || [];
    links = links.filter(link => link.url !== linkData.url);
    localStorage.setItem("savedLinks", JSON.stringify(links));

    const linkDiv = document.getElementById(linkData.url);
    if (linkDiv) {
        linkDiv.remove();
    }
}

// Function to remove all links
function removeAllLinks() {
    localStorage.removeItem("savedLinks");
    document.getElementById("link-container").innerHTML = "";
}
