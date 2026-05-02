export const HARDCODED_CARD = {
  groom: "Gayanath",
  bride: "Gayasha",
  date: "2026-12-10",
  time: "9:00 AM",
  poruwaTime: "10:10 AM",
  venue: "Amaya Grand, 11/9 Malvilawatte, Giriulla,",
  mapLink: "https://maps.app.goo.gl/ierSPVgk8Lu7j7436",
} as const;

export const DEFAULT_THEME = {
  primary: "#ffffff",
  accent: "#b8860b",
} as const;

export const DEFAULT_MESSAGE = "With hearts full of joy, we invite you to witness and celebrate the beginning of our forever.";

export const FONT_STYLES = ["classic", "modern", "romantic"] as const;

export const BACKGROUND_PATTERNS = [
  "floral",
  "hearts",
  "minimal",
  "sparkle",
] as const;

export const DEFAULT_SHARE_MESSAGE = `💍 You're Invited!

{groomName} & {brideName} would love for you to celebrate their special day!

📅 {weddingDate}, {weddingTime} onwards
🪷 Poruwa Ceremony at {poruwaTime}
📍 {venue}

Open your personal invitation here:
🔗 {inviteLink}

We can't wait to see you there! 💕`;

export const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby_C4eHplnvCjnzylJEJv0-PHGgInuXVfUm8kHnNW4ZNuUr9WrXYmO1EKm-g2j_Yypr/exec"; // Set this after creating the Apps Script web app
