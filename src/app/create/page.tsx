"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HARDCODED_CARD, DEFAULT_THEME, FONT_STYLES, BACKGROUND_PATTERNS } from "@/lib/constants";

export default function CreatePage() {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    message: "With hearts full of joy, we invite you to witness and celebrate the beginning of our forever.",
    primaryColor: DEFAULT_THEME.primary,
    accentColor: DEFAULT_THEME.accent,
    pattern: "floral",
    font: "romantic",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleShare() {
    router.push(`/create/share`);
  }

  async function downloadImage() {
    const el = previewRef.current;
    if (!el) return;
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(el, { pixelRatio: 3 });
    const link = document.createElement("a");
    link.download = `${HARDCODED_CARD.groom}-${HARDCODED_CARD.bride}-invitation.png`;
    link.href = dataUrl;
    link.click();
  }

  const dateStr = new Date(HARDCODED_CARD.date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-[family-name:var(--font-playfair)] text-gray-800">Create Your Invitation</h1>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1 bg-gray-50 rounded-xl shadow-sm p-8 space-y-6 border border-gray-200">
          {/* Hardcoded info */}
          <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">🪷 Wedding Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <p><span className="opacity-50">Groom:</span> {HARDCODED_CARD.groom}</p>
              <p><span className="opacity-50">Bride:</span> {HARDCODED_CARD.bride}</p>
              <p><span className="opacity-50">Date:</span> {dateStr}</p>
              <p><span className="opacity-50">Time:</span> {HARDCODED_CARD.time}</p>
              <p><span className="opacity-50">Poruwa:</span> {HARDCODED_CARD.poruwaTime}</p>
              <p><span className="opacity-50">Venue:</span> {HARDCODED_CARD.venue}</p>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Personal Message 💌</label>
            <textarea value={form.message} onChange={(e) => update("message", e.target.value)} rows={3}
              className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#b8860b]/40" />
          </div>

          {/* Font style */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Font Style</label>
            <div className="flex gap-3">
              {FONT_STYLES.map((style) => (
                <button key={style} onClick={() => update("font", style)}
                  className={`flex-1 py-2.5 rounded-lg border-2 text-sm capitalize transition ${form.font === style ? "border-[#b8860b] bg-[#b8860b] text-white" : "border-gray-300 text-gray-700 hover:border-gray-400"}`}>
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Background Pattern</label>
            <div className="flex gap-3">
              {BACKGROUND_PATTERNS.map((p) => (
                <button key={p} onClick={() => update("pattern", p)}
                  className={`flex-1 py-2.5 rounded-lg border-2 text-sm capitalize transition ${form.pattern === p ? "border-[#b8860b] bg-[#b8860b] text-white" : "border-gray-300 text-gray-700 hover:border-gray-400"}`}>
                  {p === "hearts" ? "💕" : p === "sparkle" ? "✨" : p === "floral" ? "🌸" : "◽"} {p}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={downloadImage} className="flex-1 border-2 border-[#b8860b] text-[#b8860b] rounded-lg py-3 font-semibold hover:bg-[#b8860b]/10 transition">
              📸 Download Image
            </button>
            <button onClick={handleShare} className="flex-1 bg-[#b8860b] text-white rounded-lg py-3 font-semibold hover:bg-[#a07608] transition shadow-lg">
              Share with Guests ✨
            </button>
          </div>
        </div>

        {/* Live Preview — matches invite card */}
        <div className="lg:w-[28rem] shrink-0">
          <div className="sticky top-8">
            <h3 className="text-sm font-medium text-gray-400 mb-3">✨ Card Preview</h3>
            <div ref={previewRef} className="rounded-2xl overflow-hidden shadow-2xl relative"
              style={{ backgroundColor: form.primaryColor, border: `2px solid ${form.accentColor}20` }}>

              {/* Ornamental corner borders */}
              <div className="absolute top-4 left-4 w-14 h-14 border-t-2 border-l-2 rounded-tl-lg opacity-20 z-20" style={{ borderColor: form.accentColor }} />
              <div className="absolute top-4 right-4 w-14 h-14 border-t-2 border-r-2 rounded-tr-lg opacity-20 z-20" style={{ borderColor: form.accentColor }} />
              <div className="absolute bottom-4 left-4 w-14 h-14 border-b-2 border-l-2 rounded-bl-lg opacity-20 z-20" style={{ borderColor: form.accentColor }} />
              <div className="absolute bottom-4 right-4 w-14 h-14 border-b-2 border-r-2 rounded-br-lg opacity-20 z-20" style={{ borderColor: form.accentColor }} />

              {/* Content */}
              <div className="p-8 sm:p-12 text-center relative z-10">
                <p className="text-2xl mb-2 select-none">🪷</p>

                {/* Parent names */}
                <div className="mb-6 space-y-1" style={{ color: form.accentColor }}>
                  <p className="text-xs tracking-widest uppercase opacity-60">Mr. &amp; Mrs. Herath</p>
                  <p className="text-[10px] tracking-wider uppercase opacity-40">together with</p>
                  <p className="text-xs tracking-widest uppercase opacity-60">Mr. &amp; Mrs. Rathnayake</p>
                  <p className="text-[10px] tracking-wider uppercase opacity-40 mt-2">request the pleasure of the presence of</p>
                  <p className="font-[family-name:var(--font-great-vibes)] text-2xl mt-1 opacity-60">Guest</p>
                </div>

                <p className="text-[10px] tracking-wider uppercase mb-4 opacity-50" style={{ color: form.accentColor }}>at the wedding ceremony of</p>

                {/* Couple names */}
                <p className="font-[family-name:var(--font-great-vibes)] text-5xl mb-2" style={{ color: form.accentColor }}>
                  {HARDCODED_CARD.groom}
                </p>
                <p className="text-2xl my-2 opacity-30 select-none" style={{ color: form.accentColor }}>♥</p>
                <p className="font-[family-name:var(--font-great-vibes)] text-5xl mb-6" style={{ color: form.accentColor }}>
                  {HARDCODED_CARD.bride}
                </p>

                <p className="text-sm tracking-widest uppercase opacity-25 mb-6" style={{ color: form.accentColor }}>
                  Request the pleasure of your company
                </p>

                {/* Divider */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-12 h-px opacity-20" style={{ backgroundColor: form.accentColor }} />
                  <span className="text-sm select-none" style={{ color: form.accentColor }}>🪷</span>
                  <div className="w-12 h-px opacity-20" style={{ backgroundColor: form.accentColor }} />
                </div>

                {/* Poruwa ceremony */}
                <div className="mb-6 mx-auto max-w-xs px-6 py-4 rounded-xl border"
                  style={{ borderColor: `${form.accentColor}30`, backgroundColor: `${form.accentColor}08` }}>
                  <p className="text-xs tracking-widest uppercase opacity-50 mb-1" style={{ color: form.accentColor }}>🪷 Poruwa Ceremony</p>
                  <p className="font-[family-name:var(--font-playfair)] text-2xl font-semibold" style={{ color: form.accentColor }}>{HARDCODED_CARD.poruwaTime}</p>
                </div>

                {/* Date & time */}
                <div className="mb-4">
                  <p className="font-[family-name:var(--font-playfair)] text-xl mb-1" style={{ color: form.accentColor }}>{dateStr}</p>
                  <p className="text-lg opacity-50" style={{ color: form.accentColor }}>{HARDCODED_CARD.time} onwards</p>
                </div>

                {/* Venue */}
                <div className="mb-6">
                  <p className="font-[family-name:var(--font-playfair)] text-lg" style={{ color: form.accentColor }}>📍 {HARDCODED_CARD.venue}</p>
                </div>

                {/* Message */}
                <p className="text-base italic opacity-40 mb-8 max-w-sm mx-auto leading-relaxed" style={{ color: form.accentColor }}>
                  &ldquo;{form.message}&rdquo;
                </p>

                {/* Bottom ornament */}
                <div className="flex items-center justify-center gap-1 mb-6 opacity-15 select-none">
                  <span style={{ color: form.accentColor }}>✦</span>
                  <span className="text-xs" style={{ color: form.accentColor }}>forever & always</span>
                  <span style={{ color: form.accentColor }}>✦</span>
                </div>

                {/* RSVP placeholder */}
                <div className="px-8 py-3 rounded-full font-semibold text-sm tracking-wide inline-block"
                  style={{ backgroundColor: form.accentColor, color: form.primaryColor }}>
                  💌 RSVP Now
                </div>
                <p className="text-xs opacity-35 italic mt-2" style={{ color: form.accentColor }}>
                  Kindly respond by {new Date(HARDCODED_CARD.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
