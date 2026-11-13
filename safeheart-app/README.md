# Safe Heart app: setup guide

This folder is a complete, free Safe Heart app. People can open it in their phone's browser and add it to their home screen, where it works like an app. You don't need an app store, a paid account, a database, or any coding.

**Cost: $0.** It uses GitHub Pages (free hosting), your existing Jotform, and Google Forms (free).

---

## What's in the folder

| File | What it is | Will you edit it? |
|---|---|---|
| `config.json` | The three form links | **Yes**, once (paste your Google Form links) |
| `shows.json` | Your upcoming shows | **Yes**, whenever you have a show |
| `index.html` | The page and its wording | Only to change wording |
| `styles.css` | Colors and layout | No |
| `app.js` | Makes the buttons and show list work | No |
| `manifest.webmanifest`, `sw.js` | Make it installable and open offline | No |
| `icons/` | The app icon and header logo (your Safe Heart logo) | No |

---

## 1. Connect your forms

### File a Claim: already connected
`config.json` already points to your existing Jotform:
`https://form.jotform.com/251616991657065`

Claims go to your Jotform account, the same as now. Before you launch, open the form once and check that it only asks for what you really need.

### Make the two Google Forms (about 10 minutes)
Sign in at **forms.google.com** with your Google account and make two forms.

#### Form A: "Safe Heart Show RSVP"
1. Click **Blank form** and give it the title **Safe Heart Show RSVP**.
2. Add these questions. Use the "+" button and choose the type on the right.
   - **Name or nickname**: Short answer, Required
   - **Email**: Short answer, Required. Click ⋮ → **Response validation** → *Text* → *Email*. Add this description: "We only use this to send details about the show."
   - **Which show?**: Dropdown, Required. Type each show's name and date as an option.
   - **How many people, including you?**: Dropdown (1, 2, 3, 4), Required
   - **Anything we should know? (for example, accessibility needs)**: Paragraph, Optional

#### Form B: "Share Your Story with Safe Heart"
1. Click **Blank form** and give it the title **Share Your Story with Safe Heart**.
2. In the form description, paste:
   > Your story is private. Only the Safe Heart team can read it, and it is never posted automatically. Please leave out other people's full names, addresses, and other private details. Safe Heart isn't a crisis service. If you're in danger or thinking about hurting yourself, call or text 988.
3. Add these questions:
   - **Your story**: Paragraph, **Required**
   - **Name or nickname (leave blank to stay anonymous)**: Short answer, Optional
   - **Permission to contact you**: **Checkboxes**, **Optional**, with exactly one option:
     *"Yes, Safe Heart may contact me about sharing my story."*
   - **Email (only if you checked the box above)**: Short answer, Optional. Use Response validation → *Text* → *Email*.

#### Privacy settings (do this on both forms)
Open the **Settings** tab:
- **Responses → Collect email addresses → Do not collect.** Your own email question is enough.
- **Responses → Limit to 1 response → Off.** Otherwise visitors would need a Google account.
- **Responses → Allow response editing → Off.**
- **Presentation → View results summary → Off.** Visitors can't see other people's answers.

Who can see the responses: only you, plus anyone you add as a collaborator. Don't add collaborators unless you mean to share access. If you link a Google Sheet, it stays private to you too.

#### Copy each form link
In each form, click **Send** → the **link** tab (🔗) → tick **Shorten URL** → **Copy**.
You'll get links like `https://forms.gle/AbC123xyz`.

### Paste the links into `config.json`
Replace the two placeholders, and keep the quote marks:

```json
{
  "claimFormUrl": "https://form.jotform.com/251616991657065",
  "showSignupFormUrl": "https://forms.gle/YOUR-RSVP-FORM",
  "storyFormUrl": "https://forms.gle/YOUR-STORY-FORM"
}
```

Until a real link is pasted in, its button shows as grayed out with "coming soon." No one gets a broken link.

---

## 2. Put it online for free (GitHub Pages)

1. **Make a free GitHub account** at **github.com/signup**.
2. **Make a repository** (a folder that lives on GitHub). Click the **+** at the top right → **New repository**.
   - Repository name: `safeheart`
   - Choose **Public**. Free hosting needs this. There's nothing private in these files.
   - Click **Create repository**.
3. **Upload the files.** On the new repository page, click **uploading an existing file**.
   - Unzip `safeheart-app.zip` on your computer.
   - Open the unzipped folder, select **everything inside it** (including the `icons` folder), and drag it all onto the GitHub page.
   - Wait until every file is listed, then click **Commit changes**.
4. **Turn on the website.** Go to **Settings** (top of the repository) → **Pages** (left side).
   - Under **Build and deployment → Source**, choose **Deploy from a branch**.
   - Branch: **main**, folder: **/ (root)**. Click **Save**.
5. Wait 1–2 minutes and refresh. GitHub shows your link:
   **`https://YOUR-GITHUB-USERNAME.github.io/safeheart/`**
   Open it on your phone. That's the app.

**Optional:** add a button on maronziomvance.com/safeheart that links to this address.

---

## 3. Update shows (no rebuilding)

1. On GitHub, open your `safeheart` repository and click **shows.json**.
2. Click the **pencil** ✏️ (Edit), make your changes, and click **Commit changes**.
3. The app updates in about a minute.

Each show looks like this:

```json
{
  "name": "Safe Heart Live: Starting Over",
  "date": "2027-01-15",
  "time": "8:00 PM",
  "location": "Venue name, address, city",
  "rsvpUrl": "",
  "notes": "Doors open at 7:30.",
  "draft": false
}
```

- **date** must be written as **YEAR-MONTH-DAY** (for example `2027-01-15`). Shows hide themselves after their date passes.
- **rsvpUrl**: leave it as `""` to use your RSVP Google Form, or paste a different link (for example a ticket page).
- **draft**: `true` hides the show from visitors. To preview drafts, add `?preview` to the end of your app link.
- To list more than one show, separate the entries with a comma: `[ {show 1}, {show 2} ]`.
- The starter file has one placeholder show marked `"draft": true`. Edit it and set `"draft": false` when it's real.

If you make a typo (like a missing quote mark or comma), the app shows "Show details couldn't load" instead of breaking. Fix the typo and it comes right back.

---

## 4. Add it to a phone's home screen

**iPhone:** Open the app link in **Safari** → tap **Share** (square with an up arrow) → **Add to Home Screen** → **Add**.

**Android:** Open the link in **Chrome** → tap **⋮** (top right) → **Add to Home screen** or **Install app**. On Android, the app also shows its own **Install app** button at the top.

The Safe Heart logo appears on the home screen, and the app opens full screen like a normal app.

---

## 5. Privacy at a glance
- No accounts, no ads, no tracking scripts, no cookies, and no web fonts loaded from other companies.
- The app itself stores nothing anyone types. Every answer goes straight to your Jotform or Google Form.
- Stories are private to you and are never published by the app.
- The app shows visitors a "Where your answers go" section that explains this in plain words.

---

## Changing the app's look or wording later
To change wording, edit `index.html` on GitHub the same way you edit shows. After changing `index.html`, `styles.css` or `app.js`, open `sw.js` and raise the number in `safeheart-v2` by one (v3, then v4, and so on). That makes phones pick up the new version.
