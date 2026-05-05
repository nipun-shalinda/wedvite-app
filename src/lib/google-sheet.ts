export async function addInvitee(scriptUrl: string, name: string): Promise<void> {
  if (!scriptUrl) return;
  try {
    await fetch(scriptUrl, {
      method: "POST",
      body: JSON.stringify({ action: "add", name }),
    });
  } catch { /* silent */ }
}

export async function fetchInvitees(scriptUrl: string): Promise<string[]> {
  if (!scriptUrl) return [];
  try {
    const res = await fetch(`${scriptUrl}?action=fetch`);
    const data = await res.json();
    return data.names ?? [];
  } catch {
    return [];
  }
}

export async function updateRsvp(scriptUrl: string, name: string, participate: "Yes" | "No"): Promise<void> {
  if (!scriptUrl) return;
  try {
    await fetch(scriptUrl, {
      method: "POST",
      body: JSON.stringify({ action: "rsvp", name, participate }),
    });
  } catch { /* silent */ }
}

export async function saveCardToSheet(scriptUrl: string, cardData: string): Promise<void> {
  if (!scriptUrl) return;
  try {
    await fetch(scriptUrl, {
      method: "POST",
      body: JSON.stringify({ action: "saveCard", cardData }),
    });
  } catch { /* silent */ }
}

export async function getCardFromSheet(scriptUrl: string): Promise<string | null> {
  if (!scriptUrl) return null;
  try {
    const res = await fetch(`${scriptUrl}?action=getCard`);
    const data = await res.json();
    return data.cardData ?? null;
  } catch {
    return null;
  }
}
