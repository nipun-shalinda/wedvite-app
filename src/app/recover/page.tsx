"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCardFromSheet } from "@/lib/google-sheet";
import { decodeCardData, encodeCardData } from "@/lib/card-data";

export default function RecoverPage() {
  const router = useRouter();
  const [sheetUrl, setSheetUrl] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRecover() {
    setError("");
    if (!sheetUrl.trim() || pin.length !== 4) {
      setError("Please enter your Google Sheet URL and 4-digit PIN.");
      return;
    }

    setLoading(true);
    const cardDataEncoded = await getCardFromSheet(sheetUrl.trim());
    setLoading(false);

    if (!cardDataEncoded) {
      setError("Could not retrieve card data. Check your Google Sheet URL.");
      return;
    }

    const card = decodeCardData(cardDataEncoded);
    if (!card) {
      setError("Card data is corrupted. Please create a new card.");
      return;
    }

    if (card.pin !== pin) {
      setError("Wrong PIN. Please try again.");
      return;
    }

    // Success — save to localStorage and redirect
    const shareUrl = `/create/share?data=${encodeCardData(card, true)}`;
    localStorage.setItem("wedvite_my_card", shareUrl);
    localStorage.setItem("wedvite_sheet_url", sheetUrl.trim());
    router.push(shareUrl);
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-[family-name:var(--font-playfair)] text-gray-800 mb-2 text-center">Recover My Card</h1>
        <p className="text-sm text-gray-500 text-center mb-8">Enter your Google Sheet URL and PIN to access your share page.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Google Apps Script URL</label>
            <input type="url" value={sheetUrl} onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">4-Digit PIN</label>
            <input type="text" inputMode="numeric" maxLength={4} value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="1234"
              className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button onClick={handleRecover} disabled={loading}
            className="w-full bg-[#b8860b] text-white rounded-lg py-3 font-semibold hover:bg-[#a07608] transition shadow-lg disabled:opacity-50">
            {loading ? "Recovering…" : "Recover My Card"}
          </button>
        </div>
      </div>
    </div>
  );
}
