document.addEventListener("DOMContentLoaded", function () {
    const linkInput = document.getElementById("linkInput");
    const addButton = document.getElementById("addButton");
    const linksContainer = document.getElementById("linksContainer");

    // Load saved links from local storage
    let links = JSON.parse(localStorage.getItem("savedLinks")) || [];

    function saveLinks() {
        localStorage.setItem("savedLinks", JSON.stringify(links));
    }

    function addLink(url) {
        if (!url.trim()) return;

        links.push({ url, name: url, image: "" }); // Default with no image
        saveLinks();
        renderLinks();
    }

    function removeLink(index) {
        links.splice(index, 1);
        saveLinks();
        renderLinks();
    }

    function updateImage(index, imageData) {