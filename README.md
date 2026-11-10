# Anilist-Notif-Filter

INSTALL
1. Extract the ZIP.
2. Open chrome://extensions
3. Enable Developer mode.
4. Click Load unpacked and select this folder.
5. Open https://anilist.co/notifications and refresh.

CONNECT
1. Open the extension popup.
2. Expand "How to get a token".
3. Create an AniList API app at https://anilist.co/settings/developer
4. Set Redirect URL to: https://anilist.co/api/v2/oauth/pin
5. Enter the app's Client ID and click "Authorize with AniList".
6. Approve the app. Copy the access token shown by AniList's PIN page.
7. Paste it in the popup and click Save token.
8. Refresh AniList Notifications and click Mentions.

WHAT IT DOES
- Adds Mentions directly after the native All filter in AniList's .filter-group.
- Fetches only ACTIVITY_MENTION and THREAD_COMMENT_MENTION from AniList GraphQL.
- Does not reset AniList's unread notification count.
- Loads 25 results per page with a Load more button.
- Stores the API token in chrome.storage.local.

SECURITY
- Never enter your AniList password here.
- Do not share your access token or extension folder with others.
- Disconnect in the popup to remove the locally stored token.

NOTES
The extension targets the exact notification sidebar DOM observed in your console output.
AniList may change its API schema or page layout; if it does, the extension may need updating.
