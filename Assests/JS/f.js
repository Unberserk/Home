// Buttons Script for the Projects Frame
document.addEventListener('DOMContentLoaded', () => {
  const projectFrame = document.querySelector('.Projects-Frame');
  const closeBtn = document.getElementById('close');
  const fullscreenBtn = document.getElementById('fullscreen');
  const linkBtn = document.getElementById('link');
  const iframe = document.querySelector('.Projects-IFrame');

  // Close Button: Hide the project frame
  closeBtn.addEventListener('click', () => {
    projectFrame.classList.add('hidden');
  });

  // Fullscreen Button: Toggle fullscreen mode for the project frame
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      projectFrame.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  });

  // Link Button: Copy the iframe's source URL to the clipboard or open it in a new tab
  linkBtn.addEventListener('click', () => {
    const src = iframe.src;
    if (src) {
      navigator.clipboard.writeText(src).then(() => {
        alert('Link copied to clipboard: ' + src);
      }).catch(err => {
        // Fallback: open in new tab if clipboard fails
        alert('Failed to copy link. Opening link in a new tab.');
        window.open(src, '_blank');
      });
    } else {
      alert('No link available.');
    }
  });
});