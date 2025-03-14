document.addEventListener('DOMContentLoaded', function () {
  // ====================
  // Custom Link Adding Code using a CORS Proxy
  // ====================
  
  // Function to fetch metadata (title and image) from a URL using AllOrigins proxy
  async function fetchSiteMetadata(url) {
    try {
      // Use the AllOrigins proxy to bypass CORS restrictions
      const proxyUrl = 'https://api.allorigins.win/get?disableCache=true&url=' + encodeURIComponent(url);
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Failed to fetch the URL via proxy');
      
      const data = await response.json();
      const text = data.contents;
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      
      // Extract the page title
      const title = doc.querySelector('title') ? doc.querySelector('title').innerText : 'No title';
      // Extract the Open Graph image if available
      const image = doc.querySelector('meta[property="og:image"]')
                    ? doc.querySelector('meta[property="og:image"]').getAttribute('content')
                    : '';
      
      return {
        title: title,
        image: image || 'default-thumbnail.jpg', // Fallback image if none is found
        url: url
      };
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return null;
    }
  }
  
  // Function to add a custom link based on user input
  async function addCustomLink() {
    const inputField = document.getElementById("link-input");
    const url = inputField.value.trim();
  
    if (!url || !url.startsWith('http')) {
      alert("Please enter a valid URL starting with http:// or https://");
      return;
    }
  
    const siteDetails = await fetchSiteMetadata(url);
    if (siteDetails) {
      const container = document.getElementById("site-grid");
      const siteElement = document.createElement("div");
      siteElement.classList.add("site-item");
  
      siteElement.innerHTML = `
        <a href="${siteDetails.url}" target="_blank">
          <img src="${siteDetails.image}" alt="${siteDetails.title}" class="site-thumbnail">
          <h3 class="site-title">${siteDetails.title}</h3>
        </a>
      `;
  
      container.appendChild(siteElement);
      inputField.value = ""; // Clear the input field after adding
    } else {
      alert("Failed to fetch metadata for this URL.");
    }
  }
  
  // Attach event listener to the "Add Link" button
  const addLinkButton = document.getElementById("add-link-button");
  if (addLinkButton) {
    addLinkButton.addEventListener("click", addCustomLink);
  }
  
  // ====================
  // Projects-Frame Buttons Script
  // ====================
  const projectFrame = document.querySelector('.Projects-Frame');
  const closeBtn = document.getElementById('close');
  const fullscreenBtn = document.getElementById('fullscreen');
  const linkBtn = document.getElementById('link');
  const iframe = document.querySelector('.Projects-IFrame');
  
  // Close Button: Hide the projects frame
  if (closeBtn && projectFrame) {
    closeBtn.addEventListener('click', () => {
      projectFrame.classList.add('hidden');
      projectFrame.style.display = 'none';
    });
  }
  
  // Fullscreen Button: Toggle fullscreen mode for the projects frame
  if (fullscreenBtn && projectFrame) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        projectFrame.requestFullscreen().catch(err => {
          console.error(`Error enabling fullscreen: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }
  
  // Link Button: Copy the iframe's URL to the clipboard or open it in a new tab
  if (linkBtn && iframe) {
    linkBtn.addEventListener('click', () => {
      const src = iframe.src;
      if (src) {
        navigator.clipboard.writeText(src).then(() => {
          alert('Link copied to clipboard: ' + src);
        }).catch(err => {
          alert('Failed to copy link. Opening link in a new tab.');
          window.open(src, '_blank');
        });
      } else {
        alert('No link available.');
      }
    });
  }
});