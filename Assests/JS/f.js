// Function to initialize stored links on page load
document.addEventListener("DOMContentLoaded", function () {
    loadLinks();
});

// Function to add a link from input fields
function addLink() {
    const url = document.getElementById("link-input").value.trim();
    const title = document.getElementById("title-input").value.trim();
    const image = document.getElementById("image-input").value.trim();

    if (url && title && image) {
        const linkData = { url: formatUrl(url), title: title, image: image };
        saveToLocalStorage(linkData);
        renderLink(linkData);

        document.getElementById("link-input").value = "";
        document.getElementById("title-input").value = "";
        document.getElementById("image-input").value = "";
    } else {
        alert("Please fill out all fields!");
    }
}

// Function to render a single link
function renderLink(linkData) {
    const linkContainer = document.getElementById("link-container");

    const linkDiv = document.createElement("div");
    linkDiv.classList.add("link-entry");

    const img = document.createElement("img");
    img.src = linkData.image;
    img.alt = linkData.title;
    img.classList.add("link-image");

    const linkTitle = document.createElement("p");
    linkTitle.textContent = linkData.title;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-button");

    removeBtn.addEventListener("click", function () {
        removeFromLocalStorage(linkData.url);
        linkDiv.remove();
    });

    linkDiv.appendChild(img);
    linkDiv.appendChild(linkTitle);
    linkDiv.appendChild(removeBtn);

    linkDiv.addEventListener("click", function (event) {
        if (event.target !== removeBtn) {
            openIframe(linkData.url);
        }
    });

    linkContainer.appendChild(linkDiv);
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

// Function to remove link from local storage
function removeFromLocalStorage(url) {
    let links = JSON.parse(localStorage.getItem("savedLinks")) || [];
    links = links.filter(link => link.url !== url);
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
