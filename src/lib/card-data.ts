import { HARDCODED_CARD, DEFAULT_THEME, DEFAULT_MESSAGE } from "./constants";

export interface CardData {
  groom: string;
  bride: string;
  date: string;
  time: string;
  poruwaTime: string;
  venue: string;
  mapLink?: string;
  message: string;
  primaryColor: string;
  accentColor: string;
  pattern: string;
  font: string;
}

export function getDefaultCard(): CardData {
  return {
    ...HARDCODED_CARD,
    message: DEFAULT_MESSAGE,
    primaryColor: DEFAULT_THEME.primary,
    accentColor: DEFAULT_THEME.accent,
    pattern: "floral",
    font: "romantic",
  };
}

export function encodeCardData(card: CardData): string {
  return btoa(encodeURIComponent(JSON.stringify({
    m: card.message,
    p: card.primaryColor,
    a: card.accentColor,
    t: card.pattern,
    f: card.font,
  })));
}

export function decodeCardData(encoded: string): CardData | null {
  if (!encoded) return getDefaultCard();
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(encoded)));
    if (parsed.groom) return parsed as CardData;
    return {
      ...HARDCODED_CARD,
      message: parsed.m ?? DEFAULT_MESSAGE,
      primaryColor: parsed.p ?? DEFAULT_THEME.primary,
      accentColor: parsed.a ?? DEFAULT_THEME.accent,
      pattern: parsed.t ?? "floral",
      font: parsed.f ?? "romantic",
    };
  } catch {
    return getDefaultCard();
  }
}
