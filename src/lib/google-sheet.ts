import { GOOGLE_SCRIPT_URL } from "./constants";

export async function addInvitee(name: string): Promise<void> {
  if (!GOOGLE_SCRIPT_URL) return;
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "add", name }),
    });
  } catch {
    // Silent fail — card works without sheet
  }
}

export async function updateRsvp(name: string, participate: "Yes" | "No"): Promise<void> {
  if (!GOOGLE_SCRIPT_URL) return;
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ action: "rsvp", name, participate }),
    });
  } catch {
    // Silent fail
  }
}
