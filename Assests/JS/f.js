document.getElementById('addButton').addEventListener('click', function() {
    const linkName = document.getElementById('linkName').value;
    const linkUrl = document.getElementById('linkInput').value;
    const imageFile = document.getElementById('imageInput').files[0];

    // Validate inputs
    if (linkName === '' || linkUrl === '') {
        alert('Please provide both a name and a link URL');
        return;
    }

    const linkContainer = document.createElement('div');
    linkContainer.classList.add('link-item');

    // Set the link name
    const linkTitle = document.createElement('span');
    linkTitle.textContent = linkName;
    linkTitle.classList.add('link-name');
    linkTitle.onclick = function() {
        window.location.href = linkUrl;  // Redirect when the link name is clicked
    };

    // Handle image
    const imagePreview = document.createElement('img');
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imagePreview.src = event.target.result;
            imagePreview.classList.add('link-image');
        };
        reader.readAsDataURL(imageFile);
    } else {
        imagePreview.src = './Assests/Imgs/NoImageAvailable.png';  // Default image
        imagePreview.classList.add('link-image');
    }

    // Create remove button (simple X button)
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.classList.add('remove-button');
    removeButton.onclick = function() {
        linkContainer.remove();
    };

    // Append elements to the link container
    linkContainer.appendChild(linkTitle);
    linkContainer.appendChild(imagePreview);
    linkContainer.appendChild(removeButton);

    // Add the new link container to the links list
    document.getElementById('linksContainer').appendChild(linkContainer);

    // Clear the input fields after adding the link
    document.getElementById('linkName').value = '';
    document.getElementById('linkInput').value = '';
    document.getElementById('imageInput').value = '';
});