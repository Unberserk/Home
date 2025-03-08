document.addEventListener("DOMContentLoaded", function () {
    const cinemaButton = document.querySelector(".Navigation-Button a[href='./u.html']");
    const Frame = document.querySelector(".Projects-Frame");
    const HAF = document.querySelectorAll(".hideAfterFullscreen");
    const IFrame = document.querySelector(".Projects-IFrame");
    const closeButton = document.getElementById("close");

    if (cinemaButton) {
        cinemaButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevents default navigation

            // Hide other elements & show iframe
            HAF.forEach(element => element.classList.add("hidden"));
            Frame.classList.remove("hidden");

            // Load the GitHub Pages website inside the iframe
            IFrame.src = "https://ufiles.vercel.app/";
        });
    }

    // Close button functionality
    if (closeButton) {
        closeButton.addEventListener("click", function () {
            HAF.forEach(element => element.classList.remove("hidden"));
            Frame.classList.add("hidden");
            IFrame.src = ""; // Reset iframe when closed
        });
    }

    // Fullscreen functionality
    document.getElementById("fullscreen").addEventListener("click", function () {
        const requestFullscreen =
            IFrame.requestFullscreen ||
            IFrame.webkitRequestFullscreen ||
            IFrame.msRequestFullscreen;
        if (requestFullscreen) requestFullscreen.call(IFrame);
    });

    // Open in new tab
    document.getElementById("link").addEventListener("click", function () {
        if (IFrame.src) window.open(IFrame.src);
    });
});
