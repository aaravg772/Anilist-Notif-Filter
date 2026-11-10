const API = "https://graphql.anilist.co";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type !== "ALM_FETCH_DATA") return;
  
  (async () => {
    const { token } = await chrome.storage.local.get("token");
    if (!token) throw new Error("Connect AniList in the extension popup first.");

    // Select notification types based on the requested tab mode
    const types = msg.mode === "replies" 
      ? ["ACTIVITY_REPLY"] 
      : ["ACTIVITY_MENTION", "THREAD_COMMENT_MENTION"];

    const query = `
      query FilteredNotifs($page: Int!, $perPage: Int!, $types: [NotificationType]) {
        Page(page: $page, perPage: $perPage) {
          pageInfo { currentPage hasNextPage }
          notifications(
            type_in: $types
            resetNotificationCount: false
          ) {
            __typename
            ... on ActivityMentionNotification {
              createdAt context
              user { id name avatar { large } }
              activity {
                ... on TextActivity { siteUrl text(asHtml: true) user { id name } }
                ... on ListActivity { siteUrl status progress user { id name } media { title { userPreferred } coverImage { large } } }
              }
            }
            ... on ThreadCommentMentionNotification {
              createdAt context
              user { id name avatar { large } }
              thread { id title siteUrl }
              comment { id comment(asHtml: true) user { id name } }
            }
            ... on ActivityReplyNotification {
              createdAt context
              user { id name avatar { large } }
              activity {
                ... on TextActivity { siteUrl text(asHtml: true) user { id name } }
                ... on ListActivity { siteUrl status progress user { id name } media { title { userPreferred } coverImage { large } } }
              }
            }
          }
        }
      }`;

    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ query, variables: { page: msg.page || 1, perPage: 25, types } })
    });

    const data = await response.json();
    if (!response.ok || data.errors?.length) {
      throw new Error(data.errors?.[0]?.message || `AniList API error (${response.status})`);
    }

    sendResponse({ ok: true, data: data.data.Page });
  })().catch(error => sendResponse({ ok: false, error: error.message }));

  return true;
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type !== "ALM_GET_STATUS") return;
  chrome.storage.local.get("token").then(({token}) => sendResponse({ connected: !!token }));
  return true;
});