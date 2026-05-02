# Wedvite — Phase 1 Plan (Revised v3)
## Interactive Wedding Invitation Card — Sri Lankan Kandyan Style

**Goal:** Build a pure frontend web app where users create a beautiful, romantic Sri Lankan Kandyan-style interactive wedding invitation card, personalize it with an invitee name, and share it via WhatsApp, Email, or copy link. RSVP responses are tracked in a Google Sheet via Google Apps Script.

**Key Idea:** All card data is encoded in the URL. Each invitee gets a personalized link. When an invitee is added on the Share page, they are also registered in a Google Sheet. When the invitee RSVPs, the sheet is updated with their response.

---

## 1. Product Overview

### User Flow
1. User visits app → **Landing Page**
2. Clicks "Create Your Invitation" → **Card Creator** form
3. Customizes: message, colors, font, pattern (couple details + Poruwa time hardcoded)
4. Clicks "Share with Guests" → sees a **Share Page** with the card preview
5. Enters invitee names one by one → generates personalized share link per invitee → **invitee is added to Google Sheet** (Participate column empty)
6. Shares via WhatsApp / Email / Copy Link
7. Recipient opens link → sees **animated envelope** with their name → taps to open
8. **Kandyan-style wedding card** with couple image, Poruwa ceremony time, full details
9. RSVP form → invitee responds Yes/No → **Google Sheet updated** (row turns green for Yes, red for No)

### What It Does NOT Do (Phase 1)
- No database / backend / API (Google Apps Script is the only external call)
- No authentication / accounts
- No image uploads (Kandyan couple image is a static asset)
- No invitee list management in the app (managed via Google Sheet)

---

## 2. Tech Stack

| Layer | Choice | Cost |
|-------|--------|------|
| Framework | **Next.js 16 (App Router)** | $0 |
| Language | **TypeScript** | $0 |
| Styling | **Tailwind CSS 4** | $0 |
| Animation | **Framer Motion** | $0 |
| Image Export | **html-to-image** | $0 |
| RSVP Tracking | **Google Sheets + Apps Script** | $0 |
| Deployment | **Vercel** | $0 |
| Fonts | **next/font** (Great Vibes, Playfair Display, Cormorant Garamond) | $0 |

**Total monthly cost: $0**

---

## 3. URL Structure

```
/                                → Landing page
/create                          → Card creator form
/create/share?data=...           → Share page (generate links per invitee)
/invite?data=...&to=InviteeName  → Public invitation card (recipient view)
```

Card data is base64-encoded JSON in the `data` query param. Invitee name is in the `to` param.

---

## 4. Data Shape (URL-encoded)

```typescript
interface CardData {
  groom: string;
  bride: string;
  date: string;          // ISO date string
  time: string;          // Wedding time
  poruwaTime: string;    // Poruwa ceremony auspicious time (e.g. "9:45 AM")
  venue: string;
  mapLink?: string;      // Google Maps link
  message: string;
  primaryColor: string;
  accentColor: string;
  pattern: string;       // "floral" | "hearts" | "minimal" | "sparkle"
  font: string;          // "classic" | "modern" | "romantic"
}
```

Encoded as: `btoa(encodeURIComponent(JSON.stringify(cardData)))` → URL param `?data=...`

---

## 5. Sri Lankan Kandyan Theme

### Design Direction
- **Full romantic & cute** aesthetic with traditional Kandyan elegance
- Gold & maroon/deep red color palette (traditional Kandyan colors)
- Ornamental borders inspired by Kandyan art (lotus, liyavel/scroll patterns)
- **Sri Lankan Kandyan couple image** — static illustration/image of a couple in traditional Kandyan wedding attire (saree & national dress), placed prominently on the open card
- Image stored in `public/images/kandyan-couple.png`

### Poruwa Ceremony
- **Poruwa ceremony time** displayed as a highlighted section on the invitation card
- Shown with a special ornamental frame: "🪷 Poruwa Ceremony at {poruwaTime}"
- This is the auspicious time — distinct from the general wedding event time

### Card Visual Flow
1. **Envelope (closed):** Elegant envelope with Kandyan-style gold border, invitee name ("Dear {Name}"), couple names, floating petals, "Tap to Open" prompt
2. **Open animation:** Envelope flips open → card slides up → golden confetti + lotus petals rain
3. **Open card:** Full Kandyan wedding card with:
   - Kandyan couple image at the top
   - "Together with their families" header
   - Couple names in elegant script
   - Poruwa ceremony time (highlighted, ornamental frame)
   - Wedding date & time
   - Venue + Get Directions
   - Personal message
   - RSVP button

---

## 6. Google Sheets RSVP Tracking

### Architecture
- A **Google Sheet** with two columns: `Invitee Name` | `Participate`
- A **Google Apps Script** deployed as a Web App (public, anyone can call)
- The script exposes a `doPost()` handler that accepts JSON

### Flow

**Step 1 — When creator adds an invitee (Share page):**
```
POST → Apps Script URL
Body: { "action": "add", "name": "Uncle Raj" }
```
→ Adds row: `Uncle Raj` | *(empty)*

**Step 2 — When invitee sends RSVP (Invite page):**
```
POST → Apps Script URL
Body: { "action": "rsvp", "name": "Uncle Raj", "participate": "Yes" }
```
→ Finds row by name → Updates Participate to `Yes` or `No`
→ Colors the row: **green for Yes**, **red for No**

### Google Apps Script (to be created)
```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  if (data.action === "add") {
    sheet.appendRow([data.name, ""]);
  }

  if (data.action === "rsvp") {
    const rows = sheet.getDataRange().getValues();
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === data.name) {
        const row = i + 1;
        sheet.getRange(row, 2).setValue(data.participate);
        const color = data.participate === "Yes" ? "#d4edda" : "#f8d7da";
        sheet.getRange(row, 1, 1, 2).setBackground(color);
        break;
      }
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### App-Side Integration
- `lib/google-sheet.ts` — helper to POST to the Apps Script URL
- Apps Script URL stored in `lib/constants.ts` as `GOOGLE_SCRIPT_URL`
- Share page calls `addInvitee(name)` when generating a link
- Invite page calls `updateRsvp(name, "Yes" | "No")` when RSVP is submitted

### Google Sheet Visual
| Invitee Name | Participate |
|---|---|
| Uncle Raj | *(empty — pending)* |
| Aunt Kamala | Yes *(row green #d4edda)* |
| Cousin Sahan | No *(row red #f8d7da)* |

---

## 7. Share Message Template

```
💍 You're Invited!

{groomName} & {brideName} would love for you to celebrate their special day!

📅 {weddingDate} at {weddingTime}
🪷 Poruwa Ceremony at {poruwaTime}
📍 {venue}

Open your personal invitation here:
🔗 {inviteLink}

We can't wait to see you there! 💕
```

---

## 8. Technical Architecture

```
wedvite-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, metadata)
│   │   ├── page.tsx                # Landing page
│   │   ├── globals.css             # Tailwind CSS + theme vars
│   │   ├── favicon.ico
│   │   ├── create/
│   │   │   ├── page.tsx            # Card creator form + live preview
│   │   │   └── share/
│   │   │       └── page.tsx        # Share page + Google Sheet add invitee
│   │   └── invite/
│   │       └── page.tsx            # Kandyan card + envelope + RSVP + Google Sheet update
│   └── lib/
│       ├── card-data.ts            # CardData interface + encode/decode
│       ├── share.ts                # Share message builder + URLs
│       ├── constants.ts            # Hardcoded card data, themes, GOOGLE_SCRIPT_URL
│       └── google-sheet.ts         # addInvitee() + updateRsvp() helpers
├── public/
│   └── images/
│       └── kandyan-couple.png      # Sri Lankan Kandyan couple illustration
├── docs/
│   └── plans/
│       └── phase-1-plan.md         # This file
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## 9. Progress Tracker

### Cleanup
- [x] T01 — Remove auth files, DB files, Prisma, protected routes, auth dependencies
- [x] T02 — Clean package.json

### Core (Done)
- [x] T03 — Build `lib/card-data.ts` (encode/decode card data to URL params)
- [x] T04 — Build `lib/share.ts` (generate share message + URLs)
- [x] T05 — Build Card Creator page (`/create`) with live preview
- [x] T06 — Build Share page (`/create/share`) with invitee name input + link generation
- [x] T07 — Build Invitation Card page (`/invite`) with envelope animation + card content
- [x] T08 — Build visual RSVP form (thank-you on submit)
- [x] T09 — Update Landing page

### New — Sri Lankan Kandyan Theme
- [ ] T12 — Add `poruwaTime` field to `CardData` interface and hardcoded constants
- [ ] T13 — Add Kandyan couple image to `public/images/kandyan-couple.png`
- [ ] T14 — Redesign envelope (closed state) with Kandyan gold/maroon style, ornamental borders
- [ ] T15 — Redesign open card with Kandyan couple image, Poruwa ceremony time section, romantic Kandyan aesthetic
- [ ] T16 — Update card preview in `/create` page to match Kandyan theme
- [ ] T17 — Update share message template to include Poruwa ceremony time

### New — Google Sheets RSVP Tracking
- [ ] T18 — Create Google Sheet + Apps Script web app (manual setup)
- [ ] T19 — Build `lib/google-sheet.ts` (addInvitee + updateRsvp helpers)
- [ ] T20 — Integrate addInvitee() call on Share page when generating invitee link
- [ ] T21 — Integrate updateRsvp() call on Invite page when RSVP is submitted
- [ ] T22 — Add `GOOGLE_SCRIPT_URL` to constants

### Polish
- [ ] T10 — Mobile responsive testing & fixes
- [ ] T11 — Deploy to Vercel

---

## 10. Risks

| Risk | Mitigation |
|------|-----------|
| URL too long with all card data | Base64 JSON is ~300-500 chars. Well within URL limits (~2000 chars). |
| Google Apps Script latency | ~1-2s per call. Show loading spinner. Non-blocking — card works even if call fails. |
| Apps Script URL is public | Anyone could POST, but data is just names + yes/no. Low risk for a wedding. |
| Kandyan couple image size | Optimize PNG, keep under 200KB for fast load. |
| Card data visible in URL | Not sensitive data. Acceptable. |

---

## 11. Future Phases

- **Phase 2:** Database (Neon PostgreSQL), persistent cards, RSVP tracking, invitee management
- **Phase 3:** User accounts + auth, dashboard, multi-card management
- **Phase 4:** Google Drive image picker, custom photos
- **Phase 5:** Multiple templates, RSVP analytics, bulk invitee import
- **Phase 6:** Premium features, custom domains, PDF export

---

## 12. Implementation Order (Recommended)

1. **T12** — Add `poruwaTime` to data shape + constants
2. **T13** — Add Kandyan couple image asset
3. **T14–T16** — Redesign envelope + open card + preview with Kandyan theme
4. **T17** — Update share message template
5. **T18** — Set up Google Sheet + Apps Script (manual)
6. **T19** — Build `lib/google-sheet.ts`
7. **T20–T22** — Integrate Google Sheet calls into Share + Invite pages
8. **T10–T11** — Mobile polish + deploy
