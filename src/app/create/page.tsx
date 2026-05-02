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

        {/* Live Preview — white & pink card */}
        <div className="lg:w-96 shrink-0">
          <div className="sticky top-8">
            <h3 className="text-sm font-medium text-gray-400 mb-3">✨ Card Preview</h3>
            <div ref={previewRef} className="rounded-2xl overflow-hidden shadow-2xl aspect-[3/4] relative flex flex-col items-center justify-center p-6 text-center"
              style={{ backgroundColor: form.primaryColor, border: `2px solid ${form.accentColor}30` }}>

              {/* Ornamental corner borders */}
              <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 rounded-tl-lg opacity-30" style={{ borderColor: form.accentColor }} />
              <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 rounded-tr-lg opacity-30" style={{ borderColor: form.accentColor }} />
              <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 rounded-bl-lg opacity-30" style={{ borderColor: form.accentColor }} />
              <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 rounded-br-lg opacity-30" style={{ borderColor: form.accentColor }} />

              {/* Animated couple background */}
              <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/couple-photo.svg" alt="" className="w-full h-full object-cover opacity-25" />
              </div>

              {/* Semi-transparent overlay for readability */}
              <div className="absolute inset-0 z-[1]" style={{ backgroundColor: form.primaryColor, opacity: 0.6 }} />

              {/* Background pattern */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
                {form.pattern === "floral" && ["🌸", "🪷", "🌺", "🪷", "🌸", "🪷", "🌺", "🪷"].map((f, i) => (
                  <span key={i} className="absolute text-sm opacity-10 select-none"
                    style={{ left: `${5 + (i * 14) % 85}%`, top: `${4 + (i * 16) % 88}%`, transform: `rotate(${i * 30}deg)` }}>{f}</span>
                ))}
                {form.pattern === "hearts" && ["💕", "💗", "💖", "🤍", "💕", "💗", "🤍", "💖"].map((h, i) => (
                  <span key={i} className="absolute text-sm opacity-10 select-none"
                    style={{ left: `${10 + (i * 12) % 80}%`, top: `${5 + (i * 17) % 85}%` }}>{h}</span>
                ))}
                {form.pattern === "sparkle" && ["✨", "⭐", "💫", "✨", "⭐", "💫", "✨", "⭐"].map((s, i) => (
                  <span key={i} className="absolute text-sm opacity-15 select-none"
                    style={{ left: `${8 + (i * 13) % 82}%`, top: `${3 + (i * 15) % 90}%` }}>{s}</span>
                ))}
                <div className="absolute inset-0 opacity-20"
                  style={{ background: `radial-gradient(circle at 50% 30%, ${form.accentColor}25, transparent 70%)` }} />
              </div>

              {/* Couple names */}
              <p className="font-[family-name:var(--font-great-vibes)] text-3xl mb-0.5 relative z-[3]" style={{ color: form.accentColor }}>
                {HARDCODED_CARD.groom}
              </p>
              <p className="text-lg opacity-40 select-none relative z-[3]" style={{ color: form.accentColor }}>♥</p>
              <p className="font-[family-name:var(--font-great-vibes)] text-3xl mb-3 relative z-[3]" style={{ color: form.accentColor }}>
                {HARDCODED_CARD.bride}
              </p>

              {/* Divider */}
              <div className="flex items-center gap-2 mb-3 relative z-[3]">
                <div className="w-6 h-px opacity-30" style={{ backgroundColor: form.accentColor }} />
                <span className="text-xs opacity-40 select-none" style={{ color: form.accentColor }}>🪷</span>
                <div className="w-6 h-px opacity-30" style={{ backgroundColor: form.accentColor }} />
              </div>

              {/* Poruwa ceremony */}
              <div className="relative z-[3] mb-2 px-4 py-1.5 rounded-lg border opacity-80" style={{ borderColor: `${form.accentColor}40`, backgroundColor: `${form.accentColor}10` }}>
                <p className="text-[10px] tracking-wider uppercase opacity-60" style={{ color: form.accentColor }}>Poruwa Ceremony</p>
                <p className="text-sm font-semibold" style={{ color: form.accentColor }}>{HARDCODED_CARD.poruwaTime}</p>
              </div>

              {/* Date & venue */}
              <p className="font-[family-name:var(--font-playfair)] text-xs font-semibold mb-0.5 relative z-[3]" style={{ color: form.accentColor }}>{dateStr}</p>
              <p className="text-[10px] opacity-50 mb-2 relative z-[3]" style={{ color: form.accentColor }}>{HARDCODED_CARD.time} onwards</p>
              <p className="text-[10px] opacity-40 mb-2 relative z-[3]" style={{ color: form.accentColor }}>📍 {HARDCODED_CARD.venue}</p>

              {/* Message */}
              <p className="text-[10px] italic opacity-35 max-w-[180px] leading-relaxed relative z-[3]" style={{ color: form.accentColor }}>
                &ldquo;{form.message}&rdquo;
              </p>

              {/* Bottom ornament */}
              <div className="mt-3 flex items-center gap-1 opacity-25 select-none relative z-[3]">
                <span style={{ color: form.accentColor }}>✦</span>
                <span className="text-[10px]" style={{ color: form.accentColor }}>forever & always</span>
                <span style={{ color: form.accentColor }}>✦</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
