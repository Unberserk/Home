// Function to fetch metadata from a URL
async function fetchSiteMetadata(url) {
    try {
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) throw new Error('Failed to fetch the URL');

        const text = await response.text();

        // Parsing the title and image from the HTML of the site
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        const title = doc.querySelector('title') ? doc.querySelector('title').innerText : 'No title';
        const image = doc.querySelector('meta[property="og:image"]') ? doc.querySelector('meta[property="og:image"]').getAttribute('content') : '';
        
        return {
            title: title,
            image: image || 'default-thumbnail.jpg', // Default thumbnail if none is found
            url: url
        };
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return null;  // Return null in case of an error
    }
}

// Function to create and display a grid of sites with thumbnails and titles
async function displaySiteGrid() {
    const container = document.getElementById("site-grid");
    container.innerHTML = ""; // Clear existing content

    const allLinks = document.querySelectorAll('a'); // Get all links on the page
    let failedFetches = false;

    for (const link of allLinks) {
        const url = link.href;

        // Skip non-HTTP links (e.g., mailto, tel)
        if (!url.startsWith('http')) continue;

        const siteDetails = await fetchSiteMetadata(url);
        if (siteDetails) {
            const siteElement = document.createElement("div");
            siteElement.classList.add("site-item");

            siteElement.innerHTML = `
                <a href="${siteDetails.url}" target="_blank">
                    <img src="${siteDetails.image}" alt="${siteDetails.title}" class="site-thumbnail">
                    <h3 class="site-title">${siteDetails.title}</h3>
                </a>
            `;

            container.appendChild(siteElement);
        } else {
            failedFetches = true;
        }
    }

    // Show error message if fetching metadata failed for any site
    if (failedFetches) {
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("error-message");
        errorMessage.innerText = "There was an error fetching metadata for some sites.";
        container.appendChild(errorMessage);
    }
}

// Call the function to display the sites
displaySiteGrid();