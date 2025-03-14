document.getElementById("addButton").addEventListener("click", function() {
    const title = document.getElementById("titleInput").value;
    const url = document.getElementById("urlInput").value;
    const fileInput = document.getElementById("fileInput").files[0];
    
    // Check if title and URL are provided
    if (!title || !url) {
        alert("Please enter both a title and a URL.");
        return;
    }
    
    // Create the link item from the template
    const linkTemplate = document.getElementById("linkTemplate").content.cloneNode(true);
    const linkItem = linkTemplate.querySelector(".link-item");
    
    // Set the image (if any) and title
    const imageContainer = linkItem.querySelector(".link-image");
    const titleContainer = linkItem.querySelector(".link-name");
    
    // If an image is selected, set it as the background
    if (fileInput) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageContainer.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(fileInput);
    } else {
        // If no image, set a default background (You can replace it with a default image URL)
        imageContainer.style.backgroundImage = `url('https://via.placeholder.com/150')`;
    }

    // Set the title text
    titleContainer.textContent = title;

    // Add the click event to redirect when clicked
    linkItem.addEventListener("click", function() {
        window.location.href = url;
    });

    // Add the remove button functionality
    const removeButton = linkItem.querySelector(".remove-button");
    removeButton.addEventListener("click", function(e) {
        e.stopPropagation(); // Prevent triggering the link click
        linkItem.remove();
    });

    // Append the new link item to the links container
    document.getElementById("linksContainer").appendChild(linkItem);

    // Clear input fields after adding the link
    document.getElementById("titleInput").value = '';
    document.getElementById("urlInput").value = '';
    document.getElementById("fileInput").value = '';
});