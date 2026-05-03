# Wedvite — Phase 1 Plan (v4 — Updated 2026-05-03)
## Interactive Wedding Invitation Card — Sri Lankan Kandyan Style

**Goal:** Build a pure frontend web app where users create a beautiful, romantic Sri Lankan Kandyan-style interactive wedding invitation card, personalize it with an invitee name, and share it via WhatsApp, Email, or copy link. RSVP responses are tracked in a Google Sheet via Google Apps Script.

**Key Idea:** All card data is encoded in the URL. Each invitee gets a personalized link. When an invitee is added on the Share page, they are also registered in a Google Sheet. When the invitee RSVPs, the sheet is updated with their response.

---

## 1. Product Overview

### User Flow
1. User visits app → **Landing Page** (`/`)
2. Clicks "Create Your Invitation" → **Card Creator** form (`/create`)
3. Customizes: message, colors, font, pattern (couple details + Poruwa time hardcoded)
4. Clicks "Share with Guests" → **Share Page** (`/create/share`)
5. Enters invitee names one by one → generates personalized share link per invitee → invitee is added to Google Sheet (Participate column empty)
6. Shares via WhatsApp / Email / Copy Link
7. Recipient opens link → sees **animated envelope** with their name → taps to open
8. **Kandyan-style wedding card** with couple SVG, Poruwa ceremony time, full details
9. RSVP form → invitee responds Yes/No → Google Sheet updated (row turns green/red)

### What It Does NOT Do (Phase 1)
- No database / backend / API (Google Apps Script is the only external call)
- No authentication / accounts
- No image uploads (couple illustration is a static SVG asset)
- No invitee list management in the app (managed via Google Sheet)

---

## 2. Tech Stack

| Layer | Choice | Version | Cost |
|-------|--------|---------|------|
| Framework | Next.js (App Router) | 15.3.1 | $0 |
| Language | TypeScript | 5.x | $0 |
| UI Library | React | 19.0.0 | $0 |
| Styling | Tailwind CSS | 4.x | $0 |
| Animation | Framer Motion | 12.38.x | $0 |
| Image Export | html-to-image | 1.11.x | $0 |
| Compiler | React Compiler (experimental) | 1.0.0 | $0 |
| RSVP Tracking | Google Sheets + Apps Script | — | $0 |
| Deployment | Vercel | — | $0 |
| Fonts | next/font (Great Vibes, Playfair Display, Cormorant Garamond) | — | $0 |

**Total monthly cost: $0**

---

## 3. URL Structure

```
/                          → Landing page
/create                    → Card creator form + live preview
/create/share              → Share page (add invitees, generate links)
/invite?to=InviteeName     → Public invitation card (recipient view)
```

> **Note:** The current implementation uses `?to=` for the invitee name on the invite page. Card customization data is encoded via `?data=` param but the share page currently uses `getDefaultCard()` (hardcoded defaults) rather than passing `data` through the URL.

---

## 4. Data Shape

```typescript
interface CardData {
  groom: string;
  bride: string;
  date: string;          // ISO date string (e.g. "2026-12-10")
  time: string;          // Wedding time (e.g. "9:00 AM")
  poruwaTime: string;    // Poruwa ceremony auspicious time (e.g. "10:10 AM")
  venue: string;
  mapLink?: string;      // Google Maps link
  message: string;
  primaryColor: string;
  accentColor: string;
  pattern: string;       // "floral" | "hearts" | "minimal" | "sparkle"
  font: string;          // "classic" | "modern" | "romantic"
}
```

Encoding: `btoa(encodeURIComponent(JSON.stringify(subset)))` → URL param `?data=...`

Hardcoded couple details in `constants.ts`:
```typescript
HARDCODED_CARD = {
  groom: "Gayanath", bride: "Gayasha",
  date: "2026-12-10", time: "9:00 AM", poruwaTime: "10:10 AM",
  venue: "Amaya Grand, 11/9 Malvilawatte, Giriulla",
  mapLink: "https://maps.app.goo.gl/ierSPVgk8Lu7j7436",
}
```

---

## 5. Sri Lankan Kandyan Theme (Current State)

### Design — Implemented ✅
- Gold (`#b8860b`) & dark brown (`#1a0a00`) color palette
- Ornamental Kandyan-style borders using CSS (lotus, scroll patterns via Unicode/emoji)
- Kandyan couple SVG illustration at `public/images/couple-photo.svg` (824KB)
- Floating lotus petals (`🪷`, `🌸`, `✨`, `💛`) animation on card open
- Golden confetti burst on envelope open
- Fonts: Great Vibes (script headings), Playfair Display (body), Cormorant Garamond (base)

### Card Visual Flow — Implemented ✅
1. **Envelope (closed):** Dark background, gold ornamental border, invitee name ("Dear {Name}"), couple names, floating petals, "Tap to Open" prompt
2. **Open animation:** Envelope flips open → card slides up → golden confetti + lotus petals rain
3. **Open card:** Full Kandyan wedding card with couple names in script, Poruwa ceremony time, wedding date & time, venue + Get Directions link, personal message, RSVP button
4. **RSVP:** Accept/Decline buttons → submits to Google Sheet → thank-you confirmation

---

## 6. Google Sheets RSVP Tracking (Current State)

### Architecture — Implemented ✅
- Google Sheet with columns: `Invitee Name` | `Participate`
- Google Apps Script deployed as Web App (public)
- Script URL stored in `lib/constants.ts` as `GOOGLE_SCRIPT_URL`

### Actions
| Action | Trigger | Payload |
|--------|---------|---------|
| `add` | Creator adds invitee on Share page | `{ action: "add", name: "..." }` |
| `rsvp` | Invitee responds on Invite page | `{ action: "rsvp", name: "...", participate: "Yes"/"No" }` |
| `fetch` | Share page loads invitee list | GET `?action=fetch` → returns `{ names: [...] }` |

### App-Side Helpers (`lib/google-sheet.ts`) — Implemented ✅
- `addInvitee(name)` — POST add action
- `fetchInvitees()` — GET fetch action, returns `string[]`
- `updateRsvp(name, "Yes" | "No")` — POST rsvp action
- All calls are fire-and-forget with silent failure (card works without sheet)

---

## 7. Share Message Template — Implemented ✅

```
💍 You're Invited!

{groomName} & {brideName} would love for you to celebrate their special day!

📅 {weddingDate}, {weddingTime} onwards
🪷 Poruwa Ceremony at {poruwaTime}
📍 {venue}

Open your personal invitation here:
🔗 {inviteLink}

We can't wait to see you there! 💕
```

---

## 8. File Structure (Current)

```
wedvite-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (3 Google fonts, metadata, favicon)
│   │   ├── page.tsx                # Landing page (hero, features, how-it-works, CTA)
│   │   ├── globals.css             # Tailwind CSS 4 import + theme vars
│   │   ├── favicon.ico
│   │   ├── create/
│   │   │   ├── page.tsx            # Card creator (message, font, pattern, colors) + live preview + download PNG
│   │   │   └── share/
│   │   │       └── page.tsx        # Add invitees, fetch from Google Sheet, WhatsApp/Email/Copy per guest
│   │   └── invite/
│   │       └── page.tsx            # Envelope animation → Kandyan card → RSVP (550+ lines)
│   └── lib/
│       ├── card-data.ts            # CardData interface, getDefaultCard(), encode/decode
│       ├── share.ts                # buildInviteUrl(), buildShareMessage(), whatsappUrl(), emailUrl()
│       ├── constants.ts            # HARDCODED_CARD, DEFAULT_THEME, fonts, patterns, share template, GOOGLE_SCRIPT_URL
│       └── google-sheet.ts         # addInvitee(), fetchInvitees(), updateRsvp()
├── public/
│   └── images/
│       └── couple-photo.svg        # Kandyan couple illustration (824KB)
├── docs/
│   └── plans/
│       └── phase-1-plan.md         # This file
├── package.json
├── next.config.ts                  # experimental: { reactCompiler: true }
├── tsconfig.json
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## 9. Progress Tracker

### Cleanup — ✅ Done
- [x] T01 — Remove auth files, DB files, Prisma, protected routes, auth dependencies
- [x] T02 — Clean package.json (only Next.js, React, Framer Motion, html-to-image, Tailwind)

### Core Pages — ✅ Done
- [x] T03 — Build `lib/card-data.ts` (CardData interface, encode/decode, getDefaultCard)
- [x] T04 — Build `lib/share.ts` (share message builder, WhatsApp/Email URL helpers)
- [x] T05 — Build Card Creator page (`/create`) with message/font/pattern/color form + live preview + PNG download
- [x] T06 — Build Share page (`/create/share`) with invitee name input + link generation
- [x] T07 — Build Invitation Card page (`/invite`) with envelope animation + card content
- [x] T08 — Build RSVP form (Accept/Decline → Google Sheet update → thank-you)
- [x] T09 — Build Landing page (hero, features grid, how-it-works, CTA, footer)

### Sri Lankan Kandyan Theme — ✅ Done
- [x] T12 — Add `poruwaTime` field to CardData interface and HARDCODED_CARD constants
- [x] T13 — Add Kandyan couple SVG to `public/images/couple-photo.svg`
- [x] T14 — Design envelope (closed state) with Kandyan gold/dark style, ornamental borders, floating petals
- [x] T15 — Design open card with couple names, Poruwa ceremony time, confetti, lotus petals, RSVP
- [x] T16 — Update card preview in `/create` page with Kandyan ornamental styling
- [x] T17 — Update share message template to include Poruwa ceremony time

### Google Sheets RSVP Tracking — ✅ Done
- [x] T18 — Create Google Sheet + Apps Script web app (manual setup)
- [x] T19 — Build `lib/google-sheet.ts` (addInvitee, fetchInvitees, updateRsvp)
- [x] T20 — Integrate addInvitee() on Share page when adding invitee
- [x] T21 — Integrate fetchInvitees() on Share page load (sync invitee list from sheet)
- [x] T22 — Integrate updateRsvp() on Invite page when RSVP is submitted
- [x] T23 — Add GOOGLE_SCRIPT_URL to constants (deployed Apps Script URL)

### Polish & Deploy — 🔲 Remaining
- [ ] T10 — Mobile responsive testing & fixes across all pages
- [ ] T11 — Deploy to Vercel (env vars, domain setup)

---

## 10. Known Issues & Gaps

| Issue | Description | Priority |
|-------|-------------|----------|
| Card data not passed through URL | Share page uses `getDefaultCard()` instead of reading `?data=` from URL. Customizations from `/create` don't carry to `/create/share` or `/invite`. | High |
| Landing page image path mismatch | `page.tsx` references `/image/couple-photo.svg` (missing `s`) but file is at `/images/couple-photo.svg` | Medium |
| No `logo.svg` in public | Footer references `/logo.svg` which doesn't exist | Low |
| README outdated | README references Next.js 16, Prisma, NextAuth, PostgreSQL — none of which are in the current build | Medium |
| Large SVG asset | `couple-photo.svg` is 824KB — should be optimized or converted to compressed format | Low |
| No error boundaries | No error handling UI for failed page loads | Low |
| React Compiler experimental | Using `babel-plugin-react-compiler` 1.0.0 — may have edge cases | Low |

---

## 11. Risks

| Risk | Mitigation |
|------|-----------|
| URL too long with all card data | Base64 JSON is ~300-500 chars. Well within URL limits (~2000 chars). |
| Google Apps Script latency | ~1-2s per call. Non-blocking — card works even if call fails (silent catch). |
| Apps Script URL is public | Anyone could POST, but data is just names + yes/no. Low risk for a wedding app. |
| SVG asset size (824KB) | Optimize SVG or convert to WebP. Consider lazy loading. |
| Card data visible in URL | Not sensitive data. Acceptable for wedding invitations. |
| No offline support | Requires internet for Google Sheet calls. Card rendering works offline. |

---

## 12. Future Phases

| Phase | Scope |
|-------|-------|
| **Phase 2** | Fix card data URL flow (create → share → invite), mobile polish, Vercel deploy, README update |
| **Phase 3** | Database (Neon PostgreSQL), persistent cards, server-side RSVP tracking |
| **Phase 4** | User accounts + auth (NextAuth), dashboard, multi-card management |
| **Phase 5** | Google Drive image picker, custom couple photos |
| **Phase 6** | Multiple templates (modern, minimal, floral), RSVP analytics, bulk invitee import |
| **Phase 7** | Premium features, custom domains, PDF export |

---

## 13. Immediate Next Steps (Recommended)

1. **T10 — Fix card data URL flow** — Pass customization data from `/create` → `/create/share` → `/invite` via `?data=` query param so customizations actually work end-to-end
2. **Fix image path** — Correct `/image/couple-photo.svg` → `/images/couple-photo.svg` in landing page
3. **Add/fix logo** — Create `public/logo.svg` or remove footer reference
4. **T10 — Mobile responsive testing** — Test all 4 pages on mobile viewports
5. **Update README** — Align with actual tech stack (Next.js 15.3.1, no Prisma/NextAuth/PostgreSQL)
6. **T11 — Deploy to Vercel**
