"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { decodeCardData } from "@/lib/card-data";
import { updateRsvp } from "@/lib/google-sheet";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mandala,
  CornerFoliage,
  LotusDivider,
} from "@/components/KandyanDecorations";

/* ─── Palette ─────────────────────────────────────────────────────────────
   The card uses the user-chosen primaryColor / accentColor, but the
   parchment background and text tones are always from the Kandyan palette.
   We read them as CSS custom properties so they feel consistent regardless
   of which accent the user picked.
──────────────────────────────────────────────────────────────────────────── */
const PARCHMENT = "#f5efe0";   // warm cream
const PARCHMENT_DARK = "#ede4d0";

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center"
             style={{ backgroundColor: PARCHMENT }}>
          <p style={{ color: "#8B6914", opacity: 0.5 }}>Loading…</p>
        </div>
      }
    >
      <InviteContent />
    </Suspense>
  );
}

function InviteContent() {
  const searchParams = useSearchParams();
  const card         = decodeCardData(searchParams.get("data") || "");
  const inviteeName  = searchParams.get("to") || "Guest";

  const [isOpen,    setIsOpen]    = useState(false);
  const [showRsvp,  setShowRsvp]  = useState(false);
  const [rsvpDone,  setRsvpDone]  = useState(false);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [sending,   setSending]   = useState(false);

  const audioRef           = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isOpen && audioRef.current) {
      audioRef.current.volume = 0.45;
      audioRef.current.play().catch(() => {});
    }
  }, [isOpen]);

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ backgroundColor: PARCHMENT }}>
        <p style={{ color: "#8B6914", opacity: 0.6 }}>Invalid invitation link.</p>
      </div>
    );
  }

  /* Accent = user's chosen colour; fallback to Kandyan gold */
  const accent  = card.accentColor  || "#8B6914";
  const primary = card.primaryColor || PARCHMENT;

  const dateStr = new Date(card.date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  async function handleRsvp() {
    if (attending === null) return;
    setSending(true);
    await updateRsvp(inviteeName, attending ? "Yes" : "No");
    setSending(false);
    setRsvpDone(true);
  }

  /* ── Shared card styles ───────────────────────────────────────────────── */
  const cardBg: React.CSSProperties = {
    background: `
      radial-gradient(ellipse at 50% 0%, ${PARCHMENT_DARK} 0%, ${PARCHMENT} 55%),
      url("/images/up.svg")
    `,
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 py-10 relative overflow-hidden"
      style={{ background: `linear-gradient(160deg, #e8dfc8 0%, #f5efe0 50%, #ede4d0 100%)` }}
    >
      {/* Page-level soft vignette */}
      <div className="pointer-events-none fixed inset-0"
           style={{ boxShadow: "inset 0 0 120px rgba(100,70,20,0.12)" }} />

      <AnimatePresence mode="wait">

        {/* ══════════════════════════════════════════════════════════════════
            CLOSED STATE — Double-door envelope
        ══════════════════════════════════════════════════════════════════ */}
        {!isOpen && (
          <motion.div
            key="envelope-wrapper"
            className="flex flex-col items-center gap-3 w-full max-w-xs"
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.35 } }}
          >
            {/* ── Above-card header ── */}
            <div className="flex flex-col items-center gap-1 w-full text-center">
              <div
                className="px-5 py-1 rounded-full border text-[10px] tracking-[0.35em] uppercase"
                style={{ borderColor: `${accent}50`, color: `${accent}90` }}
              >
                Save the Date
              </div>
              <p
                className="font-[family-name:var(--font-great-vibes)] text-4xl leading-snug mt-1"
                style={{ color: accent }}
              >
                {card.groom} &amp; {card.bride}
              </p>
              <p
                className="text-[11px] tracking-widest uppercase"
                style={{ color: `${accent}80` }}
              >
                {new Date(card.date + "T00:00:00").toLocaleDateString("en-US", {
                  month: "long", day: "2-digit", year: "numeric",
                })}
              </p>
            </div>

            {/* ── Envelope card ── */}
            <div
              className="relative w-full cursor-pointer select-none"
              style={{ perspective: "1400px" }}
              onClick={() => setIsOpen(true)}
            >
              {/* Outer shadow/border frame */}
              <motion.div
                className="relative w-full rounded-2xl shadow-2xl overflow-hidden"
                style={{
                  aspectRatio: "3/4",
                  ...cardBg,
                  border: `1.5px solid ${accent}35`,
                  boxShadow: `0 8px 40px rgba(100,70,20,0.22), 0 2px 8px rgba(100,70,20,0.12)`,
                }}
                whileHover={{ scale: 1.015, boxShadow: `0 16px 60px rgba(100,70,20,0.30)` }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                {/* ── LEFT DOOR PANEL ── */}
                <motion.div
                  className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"
                  style={{
                    transformOrigin: "left center",
                    transformStyle: "preserve-3d",
                    background: `linear-gradient(to right, ${PARCHMENT_DARK}, ${PARCHMENT})`,
                  }}
                  animate={isOpen
                    ? { rotateY: -105, opacity: 0 }
                    : { rotateY: 0,    opacity: 1 }}
                  transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Corner foliage TL */}
                  <CornerFoliage color={accent}
                    className="absolute top-0 w-32 h-40 opacity-65"
                    style={{ left: "-24%" } as React.CSSProperties} />
                  {/* Corner foliage BL */}
                  <CornerFoliage color={accent}
                    className="absolute bottom-0 w-32 h-40 opacity-65"
                    style={{ left: "-24%", transform: "scaleY(-1)" } as React.CSSProperties} />

                  {/* Vertical name — left edge */}
                  <div className="absolute left-2 top-0 bottom-0 flex items-center justify-center"
                       style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                    <span className="text-[8px] tracking-[0.3em] uppercase whitespace-nowrap"
                          style={{ color: `${accent}45` }}>
                      {card.groom} &amp; {card.bride}
                    </span>
                  </div>

                  {/* Side ornament dots */}
                  {[25, 45, 65].map((pct) => (
                    <div key={pct}
                         className="absolute right-0 w-1 h-1 rounded-full"
                         style={{ top: `${pct}%`, backgroundColor: `${accent}30` }} />
                  ))}
                </motion.div>

                {/* ── RIGHT DOOR PANEL ── */}
                <motion.div
                  className="absolute inset-y-0 right-0 w-1/2 overflow-hidden"
                  style={{
                    transformOrigin: "right center",
                    transformStyle: "preserve-3d",
                    background: `linear-gradient(to left, ${PARCHMENT_DARK}, ${PARCHMENT})`,
                  }}
                  animate={isOpen
                    ? { rotateY: 105, opacity: 0 }
                    : { rotateY: 0,   opacity: 1 }}
                  transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Corner foliage TR */}
                  <CornerFoliage color={accent}
                    className="absolute top-0 w-32 h-40 opacity-65"
                    style={{ right: "-24%", transform: "scaleX(-1)" } as React.CSSProperties} />
                  {/* Corner foliage BR */}
                  <CornerFoliage color={accent}
                    className="absolute bottom-0 w-32 h-40 opacity-65"
                    style={{ right: "-24%", transform: "scale(-1,-1)" } as React.CSSProperties} />

                  {/* Side ornament dots */}
                  {[25, 45, 65].map((pct) => (
                    <div key={pct}
                         className="absolute left-0 w-1 h-1 rounded-full"
                         style={{ top: `${pct}%`, backgroundColor: `${accent}30` }} />
                  ))}
                </motion.div>

                {/* ── CENTER SEAM ── */}
                <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 z-10"
                     style={{ background: `linear-gradient(to bottom, transparent, ${accent}40 20%, ${accent}40 80%, transparent)` }} />

                {/* ── COUPLE ILLUSTRATION (behind seal, above panels) ── */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                     style={{ top: "2%", bottom: "30%" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/couple-photo.svg"
                    alt="Kandyan couple"
                    className="w-28 h-auto object-contain opacity-80"
                  />
                </div>

                {/* ── WAX SEAL ── */}
                <div className="absolute z-20"
                     style={{ left: "50%", top: "68%", transform: "translate(-50%, -50%)" }}>
                  <motion.div
                    className="flex flex-col items-center justify-center"
                    whileHover={{ scale: 1.10 }}
                    whileTap={{ scale: 0.92 }}
                    animate={isOpen
                      ? { scale: 0, opacity: 0 }
                      : { scale: 1, opacity: 1 }}
                    transition={{ duration: 0.30 }}
                  >
                    {/* Pulse ring */}
                    <motion.div className="absolute rounded-full"
                      style={{ width: 90, height: 90, border: `1px solid ${accent}35` }}
                      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.65, 0.3] }}
                      transition={{ duration: 2.8, repeat: Infinity }} />
                    {/* Seal body */}
                    <div className="relative flex flex-col items-center justify-center rounded-full"
                         style={{
                           width: 72, height: 72,
                           background: `radial-gradient(circle, ${PARCHMENT} 60%, ${PARCHMENT_DARK} 100%)`,
                           border: `2px solid ${accent}55`,
                           boxShadow: `0 2px 12px rgba(100,70,20,0.25), inset 0 1px 3px rgba(255,255,255,0.8)`,
                         }}>
                      <div className="absolute rounded-full"
                           style={{ inset: 5, border: `1px dashed ${accent}35`, borderRadius: "50%" }} />
                      <p className="font-[family-name:var(--font-great-vibes)] text-xl leading-none z-10"
                         style={{ color: accent }}>
                        {card.groom.charAt(0)}&amp;{card.bride.charAt(0)}
                      </p>
                      <p className="text-[7px] tracking-[0.22em] uppercase mt-0.5 z-10"
                         style={{ color: `${accent}75` }}>
                        Open
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* ── LOTUS DIVIDER above bottom text ── */}
                <div className="absolute z-10 left-4 right-4" style={{ bottom: "14%" }}>
                  <LotusDivider color={accent} className="w-full opacity-45" />
                </div>

                {/* ── "TAP SEAL TO OPEN" footer ── */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-3"
                  animate={{ opacity: [0.45, 0.85, 0.45] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                >
                  <div className="px-5 py-1 rounded-full border text-[9px] tracking-[0.22em] uppercase"
                       style={{
                         borderColor: `${accent}30`,
                         color: `${accent}65`,
                         backgroundColor: `${PARCHMENT}cc`,
                       }}>
                    Tap Seal to Open
                  </div>
                </motion.div>

                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    background: `linear-gradient(105deg, transparent 35%, rgba(255,245,220,0.35) 50%, transparent 65%)`,
                    backgroundSize: "200% 100%",
                  }}
                  animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>

            {/* ── Below-card label ── */}
            <motion.p
              className="text-[10px] tracking-[0.35em] uppercase"
              style={{ color: `${accent}60` }}
              animate={{ opacity: [0.4, 0.85, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              Tap to Reveal
            </motion.p>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            OPEN STATE — Full Kandyan invitation card
        ══════════════════════════════════════════════════════════════════ */}
        {isOpen && (
          <motion.div
            key="card"
            className="w-full max-w-sm relative z-10"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {/* Confetti */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
              {Array.from({ length: 28 }).map((_, i) => {
                const shapes = ["🪷","🌸","✨","🌺","⭐","🌷","💛"];
                return (
                  <motion.span key={i}
                    className="absolute text-base select-none"
                    style={{ left: `${(i * 13) % 95}%`, top: "-5%" }}
                    animate={{
                      y: ["0vh", `${75 + (i % 5) * 5}vh`],
                      x: [0, ((i % 3) - 1) * 60],
                      rotate: [0, (i % 2 === 0 ? 1 : -1) * 270],
                      opacity: [1, 0],
                    }}
                    transition={{ duration: 2.2 + (i % 4) * 0.4, delay: (i % 6) * 0.12, ease: "easeOut" }}
                  >
                    {shapes[i % shapes.length]}
                  </motion.span>
                );
              })}
            </div>

            {/* ── Card shell ── */}
            <div className="rounded-2xl overflow-hidden relative"
                 style={{
                   ...cardBg,
                   border: `1.5px solid ${accent}30`,
                   boxShadow: `0 12px 50px rgba(100,70,20,0.25), 0 2px 8px rgba(100,70,20,0.12)`,
                 }}>

              {/* ── TOP MANDALA ── */}
              <div className="relative w-full overflow-hidden" style={{ height: 140 }}>
                {/* Header decoration — spans full card width */}
                <Mandala color={accent}
                  className="absolute top-0 left-0 w-full opacity-55"
                  style={{ height: 140, objectFit: "cover", objectPosition: "center top" } as React.CSSProperties} />
                {/* Corner foliage overlaid on top of header */}
                <CornerFoliage color={accent} className="absolute top-0 left-0 w-24 h-24 opacity-70" />
                <CornerFoliage color={accent}
                  className="absolute top-0 right-0 w-24 h-24 opacity-70"
                  style={{ transform: "scaleX(-1)" } as React.CSSProperties} />
              </div>

              {/* ── CONTENT ── */}
              <div className="px-8 pb-0 text-center relative z-10">

                {/* Mute button */}
                <div className="flex justify-end -mt-2 mb-2">
                  <button
                    onClick={() => {
                      if (audioRef.current) audioRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }}
                    className="text-lg opacity-40 hover:opacity-80 transition select-none"
                    style={{ color: accent }}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? "🔇" : "🔊"}
                  </button>
                </div>

                {/* ── Couple illustration ── */}
                <motion.div
                  className="flex justify-center mb-2"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/couple-photo.svg"
                    alt="Kandyan couple"
                    className="w-44 h-auto object-contain"
                  />
                </motion.div>

                {/* Lotus divider 1 */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <LotusDivider color={accent} className="w-full opacity-50 mb-4" />
                </motion.div>

                {/* Family lines */}
                <motion.div className="mb-4 space-y-0.5"
                  style={{ color: accent }}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 0.65, y: 0 }}
                  transition={{ delay: 0.35 }}>
                  <p className="text-[10px] tracking-widest uppercase">Mr. &amp; Mrs. Herath</p>
                  <p className="text-[9px] tracking-wider uppercase opacity-60">together with</p>
                  <p className="text-[10px] tracking-widest uppercase">Mr. &amp; Mrs. Rathnayake</p>
                  <p className="text-[9px] tracking-wider uppercase opacity-55 mt-1">
                    request the pleasure of the presence of
                  </p>
                  <p className="font-[family-name:var(--font-great-vibes)] text-2xl mt-0.5"
                     style={{ opacity: 1 }}>
                    {inviteeName}
                  </p>
                </motion.div>

                <motion.p className="text-[9px] tracking-wider uppercase mb-3"
                  style={{ color: accent, opacity: 0.5 }}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.4 }}>
                  at the wedding ceremony of
                </motion.p>

                {/* Names */}
                <motion.h1
                  className="font-[family-name:var(--font-great-vibes)] text-5xl sm:text-6xl mb-0"
                  style={{ color: accent }}
                  initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45, type: "spring" }}>
                  {card.groom}
                </motion.h1>
                <motion.p className="text-xl my-1 select-none"
                  style={{ color: accent, opacity: 0.28 }}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.28 }}
                  transition={{ delay: 0.52 }}>
                  ♥
                </motion.p>
                <motion.h1
                  className="font-[family-name:var(--font-great-vibes)] text-5xl sm:text-6xl mb-4"
                  style={{ color: accent }}
                  initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.58, type: "spring" }}>
                  {card.bride}
                </motion.h1>

                {/* Lotus divider 2 */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
                  <LotusDivider color={accent} className="w-full opacity-45 mb-4" />
                </motion.div>

                {/* Poruwa ceremony box */}
                {card.poruwaTime && (
                  <motion.div
                    className="mb-4 mx-auto max-w-xs px-5 py-3 rounded-xl"
                    style={{
                      border: `1px solid ${accent}30`,
                      background: `linear-gradient(135deg, ${accent}06, ${accent}10)`,
                    }}
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}>
                    <p className="text-[9px] tracking-widest uppercase mb-0.5"
                       style={{ color: accent, opacity: 0.55 }}>
                      🪷 Poruwa Ceremony
                    </p>
                    <p className="font-[family-name:var(--font-playfair)] text-2xl font-semibold"
                       style={{ color: accent }}>
                      {card.poruwaTime}
                    </p>
                  </motion.div>
                )}

                {/* Date & Time */}
                <motion.div className="mb-3"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}>
                  <p className="font-[family-name:var(--font-playfair)] text-base mb-0.5"
                     style={{ color: accent }}>
                    {dateStr}
                  </p>
                  <p className="text-sm" style={{ color: accent, opacity: 0.55 }}>
                    {card.time} onwards
                  </p>
                </motion.div>

                {/* Lotus divider 3 */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.80 }}>
                  <LotusDivider color={accent} className="w-full opacity-40 mb-3" />
                </motion.div>

                {/* Venue */}
                <motion.div className="mb-4"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 }}>
                  <p className="font-[family-name:var(--font-playfair)] text-base"
                     style={{ color: accent }}>
                    📍 {card.venue}
                  </p>
                  {card.mapLink && (
                    <a href={card.mapLink} target="_blank" rel="noopener noreferrer"
                       className="inline-block mt-1 text-xs underline transition hover:opacity-90"
                       style={{ color: accent, opacity: 0.45 }}>
                      Get Directions →
                    </a>
                  )}
                </motion.div>

                {/* Message */}
                {card.message && (
                  <motion.p
                    className="text-sm italic mb-5 max-w-xs mx-auto leading-relaxed"
                    style={{ color: accent, opacity: 0.45 }}
                    initial={{ opacity: 0 }} animate={{ opacity: 0.45 }}
                    transition={{ delay: 0.9 }}>
                    &ldquo;{card.message}&rdquo;
                  </motion.p>
                )}

                {/* ── RSVP section ── */}
                <div className="mb-2">
                  {rsvpDone ? (
                    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                                className="py-4">
                      <p className="text-2xl mb-1">🪷</p>
                      <p className="font-semibold text-sm" style={{ color: accent }}>
                        Thank you, {inviteeName}!
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: accent, opacity: 0.40 }}>
                        Your response has been noted.
                      </p>
                    </motion.div>
                  ) : !showRsvp ? (
                    <motion.div className="flex flex-col items-center gap-1.5"
                      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}>
                      <motion.button
                        onClick={() => setShowRsvp(true)}
                        className="px-8 py-2.5 rounded-full font-semibold text-sm tracking-wide shadow-md transition"
                        style={{ backgroundColor: accent, color: PARCHMENT }}
                        whileHover={{ scale: 1.05, boxShadow: `0 6px 24px ${accent}45` }}
                        whileTap={{ scale: 0.95 }}>
                        💌 RSVP Now
                      </motion.button>
                      <p className="text-[10px] italic" style={{ color: accent, opacity: 0.38 }}>
                        Kindly respond by{" "}
                        {new Date(card.date + "T00:00:00").toLocaleDateString("en-US", {
                          month: "long", day: "numeric",
                        })}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="space-y-3 text-left">
                      <div className="flex gap-2">
                        {[true, false].map((val) => (
                          <button key={String(val)} type="button"
                            onClick={() => setAttending(val)}
                            className="flex-1 py-2 rounded-lg border-2 text-xs font-medium transition"
                            style={{
                              borderColor:   attending === val ? accent : `${accent}28`,
                              backgroundColor: attending === val ? accent : "transparent",
                              color:         attending === val ? PARCHMENT : accent,
                            }}>
                            {val ? "🪷 Joyfully Accept" : "😔 Regretfully Decline"}
                          </button>
                        ))}
                      </div>
                      {attending !== null && (
                        <button onClick={handleRsvp} disabled={sending}
                          className="w-full py-2.5 rounded-full font-semibold text-sm shadow-md transition disabled:opacity-55"
                          style={{ backgroundColor: accent, color: PARCHMENT }}>
                          {sending ? "Sending… 💌" : "Send RSVP 💌"}
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* ── PERAHERA STRIP at bottom ── */}
              <motion.div
                className="w-full mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/perahara.svg"
                  alt="Kandyan perahera procession"
                  className="w-full object-contain"
                />
              </motion.div>

              {/* Bottom corner foliage */}
              <div className="relative h-16 overflow-hidden">
                <CornerFoliage color={accent}
                  className="absolute bottom-0 left-0 w-20 h-20 opacity-55"
                  style={{ transform: "scaleY(-1)" } as React.CSSProperties} />
                <CornerFoliage color={accent}
                  className="absolute bottom-0 right-0 w-20 h-20 opacity-55"
                  style={{ transform: "scale(-1,-1)" } as React.CSSProperties} />
                <p className="absolute bottom-3 left-0 right-0 text-center text-[9px] tracking-[0.3em] uppercase select-none"
                   style={{ color: `${accent}40` }}>
                  ✦ forever &amp; always ✦
                </p>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <audio ref={audioRef} src="/music/love-song.mp3" loop preload="auto" />
    </div>
  );
}
