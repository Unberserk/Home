const bookmarkList = document.getElementById('bookmarkList');
const addBtn = document.getElementById('addBookmarkBtn');
const saveBtn = document.getElementById('saveBookmark');
const modal = document.getElementById('addModal');
const closeModal = document.getElementById('closeModal');
const searchInput = document.getElementById('search');
const importFile = document.getElementById('importFile');

function loadBookmarks() {
  const data = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  displayBookmarks(data);
}

function displayBookmarks(bookmarks) {
  bookmarkList.innerHTML = '';
  bookmarks.forEach((b, i) => {
    const el = document.createElement('div');
    el.className = 'bookmark';
    el.innerHTML = `
      <h3><a href="${b.url}" target="_blank">${b.title}</a></h3>
      <small>${b.url}</small>
      <small>Tags: ${b.tags.join(', ')}</small>
      <button onclick="deleteBookmark(${i})">Delete</button>
    `;
    bookmarkList.appendChild(el);
  });
}

function deleteBookmark(index) {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  bookmarks.splice(index, 1);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  loadBookmarks();
}

addBtn.onclick = () => {
  modal.style.display = 'flex';
};

closeModal.onclick = () => {
  modal.style.display = 'none';
};

saveBtn.onclick = () => {
  const title = document.getElementById('newTitle').value;
  const url = document.getElementById('newURL').value;
  const tags = document.getElementById('newTags').value.split(',').map(t => t.trim());

  if (!title || !url) return alert('Missing title or URL');

  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  bookmarks.push({ title, url, tags });
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  modal.style.display = 'none';
  loadBookmarks();
};

searchInput.oninput = () => {
  const query = searchInput.value.toLowerCase();
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  const filtered = bookmarks.filter(b =>
    b.title.toLowerCase().includes(query) ||
    b.url.toLowerCase().includes(query) ||
    b.tags.join(',').toLowerCase().includes(query)
  );
  displayBookmarks(filtered);
};

importFile.onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const html = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const links = [...doc.querySelectorAll('a')].map(a => ({
    title: a.textContent,
    url: a.href,
    tags: []
  }));
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  localStorage.setItem('bookmarks', JSON.stringify([...bookmarks, ...links]));
  loadBookmarks();
};

window.onload = loadBookmarks;
