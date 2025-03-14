function addLink() {
    const linkContainer = document.getElementById('link-container');
    const linkInput = document.getElementById('link-input');
    const titleInput = document.getElementById('title-input');
    const imageInput = document.getElementById('image-input');

    // Create a new link container with image, title, and remove button
    const newLink = document.createElement('div');
    newLink.classList.add('link-container-item');

    // Get the URL and ensure it is absolute
    let url = linkInput.value.trim();

    // If the URL does not start with http:// or https://, add https://
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url; // Prefix with https:// if it's missing
    }

    // Create a link that will redirect to the URL
    const linkBox = document.createElement('a');
    linkBox.classList.add('link-box');
    linkBox.setAttribute('href', url); // Link the URL to the anchor tag
    linkBox.setAttribute('target', '_blank'); // Open link in a new tab
    linkBox.style.display = "block"; // Make sure the link takes up the whole block

    // Create a local image preview
    const img = document.createElement('img');
    img.classList.add('link-image');
    
    // Check if an image is selected
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result; // Set the image preview
        }
        reader.readAsDataURL(imageInput.files[0]);
    }

    const title = document.createElement('input');
    title.type = 'text';
    title.classList.add('link-title');
    title.value = titleInput.value || 'Unnamed Link'; // Use the input title or a default one

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-btn');
    removeBtn.textContent = 'X';

    // Remove the link when the remove button is clicked
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the link redirect when removing
        newLink.remove();
    });

    // Append the image, title, and remove button inside the link box
    linkBox.appendChild(img);
    linkBox.appendChild(title);
    linkBox.appendChild(removeBtn);

    // Append the link box to the link container
    newLink.appendChild(linkBox);

    // Add the new link to the page
    linkContainer.appendChild(newLink);

    // Clear the input fields
    linkInput.value = '';
    titleInput.value = '';
    imageInput.value = '';
}