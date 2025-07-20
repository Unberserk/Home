const linkContainer = document.getElementById('link-container');
const sortSelect = document.getElementById('sortSelect');

function getLinks() {
  return JSON.parse(localStorage.getItem('myLinks') || '[]');
}

function saveLinks(links) {
  localStorage.setItem('myLinks', JSON.stringify(links));
}

function renderLinks() {
  let links = getLinks();
  if (sortSelect.value === 'title') {
    links.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    links.sort((a, b) => a.added - b.added);
  }
  saveLinks(links);

  linkContainer.innerHTML = '';
  links.forEach((link, i) => {
    const card = document.createElement('div');
    card.className = 'link-card';
    card.innerHTML = `
      <img src="${link.image || './Assests/Imgs/Logo.png'}" alt="thumb" onerror="this.src='./Assests/Imgs/Logo.png'">
      <div class="link-info">
        <h3>${link.title}</h3>
        <button onclick="openLink('${link.url}')">Open</button>
        <button onclick="deleteLink(${i})">Delete</button>
      </div>
    `;
    linkContainer.appendChild(card);
  });
}

function addLink() {
  const url = document.getElementById('link-input').value.trim();
  const title = document.getElementById('title-input').value.trim();
  if (!url || !title) return alert('Enter title & URL');
  const imageUrl = document.getElementById('image-url-input').value.trim();
  const fileIn = document.getElementById('image-file-input');

  const links = getLinks();
  const newLink = { url, title, image: imageUrl, added: Date.now() };

  if (fileIn.files.length) {
    const reader = new FileReader();
    reader.onload = e => {
      newLink.image = e.target.result;
      links.push(newLink);
      saveLinks(links);
      renderLinks();
    };
    reader.readAsDataURL(fileIn.files[0]);
  } else {
    links.push(newLink);
    saveLinks(links);
    renderLinks();
  }
}

function deleteLink(i) {
  const links = getLinks();
  links.splice(i, 1);
  saveLinks(links);
  renderLinks();
}

function removeAllLinks() {
  if (confirm('Delete all?')) {
    localStorage.removeItem('myLinks');
    renderLinks();
  }
}

function openLink(url) {
  const iframeContainer = document.querySelector('.iframeContainer');
  const iframe = document.getElementById('iframeLink');
  iframeContainer.style.display = 'flex';

  // Load blank page first to prepare iframe
  iframe.src = 'about:blank';

  iframe.onload = () => {
    try {
      const targetUrl = url.startsWith('http') ? url : 'https://' + url;
      iframe.contentWindow.location.replace(targetUrl);
    } catch (e) {
      // Fallback for cross-origin restrictions
      iframe.src = targetUrl;
    }
    iframe.onload = null; // Remove handler after first use
  };
}

function closeIframe() {
  const iframeContainer = document.querySelector('.iframeContainer');
  const iframe = document.getElementById('iframeLink');
  iframeContainer.style.display = 'none';
  iframe.src = 'about:blank'; // Clear iframe to avoid history leakage
}

function importLinks() {
  const file = document.getElementById('file-input').files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result;
    const links = getLinks();
    if (file.name.endsWith('.html')) {
      const doc = new DOMParser().parseFromString(text, 'text/html');
      [...doc.querySelectorAll('a')].forEach(a =>
        links.push({ url: a.href, title: a.textContent, image: './Assests/Imgs/Logo.png', added: Date.now() })
      );
    } else {
      text.split('\n').forEach(line => {
        const [title, url] = line.split(',');
        if (url && title) links.push({ title: title.trim(), url: url.trim(), image: './Assests/Imgs/Logo.png', added: Date.now() });
      });
    }
    saveLinks(links);
    renderLinks();
  };
  reader.readAsText(file);
}

window.onload = () => {
  renderLinks();
  sortSelect.onchange = renderLinks;
};
