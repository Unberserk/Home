// Load links from localStorage on page load
window.onload = function() {
    const links = JSON.parse(localStorage.getItem('links')) || [];
    links.forEach(link => {
        addLinkToDOM(link);
    });
};

// Function to add link
function addLink() {
    const link = document.getElementById('link-input').value;
    const title = document.getElementById('title-input').value;
    const imageUrl = document.getElementById('image-url-input').value;
    const imageFile = document.getElementById('image-file-input').files[0];

    if (link && title) {
        let image = imageUrl ? imageUrl : '';
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function() {
                image = reader.result;
                const newLink = { link, title, image };
                saveLink(newLink);
                addLinkToDOM(newLink);
            };
            reader.readAsDataURL(imageFile);
        } else {
            const newLink = { link, title, image };
            saveLink(newLink);
            addLinkToDOM(newLink);
        }
    }
}

// Function to save link to localStorage
function saveLink(link) {
    const links = JSON.parse(localStorage.getItem('links')) || [];
    links.push(link);
    localStorage.setItem('links', JSON.stringify(links));
}

// Function to add link to the DOM
function addLinkToDOM(link) {
    const container = document.getElementById('link-container');
    const linkEntry = document.createElement('div');
    linkEntry.classList.add('link-entry');
    linkEntry.innerHTML = `
        <img src="${link.image}" alt="${link.title}">
        <p>${link.title}</p>
        <button class="remove-link-btn" onclick="removeLink('${link.title}')">Remove</button>
    `;
    container.appendChild(linkEntry);
}

// Function to remove link
function removeLink(title) {
    let links = JSON.parse(localStorage.getItem('links')) || [];
    links = links.filter(link => link.title !== title);
    localStorage.setItem('links', JSON.stringify(links));
    renderLinks();
}

// Function to render links from localStorage
function renderLinks() {
    const links = JSON.parse(localStorage.getItem('links')) || [];
    const container = document.getElementById('link-container');
    container.innerHTML = '';
    links.forEach(link => {
        addLinkToDOM(link);
    });
}

// Function to remove all links
function removeAllLinks() {
    localStorage.removeItem('links');
    renderLinks();
}

// Function to import links from a TXT file
function importLinks() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const lines = e.target.result.split('\n');
            lines.forEach(line => {
                const parts = line.split(' ');
                if (parts.length >= 3) {
                    const link = parts[0];
                    const title = parts[1];
                    const image = parts[2] || '';
                    saveLink({ link, title, image });
                    addLinkToDOM({ link, title, image });
                }
            });
        };
        reader.readAsText(file);
    }
}

// Function to close iframe
function closeIframe() {
    document.querySelector('.iframeContainer').style.display =
