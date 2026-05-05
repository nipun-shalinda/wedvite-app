# Wedvite — Phase 2 Plan
## Full Card Customization + User Google Sheet Integration

**Goal:** Transform the card creator from a hardcoded single-card system into a fully customizable experience. Users can enter all wedding details (parents, couple names, venue, date/time, Poruwa toggle, Google Drive image) and connect their own Google Sheet for RSVP tracking. A simple PIN system allows card recovery without needing a database or user accounts.

**Key Change from Phase 1:** Phase 1 hardcoded couple details in `constants.ts`. Phase 2 makes everything user-configurable through the `/create` form, and the data flows end-to-end via URL encoding: `/create` → `/create/share` → `/invite`. The user's Google Sheet doubles as both RSVP tracker and card data storage.

---

## 1. Product Overview

### Updated User Flow
1. User visits app → **Landing Page** (`/`)
2. **Returning user?** → "Return to My Share Page" button (from localStorage) OR "Recover My Card" option
3. **New user** → Clicks "Create Your Invitation" → **Card Creator** (`/create`)
4. **Step 1 — Details:** Enters all wedding info (parents, couple, venue, date/time, Poruwa toggle)
5. **Step 2 — Image:** Pastes Google Drive image URL (used as envelope background)
6. **Step 3 — Google Sheet:** Connects their own Google Sheet (paste Apps Script URL)
7. **Step 4 — Customize:** Message, colors, font, pattern (existing from Phase 1)
8. **Step 5 — PIN:** Sets a 4-digit PIN for card recovery
9. Clicks "Preview & Share" → **Share Page** (`/create/share?data=...`)
10. Card data saved to localStorage + backed up to Google Sheet (Config tab)
11. Adds invitees → generates personalized links → invitees added to user's Google Sheet
12. Shares via WhatsApp / Email / Copy Link
13. Recipient opens link → animated envelope (with Google Drive image as background) → card → RSVP

### What's New in Phase 2
- All card details are user-editable (no more hardcoded values)
- Parents' names displayed on card ("Mr. & Mrs. X together with Mr. & Mrs. Y")
- Poruwa time toggle (show/hide)
- Google Drive image for envelope background
- User connects their own Google Sheet URL
- Card data flows through URL end-to-end
- PIN-based card recovery (no database, no login)
- localStorage for quick return on same device
- Setup instructions for Google Sheet provided in-app

---

## 2. Updated Data Shape

```typescript
interface CardData {
  // Couple
  groom: string;
  bride: string;

  // Parents (for "together with" section)
  groomParents: string;    // e.g. "Mr. & Mrs. Herath"
  brideParents: string;    // e.g. "Mr. & Mrs. Rathnayake"

  // Event
  date: string;            // ISO date "2026-12-10"
  time: string;            // "9:00 AM"
  showPoruwa: boolean;     // Toggle: show/hide Poruwa time
  poruwaTime: string;      // "10:10 AM" (only displayed if showPoruwa is true)
  venue: string;
  mapLink: string;         // Google Maps link

  // Customization
  message: string;
  primaryColor: string;
  accentColor: string;
  pattern: string;         // "floral" | "hearts" | "minimal" | "sparkle"
  font: string;            // "classic" | "modern" | "romantic"

  // Image (Google Drive)
  imageUrl: string;        // Google Drive direct URL

  // Google Sheet
  googleScriptUrl: string; // User's own Apps Script web app URL

  // PIN (for card recovery)
  pin: string;             // 4-digit PIN set by user
}
```

---

## 3. URL Encoding Strategy

### Internal URLs (creator-facing)
The full `CardData` object is encoded in the URL for the share page (only the creator sees this):

```typescript
// Encode: all fields compressed (PIN excluded from invite URLs for security)
function encodeCardData(card: CardData, includePin = false): string {
  const data: Record<string, unknown> = {
    g: card.groom,
    b: card.bride,
    gp: card.groomParents,
    bp: card.brideParents,
    d: card.date,
    t: card.time,
    sp: card.showPoruwa,
    pt: card.poruwaTime,
    v: card.venue,
    ml: card.mapLink,
    m: card.message,
    pc: card.primaryColor,
    ac: card.accentColor,
    pa: card.pattern,
    f: card.font,
    img: card.imageUrl,
    gs: card.googleScriptUrl,
  };
  if (includePin) data.pin = card.pin;
  return btoa(encodeURIComponent(JSON.stringify(data)));
}
```

### Public Invite URLs (guest-facing) — SHORT
Invite URLs shared with guests are short. Card data is fetched from the user's Google Sheet at runtime.

```
Short URL:  /invite?s=SCRIPT_URL_HASH&to=Uncle+Raj   (~50 chars)
vs Long:    /invite?data=JTdCJTIyZyUyMi...           (500+ chars)
```

**How it works:**
1. When creator finishes card setup, card data is saved to Google Sheet (Config tab) — already done
2. We generate a short hash of the Google Script URL (first 10 chars of base64)
3. The full script URL is stored in localStorage mapped to the hash
4. Invite URLs use: `/invite?s=FULL_SCRIPT_URL_ENCODED&to=Name`
5. Invite page calls `GET scriptUrl?action=getCard` → fetches card data → renders card

**Why this works:**
- Card data lives in the Google Sheet (single source of truth)
- Invite URL only needs the script URL + guest name
- Script URL is ~90 chars (much shorter than full encoded card data at ~500+ chars)
- No database or URL shortener service needed

**URL flow:**
- `/create` → user fills form → encodes data (with PIN for localStorage/Sheet backup)
- `/create/share?data=ENCODED` → creator's share page (full data in URL, only they see this)
- `/invite?s=SCRIPT_URL&to=InviteeName` → guest's invite page (fetches card data from Sheet)

---

## 4. Card Creator — Multi-Step Form

### Step 1: Wedding Details
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Groom's Name | text | ✅ | |
| Bride's Name | text | ✅ | |
| Groom's Parents | text | ✅ | e.g. "Mr. & Mrs. Perera" |
| Bride's Parents | text | ✅ | e.g. "Mr. & Mrs. Silva" |
| Wedding Date | date picker | ✅ | |
| Wedding Time | time input | ✅ | |
| Poruwa Time Toggle | switch (on/off) | — | Default: ON |
| Poruwa Time | time input | conditional | Only shown when toggle is ON |
| Venue Name | text | ✅ | |
| Google Maps Link | url | ✅ | Paste from Google Maps |

### Step 2: Couple Image (Google Drive)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Google Drive Image URL | url input | Optional | Must be publicly shared |

- User uploads their image to Google Drive → sets sharing to "Anyone with the link" → pastes the link
- We auto-convert the URL to direct image format: `https://drive.google.com/uc?export=view&id=FILE_ID`
- Image is used as the **envelope background** (behind the gold ornamental border)
- Live preview shows the image immediately so user can verify it works
- If no image provided, use default couple SVG from Phase 1

**In-app instructions:**
> 1. Upload your photo to Google Drive
> 2. Right-click → Share → Change to "Anyone with the link"
> 3. Copy the link and paste it below

**URL conversion logic:**
```
Input:  https://drive.google.com/file/d/ABC123/view?usp=sharing
Output: https://drive.google.com/uc?export=view&id=ABC123
```

### Step 3: Google Sheet Connection
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Google Apps Script URL | url | Optional | User's deployed script URL |

**In-app setup instructions displayed:**
1. Create a new Google Sheet with columns: `Invitee Name` | `Participate`
2. Go to Extensions → Apps Script
3. Paste the provided script code (shown in a copyable code block)
4. Deploy as Web App (Execute as: Me, Access: Anyone)
5. Copy the deployment URL and paste it here

**Script code to provide:**
```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  if (data.action === "add") {
    sheet.appendRow([data.name, ""]);
    return ContentService.createTextOutput(JSON.stringify({ success: true }));
  }

  if (data.action === "rsvp") {
    const rows = sheet.getDataRange().getValues();
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === data.name) {
        sheet.getRange(i + 1, 2).setValue(data.participate);
        // Color row green/red
        const color = data.participate === "Yes" ? "#d4edda" : "#f8d7da";
        sheet.getRange(i + 1, 1, 1, 2).setBackground(color);
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true }));
  }
}

function doGet(e) {
  if (e.parameter.action === "fetch") {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const rows = sheet.getDataRange().getValues();
    const names = rows.slice(1).map(r => r[0]).filter(Boolean);
    return ContentService.createTextOutput(JSON.stringify({ names }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

If user skips this step, RSVP tracking is disabled (RSVP buttons still show but responses aren't saved).

### Step 4: Customize (Existing from Phase 1)
| Field | Type | Notes |
|-------|------|-------|
| Personal Message | textarea | Default message provided |
| Primary Color | color picker | Default: #ffffff |
| Accent Color | color picker | Default: #b8860b (gold) |
| Background Pattern | select | floral/hearts/minimal/sparkle |
| Font Style | select | classic/modern/romantic |

### Step 5: Set PIN
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| 4-digit PIN | number input | ✅ | Used for card recovery from new device |
| Confirm PIN | number input | ✅ | Must match |

- PIN is stored in the encoded card data (in localStorage and Google Sheet backup)
- PIN is **NOT** included in invite URLs sent to guests
- Used only for the "Recover My Card" flow

### Live Preview
- Right side panel (desktop) / bottom section (mobile) shows real-time card preview
- Updates as user fills in each step

---

## 5. Updated Card Display

### Envelope (Closed State)
- **Background:** User's uploaded image (blurred/dimmed) OR default gradient
- Gold ornamental Kandyan border (existing)
- "Dear {InviteeName}" in script font
- "{Groom} & {Bride}" below
- Floating petals animation
- "Tap to Open" prompt

### Open Card Content
```
┌─────────────────────────────────┐
│     [Kandyan ornamental top]     │
│                                  │
│      {Groom's Parents}           │  e.g. "Mr. & Mrs. Herath"
│                                  │
│        together with             │
│                                  │
│      {Bride's Parents}           │  e.g. "Mr. & Mrs. Rathnayake"
│                                  │
│   request the pleasure of your   │
│   company at the wedding of      │
│                                  │
│      {Groom} & {Bride}           │
│     (in Great Vibes script)      │
│                                  │
│   ─────────────────────────────  │
│                                  │
│   📅 {Date}                      │
│   🕐 {Time}                      │
│   🪷 Poruwa Ceremony: {Time}     │  ← Only if showPoruwa = true
│   📍 {Venue}                     │
│   [Get Directions →]             │
│                                  │
│   "{Personal Message}"           │
│                                  │
│   [Accept] [Decline]             │
│                                  │
│     [Kandyan ornamental bottom]  │
└─────────────────────────────────┘
```

---

## 6. Updated Share Message Template

```
💍 You're Invited!

{groomName} & {brideName} would love for you to celebrate their special day!

📅 {weddingDate}, {weddingTime} onwards
🪷 Poruwa Ceremony at {poruwaTime}        ← Only if showPoruwa = true
📍 {venue}

Open your personal invitation here:
🔗 {inviteLink}

We can't wait to see you there! 💕
```

---

## 7. Technical Changes

### Files to Modify
| File | Change |
|------|--------|
| `src/lib/card-data.ts` | Add new fields to `CardData`, update encode/decode to include all fields |
| `src/lib/constants.ts` | Remove `HARDCODED_CARD`, keep `DEFAULT_THEME`, `DEFAULT_MESSAGE`, font/pattern lists |
| `src/lib/google-sheet.ts` | Use dynamic `googleScriptUrl` from CardData instead of constant |
| `src/lib/share.ts` | Update share message to conditionally include Poruwa time |
| `src/app/create/page.tsx` | Rewrite as multi-step form with all new fields |
| `src/app/create/share/page.tsx` | Read `?data=` from URL, pass to invite links |
| `src/app/invite/page.tsx` | Read full CardData from URL, display parents, conditional Poruwa, custom image |

### New Files
| File | Purpose |
|------|---------|
| `src/components/create/StepDetails.tsx` | Step 1: Wedding details form |
| `src/components/create/StepImage.tsx` | Step 2: Google Drive image URL + instructions |
| `src/components/create/StepGoogleSheet.tsx` | Step 3: Google Sheet connection + instructions |
| `src/components/create/StepCustomize.tsx` | Step 4: Colors, font, pattern, message |
| `src/components/create/StepPin.tsx` | Step 5: Set 4-digit PIN |
| `src/components/create/CardPreview.tsx` | Live preview component (reusable) |
| `src/app/recover/page.tsx` | Card recovery page (Sheet URL + PIN) |
| `src/lib/google-drive.ts` | Google Drive URL conversion helper |

### localStorage for Quick Return
When card is created, save to localStorage:
```
wedvite_my_card = "/create/share?data=ENCODED"
wedvite_sheet_url = "https://script.google.com/..."
```
On next visit, if `wedvite_my_card` exists → show "Return to My Share Page" button on landing page.

---

## 8. Image Handling — Google Drive

**Approach:** User's Google Drive is the image host. Zero cost, no third-party APIs.

**Flow:**
1. User uploads photo to their Google Drive
2. Sets sharing to "Anyone with the link can view"
3. Pastes the share link into the form
4. App auto-converts to direct image URL

**URL conversion:**
```
User pastes:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
App converts: https://drive.google.com/uc?export=view&id=FILE_ID
```

**Why Google Drive:**
- Free, unlimited for photos
- User already has a Google account
- URL is short (safe for encoding in card URL)
- Works for all invitees opening the link (no auth needed if shared publicly)
- No API keys or third-party services required

**Fallback:** If no image URL provided or image fails to load → show default couple SVG from Phase 1.

---

## 9. PIN-Based Card Recovery (No Database, No Login)

### How It Works

The user's Google Sheet stores both RSVP data AND card configuration. The PIN prevents unauthorized access.

**Google Sheet structure:**
| Tab | Content |
|-----|---------|
| Sheet1 (RSVPs) | `Invitee Name` \| `Participate` |
| Config (hidden) | Cell A1: encoded card data (includes PIN) |

### Flows

**Same device (localStorage):**
```
User visits app
  → localStorage has "wedvite_my_card" key?
  → YES → Show "Return to My Share Page" button → direct access
  → NO  → Show "Create New" or "Recover My Card"
```

**New device (recovery via Google Sheet + PIN):**
```
User visits /recover
  → Enters: Google Sheet Script URL + 4-digit PIN
  → App calls Sheet: GET ?action=getCard
  → Sheet returns encoded card data
  → App decodes → checks PIN matches
  → ✅ Match → Redirect to share page, save to localStorage
  → ❌ No match → "Wrong PIN, try again"
```

### Security Model
- PIN is per-card, not global (two users can have same PIN — no conflict)
- Identity = Google Sheet URL + PIN combination (both required)
- PIN is never included in invite URLs sent to guests
- Low-stakes data (wedding details, guest names) — PIN is sufficient protection

### Updated Apps Script (with card backup)

```javascript
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  if (data.action === "add") {
    sheet.appendRow([data.name, ""]);
    return ContentService.createTextOutput(JSON.stringify({ success: true }));
  }

  if (data.action === "rsvp") {
    const rows = sheet.getDataRange().getValues();
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === data.name) {
        sheet.getRange(i + 1, 2).setValue(data.participate);
        const color = data.participate === "Yes" ? "#d4edda" : "#f8d7da";
        sheet.getRange(i + 1, 1, 1, 2).setBackground(color);
        break;
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true }));
  }

  if (data.action === "saveCard") {
    let configSheet = ss.getSheetByName("Config");
    if (!configSheet) configSheet = ss.insertSheet("Config");
    configSheet.getRange("A1").setValue(data.cardData);
    return ContentService.createTextOutput(JSON.stringify({ success: true }));
  }
}

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (e.parameter.action === "fetch") {
    const sheet = ss.getActiveSheet();
    const rows = sheet.getDataRange().getValues();
    const names = rows.slice(1).map(r => r[0]).filter(Boolean);
    return ContentService.createTextOutput(JSON.stringify({ names }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (e.parameter.action === "getCard") {
    const configSheet = ss.getSheetByName("Config");
    if (!configSheet) {
      return ContentService.createTextOutput(JSON.stringify({ cardData: null }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const cardData = configSheet.getRange("A1").getValue();
    return ContentService.createTextOutput(JSON.stringify({ cardData }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### localStorage Keys
```
wedvite_my_card = "/create/share?data=ENCODED"   // Full share page URL
wedvite_sheet_url = "https://script.google.com/..." // For quick recovery reference
```

---

## 10. Progress Tracker

### Phase 2 Tasks

#### Data Layer Updates
- [ ] T01 — Update `CardData` interface: add `groomParents`, `brideParents`, `showPoruwa`, `imageUrl`, `googleScriptUrl`, `pin`
- [ ] T02 — Update `encodeCardData()` / `decodeCardData()` to handle all new fields (with `includePin` flag)
- [ ] T03 — Remove `HARDCODED_CARD` from constants, update `getDefaultCard()` with empty defaults
- [ ] T04 — Update `google-sheet.ts` to accept dynamic script URL + add `saveCard()` and `getCard()` functions
- [ ] T05 — Update `share.ts` to conditionally include Poruwa time in share message
- [ ] T06 — Add Google Drive URL conversion helper (extract FILE_ID, build direct URL)

#### Card Creator — Multi-Step Form
- [ ] T07 — Create `StepDetails.tsx` component (couple names, parents, date, time, Poruwa toggle, venue, map link)
- [ ] T08 — Create `StepImage.tsx` component (Google Drive URL input + instructions + live preview)
- [ ] T09 — Create `StepGoogleSheet.tsx` component (URL input + setup instructions with copyable script)
- [ ] T10 — Create `StepCustomize.tsx` component (message, colors, font, pattern — extracted from current create page)
- [ ] T11 — Create `StepPin.tsx` component (set 4-digit PIN + confirm)
- [ ] T12 — Create `CardPreview.tsx` component (reusable live preview)
- [ ] T13 — Rewrite `/create/page.tsx` as multi-step form with step navigation (1→2→3→4→5→Preview)

#### URL Flow Fix (Critical)
- [ ] T14 — `/create` → on "Share" click, encode full CardData, save to localStorage, backup to Google Sheet, navigate to `/create/share?data=ENCODED`
- [ ] T15 — `/create/share` → read `?data=` from URL, decode, generate SHORT invite links (`/invite?s=SCRIPT_URL&to=Name`)
- [ ] T16 — `/invite` → read `?s=` (script URL) and `?to=` (guest name) from URL, fetch card data from Google Sheet via `getCard`, render card
- [ ] T16b — Fallback: if `?data=` param exists in invite URL (legacy/no-sheet), decode directly as before

#### Card Recovery & Return
- [ ] T17 — Save share page URL to `localStorage` on card creation
- [ ] T18 — Landing page: show "Return to My Share Page" button if localStorage has saved card
- [ ] T19 — Create `/recover` page (enter Google Sheet URL + PIN → fetch card data → verify PIN → redirect to share page)
- [ ] T20 — Add `saveCard` action to Google Sheet (backup encoded card data to Config tab)

#### Card Display Updates
- [ ] T21 — Update envelope (closed state) to use Google Drive image as background
- [ ] T22 — Update open card to display parents' names ("Mr. & Mrs. X together with Mr. & Mrs. Y")
- [ ] T23 — Update open card to conditionally show/hide Poruwa time based on `showPoruwa`
- [ ] T24 — Update share message generation to respect `showPoruwa` toggle

#### Polish
- [ ] T25 — Form validation (required fields, URL format for map/drive links, PIN match, date not in past)
- [ ] T26 — Mobile responsive multi-step form
- [ ] T27 — Loading states and error handling for Google Sheet operations
- [ ] T28 — Image load error fallback (show default SVG if Google Drive image fails)

---

## 11. Google Sheet Setup Instructions (In-App Copy)

The following instructions will be displayed in Step 3 of the card creator:

> ### Connect Your Google Sheet for RSVP Tracking
>
> **This lets you track who accepts/declines your invitation in a Google Sheet.**
>
> #### Quick Setup (5 minutes):
>
> 1. **Create a Google Sheet**
>    - Go to [sheets.google.com](https://sheets.google.com) → Create blank sheet
>    - Name it "Wedding RSVPs"
>    - In Row 1, add headers: `Invitee Name` | `Participate`
>
> 2. **Add the Script**
>    - In your sheet, go to **Extensions → Apps Script**
>    - Delete any existing code and paste the script below
>    - Click **Save** (💾)
>
> 3. **Deploy**
>    - Click **Deploy → New deployment**
>    - Type: **Web app**
>    - Execute as: **Me**
>    - Who has access: **Anyone**
>    - Click **Deploy** → **Authorize** (allow permissions)
>    - Copy the **Web app URL**
>
> 4. **Paste the URL below**
>
> #### If you skip this step:
> Your invitation card will still work perfectly — guests just won't be tracked in a sheet.

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| URL length with all card data | Invite URLs use short format (`?s=SCRIPT_URL&to=Name`) — card data fetched from Sheet at runtime. Only share page (creator-only) has full encoded data. |
| User doesn't understand Google Sheet setup | Step-by-step instructions with copyable code in-app |
| Image not loading on invite page | Fallback to default SVG if Google Drive image fails to load |
| Google Drive image permissions | Show warning + live preview so user can verify before proceeding |
| Form is too long / overwhelming | Multi-step wizard with progress indicator, only 3-4 fields per step |
| Poruwa time confusion | Clear toggle with label "Show Poruwa Ceremony Time on Card" |
| User loses URL and forgets Sheet URL | localStorage saves it; recovery page as backup |
| PIN is only 4 digits | Acceptable for wedding card data (low-stakes); rate limiting not needed for client-side check |

---

## 13. URL Structure (Updated)

```
/                              → Landing page (+ "Return to My Share Page" if localStorage exists)
/create                        → Card creator (5-step form)
/create/share?data=...         → Share page (creator only — full data in URL)
/invite?s=SCRIPT_URL&to=Name   → Public invitation card (SHORT — fetches data from Sheet)
/invite?data=...&to=Name       → Fallback invite (if no Google Sheet connected)
/recover                       → Card recovery (enter Sheet URL + PIN)
```

**Example invite URL:**
```
https://wedvite.vercel.app/invite?s=https%3A%2F%2Fscript.google.com%2Fmacros%2Fs%2FAKfycbx...%2Fexec&to=Uncle+Raj
```
This is significantly shorter than encoding all card data (~90 chars for script URL vs ~500+ chars for full data).

---

## 14. Success Criteria

- [ ] User can create a fully customized card without editing any code
- [ ] Parents' names appear on the card ("Mr. & Mrs. X together with Mr. & Mrs. Y")
- [ ] Poruwa time toggle works (shows/hides on card AND in share message)
- [ ] Google Drive image appears as envelope background
- [ ] User's own Google Sheet receives RSVP data
- [ ] Card data flows correctly: `/create` → `/create/share` → `/invite`
- [ ] Works on mobile (responsive multi-step form)
- [ ] Graceful fallbacks (no image → default SVG, no sheet URL → RSVP disabled)
- [ ] Returning user on same device goes directly to share page (localStorage)
- [ ] User can recover card from new device using Sheet URL + PIN
- [ ] Card data is backed up to Google Sheet (Config tab)
- [ ] Multiple users can use the system independently (no conflicts)
