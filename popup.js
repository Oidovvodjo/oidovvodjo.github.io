const list = document.getElementById("cookieList");
const info = document.getElementById("info");
const deleteAllBtn = document.getElementById("deleteAll");

let currentCookies = [];
let currentUrl = "";

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  const tab = tabs[0];
  const url = new URL(tab.url);
  currentUrl = url.origin;

  info.textContent = `Domeen: ${url.hostname}`;

  chrome.cookies.getAll({ domain: url.hostname }, cookies => {
    currentCookies = cookies;
    renderCookies(cookies);
  });
});

function renderCookies(cookies) {
  list.innerHTML = "";

  if (cookies.length === 0) {
    list.innerHTML = "<li>Ei leitud küpsiseid</li>";
    return;
  }

  cookies.forEach(cookie => {
    const li = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = cookie.name;
    name.className = "cookie-name";

    const del = document.createElement("span");
    del.textContent = "✖";
    del.className = "delete";

    del.onclick = () => deleteCookie(cookie);

    li.appendChild(name);
    li.appendChild(del);
    list.appendChild(li);
  });
}

function deleteCookie(cookie) {
  const url =
    (cookie.secure ? "https://" : "http://") +
    cookie.domain.replace(/^\./, "") +
    cookie.path;

  chrome.cookies.remove({
    url: url,
    name: cookie.name
  }, () => {
    currentCookies = currentCookies.filter(c => c.name !== cookie.name);
    renderCookies(currentCookies);
  });
}

deleteAllBtn.onclick = () => {
  currentCookies.forEach(deleteCookie);
};
const blockedDiv = document.createElement("div");
blockedDiv.innerHTML = "<h2>⛔ Blokeeritud</h2>";
document.body.appendChild(blockedDiv);

const blockedList = document.createElement("ul");
blockedDiv.appendChild(blockedList);

chrome.storage.local.get("blocked", data => {
  (data.blocked || []).forEach(b => {
    const li = document.createElement("li");
    li.textContent = `[${b.time}] ${new URL(b.url).hostname}`;
    blockedList.appendChild(li);
  });
});
