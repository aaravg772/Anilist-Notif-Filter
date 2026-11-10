const tokenInput = document.getElementById("token");
const clientInput = document.getElementById("client");
const status = document.getElementById("status");

chrome.storage.local.get(["token","clientId"]).then(data => {
  if (data.token) tokenInput.value = data.token;
  if (data.clientId) clientInput.value = data.clientId;
});

document.getElementById("save").addEventListener("click", async () => {
  const token = tokenInput.value.trim();
  if (!token) { status.textContent = "Paste an access token first."; return; }
  await chrome.storage.local.set({token});
  status.textContent = "Token saved. Refresh AniList Notifications.";
});

document.getElementById("clear").addEventListener("click", async () => {
  await chrome.storage.local.remove("token");
  tokenInput.value = "";
  status.textContent = "Disconnected.";
});

document.getElementById("authorize").addEventListener("click", async () => {
  const clientId = clientInput.value.trim();
  if (!/^\d+$/.test(clientId)) { status.textContent = "Enter a numeric Client ID."; return; }
  await chrome.storage.local.set({clientId});
  const url = `https://anilist.co/api/v2/oauth/authorize?client_id=${encodeURIComponent(clientId)}&response_type=token`;
  chrome.tabs.create({url});
  status.textContent = "Approve the app, then copy the token from AniList's PIN page.";
});
