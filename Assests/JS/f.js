// Function to initialize stored links on page load
document.addEventListener("DOMContentLoaded", function () {
    loadLinks();
});

// Function to add link to the page and local storage
function addLink() {
    const url = document.getElementById("link-input").value;
    const title = document.getElementById("title-input").value;
    const image = document.getElementById("image-input").files[0];

    if (url && title && image) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageUrl = e.target.result;

            const linkData = {
                url: url,
                title: title,
                image: imageUrl
            };

            saveToLocalStorage(linkData);
            renderLink(linkData);
        };

        reader.readAsDataURL(image);

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
        iframeLink.src = url; // Loads the new URL after a small delay
    }, 50);
}

// Function to close the iframe
function closeIframe() {
    const iframeContainer = document.querySelector('.iframeContainer');
    const iframeLink = document.getElementById('iframeLink');

    iframeContainer.style.display = 'none';
    iframeLink.src = "";
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
