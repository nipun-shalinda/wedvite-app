"use client";

import { useState } from "react";
import { getDefaultCard } from "@/lib/card-data";
import { buildShareMessage, buildInviteUrl, whatsappUrl, emailUrl } from "@/lib/share";
import { addInvitee } from "@/lib/google-sheet";
import Link from "next/link";

interface InviteeEntry {
  name: string;
  link: string;
}

export default function SharePage() {
  const card = getDefaultCard();
  const [inviteeName, setInviteeName] = useState("");
  const [invitees, setInvitees] = useState<InviteeEntry[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  async function handleAddInvitee() {
    const name = inviteeName.trim();
    if (!name) return;
    const link = buildInviteUrl(card, name, baseUrl);
    setInvitees((prev) => [...prev, { name, link }]);
    setInviteeName("");
    await addInvitee(name);
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <Link href="/create" className="text-sm text-black/40 hover:text-black/70">← Edit Card</Link>
        <h1 className="text-xl font-[family-name:var(--font-playfair)] text-gray-800">
          {card.groom} & {card.bride} — Share
        </h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Card preview mini */}
        <div className="rounded-xl overflow-hidden shadow-lg mb-8 p-8 text-center border"
          style={{ backgroundColor: card.primaryColor, borderColor: `${card.accentColor}30` }}>
          <p className="font-[family-name:var(--font-great-vibes)] text-4xl mb-2" style={{ color: card.accentColor }}>
            {card.groom} & {card.bride}
          </p>
          <p className="text-sm opacity-60" style={{ color: card.accentColor }}>
            {new Date(card.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} {card.time} onwards
          </p>
          <p className="text-sm opacity-50 mt-1" style={{ color: card.accentColor }}>🪷 Poruwa at {card.poruwaTime}</p>
          <p className="text-sm opacity-50 mt-1" style={{ color: card.accentColor }}>📍 {card.venue}</p>
        </div>

        {/* Add invitee */}
        <div className="bg-gray-50 rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="font-semibold mb-4 text-gray-800">Add Invitee Name</h3>
          <div className="flex gap-3">
            <input
              value={inviteeName}
              onChange={(e) => setInviteeName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddInvitee()}
              placeholder="Guest name (e.g. Uncle Raj)"
              className="flex-1 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40"
            />
            <button onClick={handleAddInvitee}
              className="bg-[#b8860b] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#a07608] transition">
              Generate Link
            </button>
          </div>
        </div>

        {/* Invitee list */}
        {invitees.length > 0 && (
          <div className="bg-gray-50 rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">
                {invitees.length} Invitee{invitees.length > 1 ? "s" : ""}
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {invitees.map((inv, i) => {
                const msg = buildShareMessage(card, inv.name, baseUrl);
                return (
                  <div key={i} className="px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <span className="font-medium text-gray-800">{inv.name}</span>
                      <div className="flex flex-wrap gap-2">
                        <a href={whatsappUrl(msg)} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] transition">
                          📱 WhatsApp
                        </a>
                        <a href={emailUrl(msg, card.groom, card.bride)} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                          📧 Email
                        </a>
                        <button onClick={() => copyToClipboard(inv.link, `link-${i}`)}
                          className="text-xs px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                          {copied === `link-${i}` ? "✓ Copied!" : "🔗 Copy Link"}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-black/30 truncate">{inv.link}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {invitees.length === 0 && (
          <p className="text-center text-black/30 py-8">
            Add invitee names above to generate personalized invitation links.
          </p>
        )}
      </main>
    </div>
  );
}
