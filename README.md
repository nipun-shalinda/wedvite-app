# Wedvite — Wedding Invitation Card Platform

Create beautiful, interactive wedding invitation cards with animated open/close effects. Customize, share via WhatsApp/Email, and collect RSVPs — all for free.

## Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **PostgreSQL** database — we recommend [Neon](https://neon.tech/) (free tier, 512MB)

## Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd wedvite-app
npm install
```

### 2. Create a Neon Database (Free)

1. Go to [neon.tech](https://neon.tech/) and sign up (free)
2. Create a new project → name it `wedvite`
3. Copy the connection string — it looks like:
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### 3. Set Up Google OAuth (Free)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth Client ID**
5. Application type: **Web application**
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**

### 4. (Optional) Google Drive Picker for Image Uploads

If you want the "Choose from Google Drive" button:

1. In the same Google Cloud project, go to **APIs & Services → Library**
2. Enable **Google Drive API** and **Google Picker API**
3. Note your **Project Number** (Settings → Project number) — this is the App ID

If you skip this, users can still paste Google Drive image links manually.

### 5. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Database (from step 2)
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# Google OAuth (from step 3)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Google Drive Picker (optional, from step 4)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
NEXT_PUBLIC_GOOGLE_APP_ID="your-project-number"
```

Generate the `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 6. Set Up the Database

```bash
npx prisma db push
```

This creates all the tables (User, Card, Invitee, Rsvp) in your Neon database.

### 7. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the Wedvite landing page.

## Usage

1. **Sign up** at `/signup` (email/password or Google)
2. **Create a card** at `/create` — fill in names, date, venue (paste Google Maps link), choose theme
3. **Add invitees** — add guest names and contact info
4. **Share** — click Share on any invitee → edit the default message → send via WhatsApp, Email, or copy link
5. **Guests open the link** → see animated envelope → tap to open → RSVP
6. **Track RSVPs** on your dashboard

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── layout.tsx                        # Root layout (fonts, metadata)
│   ├── (auth)/
│   │   ├── login/page.tsx                # Login
│   │   └── signup/page.tsx               # Sign up
│   ├── (protected)/
│   │   ├── layout.tsx                    # Auth guard
│   │   ├── dashboard/page.tsx            # User's cards + RSVP overview
│   │   ├── create/page.tsx               # Card creator (3-step form)
│   │   └── card/[cardId]/
│   │       └── invitees/page.tsx         # Manage invitees + share
│   ├── invite/[cardId]/
│   │   ├── page.tsx                      # Public invitation (server)
│   │   └── InviteCard.tsx                # Interactive card (client)
│   └── api/auth/[...nextauth]/route.ts   # Auth API
├── components/
│   ├── create/DriveImagePicker.tsx        # Google Drive file picker
│   └── rsvp/RsvpForm.tsx                 # RSVP form
├── lib/
│   ├── auth.ts                           # NextAuth config
│   ├── db.ts                             # Prisma client
│   ├── constants.ts                      # Theme presets, share message template
│   ├── share.ts                          # WhatsApp/Email URL builders
│   └── actions/
│       ├── auth.ts                       # Signup/login actions
│       ├── card.ts                       # Card CRUD
│       ├── invitee.ts                    # Invitee management
│       └── rsvp.ts                       # RSVP submission
└── prisma/
    └── schema.prisma                     # Database schema
```

## Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Framework | Next.js 16 (App Router) | Free |
| Database | Neon PostgreSQL | Free (512MB) |
| Auth | NextAuth.js v5 | Free |
| Animation | Framer Motion | Free |
| Styling | Tailwind CSS 4 | Free |
| Images | Customer's Google Drive | Free |
| Hosting | Vercel | Free |

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com/) → Import your repo
3. Add all environment variables from `.env.local` to Vercel's Environment Variables settings
4. Change `NEXTAUTH_URL` to your Vercel domain (e.g., `https://wedvite.vercel.app`)
5. Add `https://wedvite.vercel.app/api/auth/callback/google` to your Google OAuth redirect URIs
6. Deploy

## Common Issues

**"Cannot connect to database"**
→ Check your `DATABASE_URL` in `.env.local`. Make sure it ends with `?sslmode=require` for Neon.

**Google login not working**
→ Make sure the redirect URI in Google Console matches exactly: `http://localhost:3000/api/auth/callback/google`

**Images not showing on card**
→ The Google Drive image must be shared as "Anyone with the link can view". The URL format should be: `https://drive.google.com/uc?export=view&id=FILE_ID`

**"NEXTAUTH_SECRET is missing"**
→ Run `openssl rand -base64 32` and add the result to `.env.local`

## License

MIT
