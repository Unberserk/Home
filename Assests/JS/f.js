const linkContainer = document.getElementById('link-container');
const sortSelect   = document.getElementById('sortSelect');

// Load & save from LocalStorage
function getLinks() {
  return JSON.parse(localStorage.getItem('myLinks') || '[]');
}
function saveLinks(links) {
  localStorage.setItem('myLinks', JSON.stringify(links));
}

// Render bookmarks, include folder badge
function renderLinks() {
  const links = getLinks();
  links.sort(sortSelect.value === 'title'
    ? (a,b)=>a.title.localeCompare(b.title)
    : (a,b)=>a.added - b.added
  );
  saveLinks(links);

  linkContainer.innerHTML = '';
  links.forEach((link, i) => {
    const card = document.createElement('div');
    card.className = 'link-card';

    const imgSrc = link.image
      || (() => { try { return new URL(link.url).origin + '/favicon.ico'; } catch { return './Assests/Imgs/Logo.png'; } })();

    card.innerHTML = `
      <img src="${imgSrc}" alt="${link.title}" onerror="this.src='./Assests/Imgs/Logo.png'"/>
      <div class="link-info">
        <span class="folder-badge">${link.folder || 'None'}</span>
        <h3>${link.title}</h3>
        <button onclick="openLink('${link.url}')">Open</button>
        <button onclick="deleteLink(${i})">Delete</button>
      </div>
    `;
    linkContainer.appendChild(card);
  });
}

// Add new bookmark, reading folder from input
function addLink() {
  const urlEl    = document.getElementById('link-input');
  const titleEl  = document.getElementById('title-input');
  const folderEl = document.getElementById('folder-input');
  const imgUrlEl = document.getElementById('image-url-input');
  const fileEl   = document.getElementById('image-file-input');

  const url    = urlEl.value.trim();
  const title  = titleEl.value.trim();
  const folder = folderEl.value.trim();
  if (!url || !title) return alert('Please enter both title and URL');

  const links = getLinks();
  const newLink = { url, title, folder, added: Date.now() };

  if (fileEl.files.length) {
    const reader = new FileReader();
    reader.onload = e => {
      newLink.image = e.target.result;
      links.push(newLink);
      saveLinks(links);
      renderLinks();
    };
    reader.readAsDataURL(fileEl.files[0]);
  } else {
    newLink.image = imgUrlEl.value.trim() || '';
    links.push(newLink);
    saveLinks(links);
    renderLinks();
  }

  // Clear inputs
  [urlEl, titleEl, folderEl, imgUrlEl, fileEl].forEach(el => el.value = '');
}

// Delete single or all
function deleteLink(i) {
  const links = getLinks();
  links.splice(i,1);
  saveLinks(links);
  renderLinks();
}
function removeAllLinks() {
  if (confirm('Delete all?')) {
    localStorage.removeItem('myLinks');
    renderLinks();
  }
}

// Open link in iframe without polluting app history
function openLink(url) {
  const overlay = document.querySelector('.iframeContainer');
  const iframe  = document.getElementById('iframeLink');
  overlay.style.display = 'flex';
  iframe.src = 'about:blank';
  iframe.onload = () => {
    const full = url.startsWith('http') ? url : 'https://'+url;
    try { iframe.contentWindow.location.replace(full); }
    catch { iframe.src = full; }
    iframe.onload = null;
  };
}
function closeIframe() {
  document.querySelector('.iframeContainer').style.display = 'none';
  document.getElementById('iframeLink').src = 'about:blank';
}

// Import from .txt or .html
function importLinks() {
  const file = document.getElementById('file-input').files[0];
  if (!file) return alert('Please select a file');

  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result;
    const links = getLinks();

    if (file.name.endsWith('.html')) {
      const doc = new DOMParser().parseFromString(text,'text/html');
      [...doc.querySelectorAll('a')].forEach(a => {
        links.push({
          url: a.href,
          title: a.textContent || a.href,
          folder: 'Imported',
          added: Date.now()
        });
      });
    } else {
      text.split('\n').forEach(line => {
        const [title,url] = line.split(',');
        if (title && url) {
          links.push({
            title: title.trim(),
            url: url.trim(),
            folder: 'Imported',
            added: Date.now()
          });
        }
      });
    }

    saveLinks(links);
    renderLinks();
  };
  reader.readAsText(file);
}

// Init on load
window.onload = () => {
  renderLinks();
  sortSelect.onchange = renderLinks;
};
