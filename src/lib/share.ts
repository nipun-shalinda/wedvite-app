import { DEFAULT_SHARE_MESSAGE } from "./constants";
import type { CardData } from "./card-data";

export function buildInviteUrl(card: CardData, inviteeName: string, baseUrl: string): string {
  return `${baseUrl}/invite?to=${encodeURIComponent(inviteeName)}`;
}

export function buildShareMessage(card: CardData, inviteeName: string, baseUrl: string): string {
  const inviteLink = buildInviteUrl(card, inviteeName, baseUrl);
  const dateStr = new Date(card.date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return DEFAULT_SHARE_MESSAGE
    .replace("{groomName}", card.groom)
    .replace("{brideName}", card.bride)
    .replace("{weddingDate}", dateStr)
    .replace("{weddingTime}", card.time)
    .replace("{poruwaTime}", card.poruwaTime)
    .replace("{venue}", card.venue)
    .replace("{inviteLink}", inviteLink);
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function emailUrl(message: string, groom: string, bride: string): string {
  const subject = encodeURIComponent(`You're Invited! ${groom} & ${bride}'s Wedding`);
  return `mailto:?subject=${subject}&body=${encodeURIComponent(message)}`;
}
