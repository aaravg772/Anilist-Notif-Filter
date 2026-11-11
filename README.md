# AniList Mentions & Activity Replies Filter

A lightweight, native-styled browser extension for [AniList](https://anilist.co) that adds dedicated **Mentions** and **Activity Replies** tabs to your notifications page. Say goodbye to scrolling through a cluttered main feed just to check who replied to you!

---

##  Features
*  **Dedicated Tabs**: Adds clean "Mentions" and "Activity Replies" links directly into your AniList notification sidebar.
*  **Native UI Integration**: Styled to match AniList's dark mode and standard card aesthetics seamlessly.
*  **Direct Navigation**: Click a user's avatar or post link to jump straight to the exact activity or forum comment.
*  **Secure & Private**: Uses official AniList API tokens stored securely and locally on your browser. No third-party servers involved.

---

## 📦 How to Install

### Step 1: Download the Extension Files
1. Scroll to the top of this GitHub repository page.
2. Click the green **`<> Code`** button.
3. Click **Download ZIP**.
4. Once downloaded, find the `.zip` file on your computer and **unzip/extract** it into a folder. *(Keep this folder somewhere safe, like your Desktop or Documents).*

---

### Step 2: Choose Your Browser

**`manifest.firefox.json`** is only for Firefox.

#### Option A: Chrome / Vivaldi / Brave / Edge
1. Open your Chromium-based browser.
2. Type or paste **`chrome://extensions`** into your address bar and hit **Enter**.
3. In the top-right corner, turn **Developer mode** **ON** (toggle switch).
4. Click **Load unpacked** in the top-left corner.
5. Select the **unzipped folder** you extracted in Step 1 (the folder containing `manifest.json`).

#### Option B: Firefox
1. Rename **`manifest.firefox.json`** to **`manifest.json`** and delete the original **`manifest.json`**
1. Open Firefox.
2. Type or paste **`about:debugging#/runtime-this-firefox`** into your address bar and hit **Enter**.
3. Click **Load Temporary Add-on...**
4. Open the unzipped folder from Step 1 and select the **`manifest.json`** file.

🎉 **You're all set!** The extension is now active in your browser.

---

## How to Use
1. Head over to [AniList.co](https://anilist.co) and make sure you are logged in.
2. Go to your **Notifications** page.
3. Look at the sidebar on the left—you will see new **Mentions** and **Activity Replies** buttons right below your filter links.
4. Click either one to filter your notifications instantly!

---

## 🛠️ Troubleshooting
- **"Could not load notifications" error?** Make sure you are logged into AniList in your browser. 
- **Extension disappeared after a restart (Chrome)?** Ensure you don't delete or move the folder you selected during the "Load unpacked" step, as Chrome needs to read those files locally.
- **Extension disappeared after restarting Firefox?** Temporary add-ons in Firefox reset when the browser completely closes. Simply repeat the 3-step Firefox install above to reload it.
