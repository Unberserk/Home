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
        removeLink(linkData);
    });

    linkDiv.addEventListener("click", function () {
        openIframe(linkData.url);
    });

    // Hover event for image preview
    linkDiv.addEventListener("mouseenter", function () {
        showImagePreview(img, linkData.url);
    });

    linkDiv.addEventListener("mouseleave", function () {
        hideImagePreview(img, linkData.image);
    });

    linkDiv.appendChild(img);
    linkDiv.appendChild(linkTitle);
    linkDiv.appendChild(removeBtn);

    linkContainer.appendChild(linkDiv);
}

// Function to open iframe
function openIframe(url) {
    const iframeContainer = document.querySelector('.iframeContainer');
    const iframeLink = document.getElementById('iframeLink');

    window.history.replaceState(null, null, location.href);

    iframeContainer.style.display = 'block';
    iframeLink.src = "about:blank";
    setTimeout(() => {
        iframeLink.src = formatUrl(url);
    }, 50);
}

// Function to close iframe
function closeIframe() {
    const iframeContainer = document.querySelector('.iframeContainer');
    const iframeLink = document.getElementById('iframeLink');

    iframeContainer.style.display = 'none';
    iframeLink.src = "";
}

// Function to format URL
function formatUrl(url) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return "https://" + url;
    }
    return url;
}

// Function to save link to local storage
function saveToLocalStorage(linkData) {
    let links = JSON.parse(localStorage.getItem("savedLinks")) || [];
    links.push(linkData);
    localStorage.setItem("savedLinks", JSON.stringify(links));
}

// Function to load links from local storage
function loadLinks() {
    const links = JSON.parse(localStorage.getItem("savedLinks")) || [];
    links.forEach(renderLink);
}

// Function to remove link
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

    const linkContainer = document.getElementById("link-container");
    while (linkContainer.firstChild) {
        linkContainer.removeChild(linkContainer.firstChild);
    }
}

// Function to change image on hover
function showImagePreview(imgElement, url) {
    imgElement.dataset.originalSrc = imgElement.src; // Store original image
    imgElement.src = `https://image.thum.io/get/width/300/noanimate/${url}`; // Load preview
}

// Function to revert image when not hovering
function hideImagePreview(imgElement, originalSrc) {
    imgElement.src = imgElement.dataset.originalSrc || originalSrc; // Revert to original image
}
