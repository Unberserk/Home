document.addEventListener("DOMContentLoaded", function () {
    loadLinks();
});

function addLink() {
    const link = document.getElementById("link-input").value.trim();
    const title = document.getElementById("title-input").value.trim();
    let imageUrl = document.getElementById("image-url-input").value.trim();
    const imageFile = document.getElementById("image-file-input").files[0];

    if (!link || !title) {
        alert("Please enter a valid link and title.");
        return;
    }

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            saveLink(link, title, e.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveLink(link, title, imageUrl || "./Assests/Imgs/default.png");
    }

    document.getElementById("link-input").value = "";
    document.getElementById("title-input").value = "";
    document.getElementById("image-url-input").value = "";
    document.getElementById("image-file-input").value = "";
}

function importLinks() {
    const fileInput = document.getElementById("file-input");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file first.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const lines = e.target.result.split("\n");

        lines.forEach(line => {
            const parts = line.split("|");
            if (parts.length === 3) {
                saveLink(parts[0].trim(), parts[1].trim(), parts[2].trim());
            }
        });

        fileInput.value = "";
    };
    reader.readAsText(file);
}

function saveLink(link, title, imageUrl) {
    const container = document.getElementById("link-container");

    const linkEntry = document.createElement("div");
    linkEntry.classList.add("link-entry");
    linkEntry.innerHTML = `<img src="${imageUrl}" alt="${title}"><p>${title}</p>`;
    linkEntry.onclick = () => window.open(link, "_blank");

    container.appendChild(linkEntry);
}

function removeAllLinks() {
    document.getElementById("link-container").innerHTML = "";
}
