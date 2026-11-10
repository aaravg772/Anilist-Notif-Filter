(() => {
  if (window.__AL_MENTIONS_FILTER__) return;
  window.__AL_MENTIONS_FILTER__ = true;

  const PANEL_ID = "alm-custom-panel";
  const BTN_GROUP_ID = "alm-custom-btns";
  const STYLE_ID = "alm-custom-styles";

  let currentMode = null; // 'mentions' | 'replies' | null
  let currentPage = 1;
  let hasNextPage = false;
  let loading = false;

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${PANEL_ID} {
        box-sizing: border-box;
      }
      #${PANEL_ID} .alm-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 0 2px;
      }
      #${PANEL_ID} #alm-panel-title {
        font-size: 2rem;
        font-weight: 600;
        color: var(--color-text, rgb(159, 173, 186));
        margin: 0;
      }
      #${PANEL_ID} .alm-refresh-btn,
      #${PANEL_ID} .alm-more-btn {
        background: rgb(61, 180, 242);
        border: none;
        color: #fff;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1.3rem;
        transition: background 0.2s;
      }
      #${PANEL_ID} .alm-refresh-btn:hover,
      #${PANEL_ID} .alm-more-btn:hover {
        background: rgb(92, 192, 245);
      }
      #${PANEL_ID} .alm-status {
        color: var(--color-text-light, rgb(116, 136, 153));
        padding: 20px 0;
        font-size: 1.4rem;
        text-align: center;
      }
      #${PANEL_ID} .alm-notif-item {
        display: flex;
        align-items: center;
        background: var(--color-background-secondary, rgb(21, 31, 46));
        padding: 12px 16px;
        margin-bottom: 10px;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        box-sizing: border-box;
        width: 100%;
      }
      #${PANEL_ID} .alm-avatar {
        flex-shrink: 0;
        width: 44px;
        height: 44px;
        margin-right: 14px;
        border-radius: 6px;
        background-size: cover;
        background-position: center;
        display: block;
      }
      #${PANEL_ID} .alm-details {
        flex-grow: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      #${PANEL_ID} .alm-user-wrap {
        white-space: nowrap;
        overflow: hidden;
      }
      #${PANEL_ID} .alm-user-link {
        color: var(--color-text-bright, rgb(255, 255, 255));
        font-weight: 600;
        font-size: 1.4rem;
        text-decoration: none;
        display: inline-block;
      }
      #${PANEL_ID} .alm-user-link:hover {
        text-decoration: underline;
      }
      #${PANEL_ID} .alm-activity-link {
        color: var(--color-text-light, rgb(116, 136, 153));
        font-size: 1.2rem;
        text-decoration: none;
        margin-left: 6px;
      }
      #${PANEL_ID} .alm-activity-link:hover {
        color: rgb(61, 180, 242);
        text-decoration: underline;
      }
      #${PANEL_ID} .alm-time {
        color: var(--color-text-light, rgb(116, 136, 153));
        font-size: 1.1rem;
        margin-top: 3px;
        line-height: 1;
      }
      #${PANEL_ID} .alm-more-wrap {
        margin-top: 20px;
        text-align: center;
        padding-bottom: 20px;
      }
    `;
    document.head.appendChild(style);
  }

  function timeAgo(ts) {
    if (!ts) return "";
    const diff = Math.max(0, Date.now() / 1000 - ts);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(ts * 1000).toLocaleDateString();
  }

  function getSidebar() {
    const links = document.querySelectorAll(".filter-group .link");
    for (const link of links) {
      if (link.textContent.trim() === "All") {
        return link.parentElement;
      }
    }
    return null;
  }

  function getMainContainer() {
    const sidebar = getSidebar();
    if (!sidebar || !sidebar.parentElement) return null;

    const parent = sidebar.parentElement;
    for (const child of parent.children) {
      if (
        child !== sidebar &&
        child.id !== PANEL_ID &&
        !child.classList.contains("mobile-nav")
      ) {
        return child;
      }
    }
    return null;
  }

  function injectSidebarButtons() {
    const sidebar = getSidebar();
    if (!sidebar || document.getElementById(BTN_GROUP_ID)) return;

    const container = document.createElement("div");
    container.id = BTN_GROUP_ID;
    container.style.marginTop = "15px";

    const mentionsBtn = document.createElement("div");
    mentionsBtn.className = "link alm-tab-btn";
    mentionsBtn.textContent = "Mentions";
    mentionsBtn.style.cursor = "pointer";
    mentionsBtn.style.fontWeight = "600";
    mentionsBtn.style.color = "rgb(61, 180, 242)";
    mentionsBtn.addEventListener("click", () => setMode("mentions"));

    const repliesBtn = document.createElement("div");
    repliesBtn.className = "link alm-tab-btn";
    repliesBtn.textContent = "Activity Replies";
    repliesBtn.style.cursor = "pointer";
    repliesBtn.style.fontWeight = "600";
    repliesBtn.style.color = "rgb(61, 180, 242)";
    repliesBtn.style.marginTop = "8px";
    repliesBtn.addEventListener("click", () => setMode("replies"));

    sidebar.querySelectorAll(".link:not(.alm-tab-btn)").forEach(nativeLink => {
      nativeLink.addEventListener("click", () => {
        deactivate();
      });
    });

    container.appendChild(mentionsBtn);
    container.appendChild(repliesBtn);
    sidebar.appendChild(container);
  }

  function ensurePanel() {
    injectStyles();
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;

    const main = getMainContainer();
    if (!main || !main.parentElement) return null;

    panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.style.display = "none";
    panel.style.width = "100%";
    panel.innerHTML = `
      <div class="alm-header">
        <h2 id="alm-panel-title">Mentions</h2>
        <button class="alm-refresh-btn" type="button">Refresh</button>
      </div>
      <div class="alm-status">Loading…</div>
      <div class="alm-list"></div>
      <div class="alm-more-wrap">
        <button class="alm-more-btn" type="button" hidden>Load More</button>
      </div>
    `;

    main.parentElement.appendChild(panel);

    panel.querySelector(".alm-refresh-btn").addEventListener("click", () => loadPage(1, true));
    panel.querySelector(".alm-more-btn").addEventListener("click", () => loadPage(currentPage + 1, false));

    return panel;
  }

  function setMode(mode) {
    currentMode = mode;
    const searchParam = mode === "replies" ? "replies=1" : "mentions=1";
    
    if (!location.search.includes(searchParam)) {
      history.pushState({}, "", `/notifications?${searchParam}`);
    }

    activate(mode);
  }

  function activate(mode) {
    currentMode = mode;
    const panel = ensurePanel();
    const main = getMainContainer();
    if (!panel || !main) return;

    const titleElem = panel.querySelector("#alm-panel-title");
    if (titleElem) {
      titleElem.textContent = mode === "replies" ? "Activity Replies" : "Mentions";
    }

    main.style.display = "none";
    panel.style.display = "block";

    loadPage(1, true);
  }

  function deactivate() {
    currentMode = null;
    const panel = document.getElementById(PANEL_ID);
    const main = getMainContainer();
    if (panel) panel.style.display = "none";
    if (main) main.style.display = "";
  }

  function renderNotification(n) {
    const user = n.user || {};
    const avatar = user.avatar?.large || "";
    const userName = user.name || "Someone";
    const isThread = n.__typename === "ThreadCommentMentionNotification";

    // Extract exact URL of the activity post or forum comment
    let activityUrl = `https://anilist.co/notifications`;
    if (isThread) {
      activityUrl = n.thread?.siteUrl || `https://anilist.co/forum/thread/${n.thread?.id || ""}`;
    } else if (n.activity?.siteUrl) {
      activityUrl = n.activity.siteUrl;
    }

    const card = document.createElement("div");
    card.className = "alm-notif-item";
    card.innerHTML = `
      <a class="alm-avatar" href="${activityUrl}" style="background-image: url('${avatar}');"></a>
      <div class="alm-details">
        <div class="alm-user-wrap">
          <a class="alm-user-link" href="https://anilist.co/user/${userName}">${userName}</a>
          <a class="alm-activity-link" href="${activityUrl}">→ post</a>
        </div>
        <div class="alm-time">${timeAgo(n.createdAt)}</div>
      </div>
    `;
    return card;
  }

  async function loadPage(page, reset) {
    const panel = ensurePanel();
    if (!panel || loading || !currentMode) return;
    loading = true;

    const status = panel.querySelector(".alm-status");
    const list = panel.querySelector(".alm-list");
    const more = panel.querySelector(".alm-more-btn");

    status.textContent = `Loading ${currentMode}…`;
    more.hidden = true;

    if (reset) {
      list.replaceChildren();
      currentPage = 1;
    }

    chrome.runtime.sendMessage({ type: "ALM_FETCH_DATA", mode: currentMode, page }, (response) => {
      loading = false;
      if (chrome.runtime.lastError) {
        status.textContent = chrome.runtime.lastError.message;
        return;
      }
      if (!response?.ok) {
        status.textContent = response?.error || `Could not load ${currentMode}.`;
        return;
      }

      const items = response.data.notifications || [];
      if (reset && items.length === 0) {
        status.textContent = `No ${currentMode} found.`;
      } else {
        status.textContent = "";
      }

      for (const item of items) {
        list.appendChild(renderNotification(item));
      }

      currentPage = page;
      hasNextPage = !!response.data.pageInfo?.hasNextPage;
      more.hidden = !hasNextPage;
    });
  }

  setInterval(() => {
    if (!location.pathname.startsWith("/notifications")) return;

    injectSidebarButtons();

    const params = new URL(location.href).searchParams;
    const isMentions = params.get("mentions") === "1";
    const isReplies = params.get("replies") === "1";

    const targetMode = isMentions ? "mentions" : isReplies ? "replies" : null;
    const panel = document.getElementById(PANEL_ID);

    if (targetMode) {
      if (!panel || panel.style.display === "none" || currentMode !== targetMode) {
        activate(targetMode);
      }
    } else if (panel && panel.style.display !== "none") {
      deactivate();
    }
  }, 300);
})();