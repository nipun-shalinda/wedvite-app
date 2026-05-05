"use client";

import type { CardData } from "@/lib/card-data";
import { FONT_STYLES, BACKGROUND_PATTERNS } from "@/lib/constants";

interface Props {
  form: CardData;
  update: (field: keyof CardData, value: string) => void;
}

export default function StepCustomize({ form, update }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Customize</h2>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Personal Message 💌</label>
        <textarea value={form.message} onChange={(e) => update("message", e.target.value)} rows={3}
          className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">Font Style</label>
        <div className="flex gap-3">
          {FONT_STYLES.map((style) => (
            <button key={style} type="button" onClick={() => update("font", style)}
              className={`flex-1 py-2.5 rounded-lg border-2 text-sm capitalize transition ${form.font === style ? "border-[#b8860b] bg-[#b8860b] text-white" : "border-gray-300 text-gray-700 hover:border-gray-400"}`}>
              {style}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">Background Pattern</label>
        <div className="flex gap-3 flex-wrap">
          {BACKGROUND_PATTERNS.map((p) => (
            <button key={p} type="button" onClick={() => update("pattern", p)}
              className={`flex-1 min-w-[5rem] py-2.5 rounded-lg border-2 text-sm capitalize transition ${form.pattern === p ? "border-[#b8860b] bg-[#b8860b] text-white" : "border-gray-300 text-gray-700 hover:border-gray-400"}`}>
              {p === "hearts" ? "💕" : p === "sparkle" ? "✨" : p === "floral" ? "🌸" : "◽"} {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Primary Color</label>
          <input type="color" value={form.primaryColor} onChange={(e) => update("primaryColor", e.target.value)}
            className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Accent Color</label>
          <input type="color" value={form.accentColor} onChange={(e) => update("accentColor", e.target.value)}
            className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
