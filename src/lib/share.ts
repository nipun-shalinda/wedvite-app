import type { CardData } from "./card-data";
import { encodeCardData } from "./card-data";

export function buildInviteUrl(card: CardData, inviteeName: string, baseUrl: string): string {
  if (card.googleScriptUrl) {
    return `${baseUrl}/invite?s=${encodeURIComponent(card.googleScriptUrl)}&to=${encodeURIComponent(inviteeName)}`;
  }
  const encoded = encodeCardData(card);
  return `${baseUrl}/invite?data=${encoded}&to=${encodeURIComponent(inviteeName)}`;
}

export function buildShareMessage(card: CardData, inviteeName: string, baseUrl: string): string {
  const inviteLink = buildInviteUrl(card, inviteeName, baseUrl);
  const dateStr = new Date(card.date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  let msg = `💍 You're Invited!\n\n${card.groom} & ${card.bride} would love for you to celebrate their special day!\n\n📅 ${dateStr}, ${card.time} onwards`;
  if (card.showPoruwa && card.poruwaTime) {
    msg += `\n🪷 Poruwa Ceremony at ${card.poruwaTime}`;
  }
  msg += `\n📍 ${card.venue}\n\nOpen your personal invitation here:\n🔗 ${inviteLink}\n\nWe can't wait to see you there! 💕`;
  return msg;
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function emailUrl(message: string, groom: string, bride: string): string {
  const subject = encodeURIComponent(`You're Invited! ${groom} & ${bride}'s Wedding`);
  return `mailto:?subject=${subject}&body=${encodeURIComponent(message)}`;
}
