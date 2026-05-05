import { DEFAULT_THEME, DEFAULT_MESSAGE } from "./constants";

export interface CardData {
  groom: string;
  bride: string;
  groomParents: string;
  brideParents: string;
  date: string;
  time: string;
  showPoruwa: boolean;
  poruwaTime: string;
  venue: string;
  mapLink: string;
  message: string;
  primaryColor: string;
  accentColor: string;
  pattern: string;
  font: string;
  imageUrl: string;
  googleScriptUrl: string;
  pin: string;
}

export function getDefaultCard(): CardData {
  return {
    groom: "",
    bride: "",
    groomParents: "",
    brideParents: "",
    date: "",
    time: "",
    showPoruwa: true,
    poruwaTime: "",
    venue: "",
    mapLink: "",
    message: DEFAULT_MESSAGE,
    primaryColor: DEFAULT_THEME.primary,
    accentColor: DEFAULT_THEME.accent,
    pattern: "floral",
    font: "romantic",
    imageUrl: "",
    googleScriptUrl: "",
    pin: "",
  };
}

export function encodeCardData(card: CardData, includePin = false): string {
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

export function decodeCardData(encoded: string): CardData | null {
  if (!encoded) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(encoded)));
    return {
      groom: parsed.g ?? "",
      bride: parsed.b ?? "",
      groomParents: parsed.gp ?? "",
      brideParents: parsed.bp ?? "",
      date: parsed.d ?? "",
      time: parsed.t ?? "",
      showPoruwa: parsed.sp ?? true,
      poruwaTime: parsed.pt ?? "",
      venue: parsed.v ?? "",
      mapLink: parsed.ml ?? "",
      message: parsed.m ?? DEFAULT_MESSAGE,
      primaryColor: parsed.pc ?? DEFAULT_THEME.primary,
      accentColor: parsed.ac ?? DEFAULT_THEME.accent,
      pattern: parsed.pa ?? "floral",
      font: parsed.f ?? "romantic",
      imageUrl: parsed.img ?? "",
      googleScriptUrl: parsed.gs ?? "",
      pin: parsed.pin ?? "",
    };
  } catch {
    return null;
  }
}
