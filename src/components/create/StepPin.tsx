"use client";

import type { CardData } from "@/lib/card-data";

interface Props {
  form: CardData;
  update: (field: keyof CardData, value: string) => void;
}

export default function StepPin({ form, update }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Set a PIN</h2>
      <p className="text-sm text-gray-500">
        This 4-digit PIN lets you recover your card from a new device using your Google Sheet URL + PIN.
      </p>

      <div>
        <label className="block text-sm text-gray-600 mb-1">4-Digit PIN *</label>
        <input type="text" inputMode="numeric" maxLength={4} value={form.pin}
          onChange={(e) => update("pin", e.target.value.replace(/\D/g, "").slice(0, 4))}
          placeholder="e.g. 1234"
          className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-500 space-y-1">
        <p>• You&apos;ll need this PIN + your Google Sheet URL to access your card from another device</p>
        <p>• On this device, your card is saved automatically (no PIN needed to return)</p>
        <p>• The PIN is not shared with your guests</p>
      </div>
    </div>
  );
}
