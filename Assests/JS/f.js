// Function to load a link into the iframe
function loadLink(url) {
    const iframe = document.getElementById('site-frame');
    iframe.src = url; // Set the iframe source to the selected link
    document.getElementById('site-frame-container').classList.remove('hidden'); // Show the iframe container
}

// Function to go back to the previous page
function goBack() {
    document.getElementById('site-frame-container').classList.add('hidden'); // Hide iframe container
}

// Adding links dynamically
const linksContainer = document.getElementById("links-container");
const addLinkButton = document.getElementById("add-link-button");
const linkInput = document.getElementById("link-input");
const titleInput = document.getElementById("title-input");
const imageInput = document.getElementById("image-input");

// Function to add a new link
addLinkButton.addEventListener("click", () => {
    const linkUrl = linkInput.value.trim();
    const title = titleInput.value.trim();
    const imageUrl = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : "";

    // Check if the URL and title are provided
    if (linkUrl && title) {
        const linkBox = document.createElement("div");
        linkBox.classList.add("link-box");

        // Add image if available
        if (imageUrl) {
            const linkImage = document.createElement("img");
            linkImage.src = imageUrl;
            linkImage.alt = title;
            linkBox.appendChild(linkImage);
        }

        // Add title and make the entire box clickable
        const linkTitle = document.createElement("p");
        linkTitle.textContent = title;
        linkBox.appendChild(linkTitle);

        // Make the whole link box clickable to open the URL in the iframe
        linkBox.addEventListener("click", () => loadLink(linkUrl));

        // Create a remove button (a white X in a grey circle)
        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-button");
        removeButton.innerHTML = "&times;";
        removeButton.addEventListener("click", () => {
            linksContainer.removeChild(linkBox); // Remove the link box
        });

        linkBox.appendChild(removeButton);

        // Append the new link box to the links container
        linksContainer.appendChild(linkBox);

        // Clear inputs after adding the link
        linkInput.value = '';
        titleInput.value = '';
        imageInput.value = '';
    } else {
        alert("Please provide both a title and a valid link.");
    }
});