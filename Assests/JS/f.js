// Function to add link to the page
function addLink() {
    const url = document.getElementById("link-input").value;
    const title = document.getElementById("title-input").value;
    const image = document.getElementById("image-input").files[0];

    if (url && title && image) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result; // Get the image data URL

            // Create a new div for the link
            const linkDiv = document.createElement("div");
            linkDiv.classList.add("link-entry");

            // Create the image element
            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = title;
            img.classList.add("link-image");

            // Create the title element
            const linkTitle = document.createElement("p");
            linkTitle.textContent = title;

            // Add image and title to the link div
            linkDiv.appendChild(img);
            linkDiv.appendChild(linkTitle);

            // Add event listener to open the link in the iframe
            linkDiv.addEventListener("click", function() {
                openIframe(url); // Open the link in iframe
            });

            // Add the new link div to the link container
            document.getElementById("link-container").appendChild(linkDiv);
        };

        // Read the image file as data URL
        reader.readAsDataURL(image);

        // Clear the input fields after adding the link
        document.getElementById("link-input").value = "";
        document.getElementById("title-input").value = "";
        document.getElementById("image-input").value = "";
    } else {
        alert("Please fill out all fields!");
    }
}

// Function to open the iframe with the selected link
function openIframe(url) {
    const iframeContainer = document.querySelector('.iframeContainer');
    const iframeLink = document.getElementById('iframeLink');
    iframeLink.src = url; // Set the iframe's source to the URL
    iframeContainer.style.display = 'block'; // Show the iframe container
}

// Function to close the iframe
function closeIframe() {
    const iframeContainer = document.querySelector('.iframeContainer');
    const iframeLink = document.getElementById('iframeLink');
    iframeContainer.style.display = 'none'; // Hide the iframe container
    iframeLink.src = ''; // Stop the iframe content when closed
}