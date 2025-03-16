// Function to initialize stored links on page load
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

    const previewContainer = document.createElement("div");
    previewContainer.classList.add("preview-container");

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-link-btn");

    removeBtn.addEventListener("click", function () {
        removeLink(linkData); // Call removeLink when clicked
    });

    linkDiv.appendChild(img);
    linkDiv.appendChild(linkTitle);
    linkDiv.appendChild(removeBtn);
    linkDiv.appendChild(previewContainer);  // Append the preview container

    linkContainer.appendChild(linkDiv);
}

// Function to remove link from local storage and DOM
function removeLink(linkData) {
    // Remove from Local Storage
    let links = JSON.parse(localStorage.getItem("savedLinks")) || [];
    links = links.filter(link => link.url !== linkData.url);
    localStorage.setItem("savedLinks", JSON.stringify(links));

    // Remove the link from the DOM
    const linkDiv = document.getElementById(linkData.url); // Use unique ID for the link
    if (linkDiv) {
        linkDiv.remove();
    }
}

// Function to show preview image of the page
function showPreview(url, previewContainer) {
    const previewImage = document.createElement("img");
    previewImage.src = getPreviewImage(url); // Function to get the preview image
    previewImage.alt = "Page preview";
    previewContainer.appendChild(previewImage);

    previewImage.addEventListener("click", function () {
        window.open(url, "_blank");  // Redirect when the image is clicked
    });
}

// Function to fetch the preview image (meta tag 'og:image' or fallback to a default)
async function getPreviewImage(url) {
    try {
        const response = await fetch(url);
        const htmlText = await response.text();
        const doc = new DOMParser().parseFromString(htmlText, "text/html");
        const ogImage = doc.querySelector("meta[property='og:image']");
        if (ogImage && ogImage.content) {
            return ogImage.content;
        }
        return "https://via.placeholder.com/150"; // Default placeholder
    } catch (e) {
        console.error("Error fetching preview image: ", e);
        return "https://via.placeholder.com/150"; // Default placeholder if error
    }
}

// Function to open the iframe properly
function openIframe(url) {
    const iframeContainer = document.querySelector('.iframeContainer');
    const iframeLink = document.getElementById('iframeLink');

    iframeContainer.style.display = 'block';
    iframeLink.src = "about:blank"; // Ensures a fresh load
    setTimeout(() => {
        iframeLink.src = formatUrl(url);
    }, 50);
}

// Function to close the iframe
function closeIframe() {
    const iframeContainer = document.querySelector('.iframeContainer');
    const iframeLink = document.getElementById('iframeLink');

    iframeContainer.style.display = 'none';
    iframeLink.src = "";
}

// Function to ensure the URL is absolute
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

// Function to handle file import
function importTxtFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result.trim();
        const lines = content.split("\n").map(line => line.trim());
        
        let importedLinks = [];
        for (let i = 0; i < lines.length; i += 4) {
            if (lines[i] && lines[i + 1] && lines[i + 2]) {
                const linkData = {
                    url: formatUrl(lines[i]),
                    title: lines[i + 1],
                    image: lines[i + 2]
                };
                importedLinks.push(linkData);
            }
        }

        // Save to local storage and render
        importedLinks.forEach(link => {
            saveToLocalStorage(link);
            renderLink(link);
        });
    };

    reader.readAsText(file);
}

// Event listener for file input
document.getElementById("file-input").addEventListener("change", importTxtFile);
