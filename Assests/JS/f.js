const linkContainer = document.getElementById("link-container");

function saveLinks(links) {
  localStorage.setItem("myLinks", JSON.stringify(links));
}

function getLinks() {
  return JSON.parse(localStorage.getItem("myLinks") || "[]");
}

function renderLinks() {
  const links = getLinks();
  linkContainer.innerHTML = "";
  links.forEach((link, index) => {
    const card = document.createElement("div");
    card.className = "link-card";
    card.innerHTML = `
      <img src="${link.image || './Assests/Imgs/Logo.png'}" alt="Thumbnail" onerror="this.src='./Assests/Imgs/Logo.png'">
      <div class="link-info">
        <h3>${link.title}</h3>
        <button onclick="openIframe('${link.url.startsWith('http') ? link.url : 'https://' + link.url}')">Open</button>
        <button onclick="deleteLink(${index})">Delete</button>
      </div>
    `;
    linkContainer.appendChild(card);
  });
}

function addLink() {
  const url = document.getElementById("link-input").value.trim();
  const title = document.getElementById("title-input").value.trim();
  if (!url || !title) return alert("Please enter a title and link");

  const imageUrl = document.getElementById("image-url-input").value.trim();
  const fileInput = document.getElementById("image-file-input");
  const links = getLinks();

  const newLink = {
    url,
    title,
    image: imageUrl || "./Assests/Imgs/Logo.png",
    added: Date.now(),
  };

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      newLink.image = e.target.result;
      links.push(newLink);
      saveLinks(links);
      renderLinks();
      clearInputs();
    };
    reader.readAsDataURL(file);
  } else {
    links.push(newLink);
    saveLinks(links);
    renderLinks();
    clearInputs();
  }
}

function clearInputs() {
  document.getElementById("link-input").value = "";
  document.getElementById("title-input").value = "";
  document.getElementById("image-url-input").value = "";
  document.getElementById("image-file-input").value = "";
}

function deleteLink(index) {
  const links = getLinks();
  links.splice(index, 1);
  saveLinks(links);
  renderLinks();
}

function removeAllLinks() {
  if (confirm("Are you sure you want to delete all links?")) {
    localStorage.removeItem("myLinks");
    renderLinks();
  }
}

function openIframe(url) {
  document.querySelector(".iframeContainer").style.display = "flex";
  const iframe = document.getElementById("iframeLink");
  iframe.src = url;
  // To simulate incognito, sandbox iframe without storage access:
  iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups");
}

function closeIframe() {
  document.querySelector(".iframeContainer").style.display = "none";
  const iframe = document.getElementById("iframeLink");
  iframe.src = "";
  iframe.removeAttribute("sandbox");
}

function importLinks() {
  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const content = e.target.result;
    const links = getLinks();

    if (file.name.endsWith(".html")) {
      const doc = new DOMParser().parseFromString(content, "text/html");
      const anchors = [...doc.querySelectorAll("a")];
      anchors.forEach((a) => {
        links.push({
          url: a.href,
          title: a.textContent || a.href,
          image: "./Assests/Imgs/Logo.png",
          added: Date.now(),
        });
      });
    } else if (file.name.endsWith(".txt")) {
      const lines = content.split("\n");
      lines.forEach((line) => {
        const [title, url] = line.split(",");
        if (url && title) {
          links.push({
            url: url.trim(),
            title: title.trim(),
            image: "./Assests/Imgs/Logo.png",
            added: Date.now(),
          });
        }
      });
    }

    saveLinks(links);
    renderLinks();
  };
  reader.readAsText(file);
}

window.onload = renderLinks;
