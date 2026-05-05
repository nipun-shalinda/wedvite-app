"use client";

import type { CardData } from "@/lib/card-data";

interface Props {
  form: CardData;
  update: (field: keyof CardData, value: string | boolean) => void;
}

export default function StepDetails({ form, update }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Wedding Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Groom&apos;s Name *</label>
          <input type="text" value={form.groom} onChange={(e) => update("groom", e.target.value)}
            placeholder="e.g. Gayanath" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Bride&apos;s Name *</label>
          <input type="text" value={form.bride} onChange={(e) => update("bride", e.target.value)}
            placeholder="e.g. Gayasha" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Groom&apos;s Parents *</label>
          <input type="text" value={form.groomParents} onChange={(e) => update("groomParents", e.target.value)}
            placeholder="e.g. Mr. & Mrs. Herath" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Bride&apos;s Parents *</label>
          <input type="text" value={form.brideParents} onChange={(e) => update("brideParents", e.target.value)}
            placeholder="e.g. Mr. & Mrs. Rathnayake" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Wedding Date *</label>
          <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Wedding Time *</label>
          <input type="time" value={form.time} onChange={(e) => update("time", e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
        </div>
      </div>

      {/* Poruwa toggle */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => update("showPoruwa", !form.showPoruwa)}
          className={`relative w-12 h-6 rounded-full transition-colors ${form.showPoruwa ? "bg-[#b8860b]" : "bg-gray-300"}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.showPoruwa ? "translate-x-6" : ""}`} />
        </button>
        <span className="text-sm text-gray-700">Show Poruwa Ceremony Time</span>
      </div>

      {form.showPoruwa && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">Poruwa Time *</label>
          <input type="time" value={form.poruwaTime} onChange={(e) => update("poruwaTime", e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-600 mb-1">Venue *</label>
        <input type="text" value={form.venue} onChange={(e) => update("venue", e.target.value)}
          placeholder="e.g. Amaya Grand, Giriulla" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Google Maps Link *</label>
        <input type="url" value={form.mapLink} onChange={(e) => update("mapLink", e.target.value)}
          placeholder="https://maps.app.goo.gl/..." className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
      </div>
    </div>
  );
}
