document.getElementById('addButton').addEventListener('click', function() {
    var linkInput = document.getElementById('linkInput').value;
    var linkName = document.getElementById('linkName').value;
    var imageInput = document.getElementById('imageInput').files[0];

    if (linkInput && linkName && imageInput) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var linkItem = document.createElement('div');
            linkItem.classList.add('link-item');

            // Image as background for YouTube-like preview
            var linkImage = document.createElement('div');
            linkImage.classList.add('link-image');
            linkImage.style.backgroundImage = 'url(' + e.target.result + ')';

            // Link as the box's redirect
            linkItem.onclick = function() {
                window.open(linkInput, '_blank');
            };

            // Title of the link below the image
            var linkNameElement = document.createElement('span');
            linkNameElement.classList.add('link-name');
            linkNameElement.textContent = linkName;

            // Create remove button (a small "X" circle)
            var removeButton = document.createElement('button');
            removeButton.classList.add('remove-button');
            removeButton.textContent = 'X';
            removeButton.onclick = function() {
                linkItem.remove();
            };

            // Append everything to the link item
            linkItem.appendChild(linkImage);
            linkItem.appendChild(linkNameElement);
            linkItem.appendChild(removeButton);

            // Add link item to the links container
            document.getElementById('linksContainer').appendChild(linkItem);
        };

        reader.readAsDataURL(imageInput);
    }
});