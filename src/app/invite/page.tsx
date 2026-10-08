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

  // ── Countdown state ───────────────────────────────────────────────────────
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number; past: boolean }>({ days: 0, hours: 0, minutes: 0, seconds: 0, past: false });

  useEffect(() => {
    // Parse human-readable time strings (e.g. "9.00 AM", "9:00 AM", "14:30") → "HH:MM"
    function parseTime(raw: string): string {
      const s = raw.trim();
      // Already 24h HH:MM or HH:MM:SS
      if (/^\d{1,2}:\d{2}/.test(s) && !/am|pm/i.test(s)) {
        const [h, m] = s.split(":");
        return String(Number(h)).padStart(2, "0") + ":" + m.slice(0, 2).padStart(2, "0");
      }
      // 12h with AM/PM — dots or colons as separator
      const match = s.match(/(\d{1,2})[.:]?(\d{2})?\s*(am|pm)/i);
      if (match) {
        let h = Number(match[1]);
        const m = Number(match[2] ?? 0);
        const isPm = /pm/i.test(match[3]);
        if (isPm && h !== 12) h += 12;
        if (!isPm && h === 12) h = 0;
        return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
      }
      return "00:00"; // fallback
    }

    const timeStr = card?.time ? parseTime(card.time) : "00:00";
    const targetTime = card
      ? new Date(card.date + "T" + timeStr + ":00").getTime()
      : new Date("9999-01-01T00:00:00").getTime();

    function tick() {
      const now  = Date.now();
      const diff = targetTime - now;
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, past: true });
        return;
      }
      const days    = Math.floor(diff / 86_400_000);
      const hours   = Math.floor((diff % 86_400_000) / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000)  / 60_000);
      const seconds = Math.floor((diff % 60_000)     / 1_000);
      setCountdown({ days, hours, minutes, seconds, past: false });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [card?.date, card?.time]);

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
              <div className="relative w-full overflow-hidden" style={{ height: 80 }}>
                {/* Header decoration — 67% width, centred */}
                <Mandala color={accent}
                  className="absolute top-0 left-1/2 -translate-x-1/2 opacity-55"
                  style={{ width: "67%", height: 80, objectFit: "cover", objectPosition: "center top" } as React.CSSProperties} />
                {/* Corner foliage overlaid on top of header */}
                <CornerFoliage color={accent}
                  className="absolute top-0 w-32 h-40 opacity-70"
                  style={{ left: "-10%" } as React.CSSProperties} />
                <CornerFoliage color={accent}
                  className="absolute top-0 w-32 h-40 opacity-70"
                  style={{ right: "-10%", transform: "scaleX(-1)" } as React.CSSProperties} />
              </div>

              {/* ── CONTENT ── */}
              <div className="pb-0 text-center relative z-10">

                {/* Mute button */}
                <div className="flex justify-end px-8 -mt-2 mb-2">
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

                {/* ══════════════════════════════════════════════
                    SECTION 1 — Couple card
                ══════════════════════════════════════════════ */}
                <motion.div
                  className="flex justify-center mb-4"
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

                {/* Section divider */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <LotusDivider color={accent} className="w-full opacity-50" />
                </motion.div>

                {/* ══════════════════════════════════════════════
                    SECTION 2 — Invitation
                ══════════════════════════════════════════════ */}
                <motion.div
                  className="px-8 pt-6 pb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  {/* WITH JOY IN OUR HEARTS */}
                  <p className="text-[9px] tracking-[0.35em] uppercase mb-1"
                     style={{ color: accent, opacity: 0.55 }}>
                    With Joy in Our Hearts
                  </p>

                  {/* You&apos;re Invited! */}
                  <p className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-1"
                     style={{ color: accent }}>
                    You&apos;re Invited!
                  </p>

                  {/* the wedding of */}
                  <p className="text-[9px] tracking-widest uppercase mb-3"
                     style={{ color: accent, opacity: 0.45 }}>
                    the wedding of
                  </p>

                  {/* Groom name */}
                  <motion.h1
                    className="font-[family-name:var(--font-great-vibes)] text-5xl sm:text-6xl mb-0 leading-tight"
                    style={{ color: accent }}
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45, type: "spring" }}>
                    {card.groom}
                  </motion.h1>

                  {/* & */}
                  <p className="text-base tracking-[0.25em] my-1 select-none font-[family-name:var(--font-playfair)]"
                     style={{ color: accent, opacity: 0.50 }}>
                    &amp;
                  </p>

                  {/* Bride name */}
                  <motion.h1
                    className="font-[family-name:var(--font-great-vibes)] text-5xl sm:text-6xl mb-4 leading-tight"
                    style={{ color: accent }}
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.52, type: "spring" }}>
                    {card.bride}
                  </motion.h1>


                </motion.div>

                {/* Lotus divider 2 */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
                  <LotusDivider color={accent} className="w-full opacity-45" />
                </motion.div>

                {/* ══════════════════════════════════════════════
                    SECTION 3 — Family introduction
                ══════════════════════════════════════════════ */}
                <motion.div
                  className="px-10 pt-7 pb-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.68 }}
                >
                  {/* Invitee name */}
                  <p className="font-[family-name:var(--font-great-vibes)] text-4xl leading-snug mb-1"
                     style={{ color: accent }}>
                    {inviteeName}
                  </p>

                  {/* Thin rule */}
                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px" style={{ backgroundColor: `${accent}30` }} />
                    <span className="text-[10px] tracking-[0.3em] uppercase"
                          style={{ color: accent, opacity: 0.45 }}>cordially invited</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: `${accent}30` }} />
                  </div>

                  <p className="font-[family-name:var(--font-cormorant)] text-[13px] leading-relaxed mb-6"
                     style={{ color: accent, opacity: 0.60 }}>
                    You are cordially invited to celebrate<br />the joyous union of
                  </p>

                  {/* —— BRIDE BOX —— */}
                  <div className="relative rounded-xl px-5 py-5 mb-0"
                       style={{
                         border: `1px solid ${accent}30`,
                         background: `linear-gradient(145deg, ${accent}07 0%, ${accent}12 100%)`,
                         boxShadow: `inset 0 1px 3px ${accent}10`,
                       }}>
                    {/* Corner diamonds */}
                    <span className="absolute top-2 left-2 text-[8px] select-none" style={{ color: `${accent}40` }}>◆</span>
                    <span className="absolute top-2 right-2 text-[8px] select-none" style={{ color: `${accent}40` }}>◆</span>
                    <span className="absolute bottom-2 left-2 text-[8px] select-none" style={{ color: `${accent}40` }}>◆</span>
                    <span className="absolute bottom-2 right-2 text-[8px] select-none" style={{ color: `${accent}40` }}>◆</span>

                    <p className="text-[9px] tracking-[0.3em] uppercase mb-2"
                       style={{ color: accent, opacity: 0.40 }}>
                      Bride
                    </p>
                    <p className="font-[family-name:var(--font-great-vibes)] text-4xl leading-tight"
                       style={{ color: accent }}>
                      {card.bride}
                    </p>
                    <div className="w-10 h-px mx-auto my-2" style={{ backgroundColor: `${accent}35` }} />
                    <p className="font-[family-name:var(--font-cormorant)] text-[11px] italic"
                       style={{ color: accent, opacity: 0.50 }}>
                      Beloved daughter of
                    </p>
                    <p className="font-[family-name:var(--font-cormorant)] text-[13px] font-semibold leading-snug mt-1"
                       style={{ color: accent, opacity: 0.80 }}>
                      {card.brideFather ?? ""}
                      {card.brideFather && card.brideMother ? (<><br />&amp;<br /></>) : ""}
                      {card.brideMother ?? ""}
                    </p>
                  </div>

                  {/* —— & separator —— */}
                  <div className="flex items-center justify-center gap-2 my-3">
                    <div className="w-6 h-px" style={{ backgroundColor: `${accent}25` }} />
                    <p className="font-[family-name:var(--font-great-vibes)] text-3xl leading-none select-none"
                       style={{ color: accent, opacity: 0.50 }}>
                      &amp;
                    </p>
                    <div className="w-6 h-px" style={{ backgroundColor: `${accent}25` }} />
                  </div>

                  {/* —— GROOM BOX —— */}
                  <div className="relative rounded-xl px-5 py-5"
                       style={{
                         border: `1px solid ${accent}30`,
                         background: `linear-gradient(145deg, ${accent}07 0%, ${accent}12 100%)`,
                         boxShadow: `inset 0 1px 3px ${accent}10`,
                       }}>
                    {/* Corner diamonds */}
                    <span className="absolute top-2 left-2 text-[8px] select-none" style={{ color: `${accent}40` }}>◆</span>
                    <span className="absolute top-2 right-2 text-[8px] select-none" style={{ color: `${accent}40` }}>◆</span>
                    <span className="absolute bottom-2 left-2 text-[8px] select-none" style={{ color: `${accent}40` }}>◆</span>
                    <span className="absolute bottom-2 right-2 text-[8px] select-none" style={{ color: `${accent}40` }}>◆</span>

                    <p className="text-[9px] tracking-[0.3em] uppercase mb-2"
                       style={{ color: accent, opacity: 0.40 }}>
                      Groom
                    </p>
                    <p className="font-[family-name:var(--font-great-vibes)] text-4xl leading-tight"
                       style={{ color: accent }}>
                      {card.groom}
                    </p>
                    <div className="w-10 h-px mx-auto my-2" style={{ backgroundColor: `${accent}35` }} />
                    <p className="font-[family-name:var(--font-cormorant)] text-[11px] italic"
                       style={{ color: accent, opacity: 0.50 }}>
                      Beloved son of
                    </p>
                    <p className="font-[family-name:var(--font-cormorant)] text-[13px] font-semibold leading-snug mt-1"
                       style={{ color: accent, opacity: 0.80 }}>
                      {card.groomFather ?? ""}
                      {card.groomFather && card.groomMother ? (<><br />&amp;<br /></>) : ""}
                      {card.groomMother ?? ""}
                    </p>
                  </div>
                </motion.div>

                {/* Lotus divider 3 (between section 3 and date) */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.72 }}>
                  <LotusDivider color={accent} className="w-full opacity-40 mb-4" />
                </motion.div>

                {/* ══════════════════════════════════════════════
                    SECTION 4 — Date & Time
                ══════════════════════════════════════════════ */}
                <motion.div
                  className="px-8 py-5 text-center mb-2"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.74 }}
                >
                  {/* Day label */}
                  <p className="text-[9px] tracking-[0.35em] uppercase mb-3"
                     style={{ color: accent, opacity: 0.45 }}>
                    Date &amp; Time
                  </p>

                  {/* Full date — large */}
                  <p className="font-[family-name:var(--font-cormorant)] text-[11px] tracking-[0.25em] uppercase"
                     style={{ color: accent, opacity: 0.55 }}>
                    {new Date(card.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" }).toUpperCase()}
                  </p>
                  <p className="font-[family-name:var(--font-playfair)] text-2xl font-semibold leading-tight mt-0.5"
                     style={{ color: accent }}>
                    {new Date(card.date + "T00:00:00").toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }).toUpperCase()}
                  </p>

                  {/* Thin rule */}
                  <div className="w-12 h-px mx-auto my-3" style={{ backgroundColor: `${accent}35` }} />

                  {/* Time range */}
                  <p className="font-[family-name:var(--font-cormorant)] text-[13px] tracking-wide"
                     style={{ color: accent, opacity: 0.65 }}>
                    {card.time}{card.endTime ? ` — ${card.endTime}` : " onwards"}
                  </p>

                  {/* Poruwa */}
                  {card.poruwaTime && (
                    <>
                      <div className="flex items-center gap-2 my-3">
                        <div className="flex-1 h-px" style={{ backgroundColor: `${accent}20` }} />
                        <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: accent, opacity: 0.35 }}>🪷</span>
                        <div className="flex-1 h-px" style={{ backgroundColor: `${accent}20` }} />
                      </div>
                      <div className="inline-block mx-auto mt-1 px-5 py-3 rounded-xl"
                           style={{
                             background: `linear-gradient(135deg, ${accent}18, ${accent}28)`,
                             border: `1.5px solid ${accent}55`,
                             boxShadow: `0 2px 16px ${accent}25, inset 0 1px 2px ${accent}15`,
                           }}>
                        <p className="text-[9px] tracking-[0.35em] uppercase mb-1"
                           style={{ color: accent, opacity: 0.60 }}>
                          🪷 Poruwa Ceremony
                        </p>
                        <p className="font-[family-name:var(--font-playfair)] text-2xl font-semibold"
                           style={{ color: accent }}>
                          {card.poruwaTime}
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Lotus divider 3 */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.80 }}>
                  <LotusDivider color={accent} className="w-full opacity-40 mb-3" />
                </motion.div>

                {/* ══════════════════════════════════════════════
                    SECTION 5 — Countdown
                ══════════════════════════════════════════════ */}
                <motion.div
                  className="px-6 py-7 text-center relative"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.83 }}
                >
                  {!countdown.past ? (
                    <>
                      {/* Decorative top line */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${accent}35)` }} />
                        <span className="text-sm select-none" style={{ color: `${accent}60` }}>🌸</span>
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${accent}35)` }} />
                      </div>

                      {/* "Wait for the magic" label */}
                      <motion.p
                        className="font-[family-name:var(--font-great-vibes)] text-3xl leading-snug mb-1"
                        style={{ color: accent }}
                        animate={{ opacity: [0.70, 1, 0.70] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        Wait for the magic
                      </motion.p>

                      <p className="text-[9px] tracking-[0.35em] uppercase mb-5"
                         style={{ color: accent, opacity: 0.45 }}>
                        Counting Down To Forever
                      </p>

                      {/* Countdown boxes */}
                      <div className="flex justify-center gap-2.5">
                        {([
                          { label: "Days",    value: countdown.days    },
                          { label: "Hours",   value: countdown.hours   },
                          { label: "Mins",    value: countdown.minutes  },
                          { label: "Secs",    value: countdown.seconds  },
                        ] as { label: string; value: number }[]).map(({ label, value }, i) => (
                          <motion.div
                            key={label}
                            className="flex flex-col items-center justify-center rounded-2xl px-3 py-4 min-w-[58px] relative overflow-hidden"
                            style={{
                              border: `1.5px solid ${accent}40`,
                              background: `linear-gradient(160deg, ${accent}10 0%, ${accent}1a 100%)`,
                              boxShadow: `0 4px 18px ${accent}20, inset 0 1px 0 rgba(255,255,255,0.6)`,
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 + i * 0.07, type: "spring", stiffness: 220, damping: 18 }}
                          >
                            {/* Subtle shimmer */}
                            <div className="absolute inset-0 pointer-events-none"
                                 style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)` }} />

                            <motion.span
                              key={value}
                              className="font-[family-name:var(--font-playfair)] text-2xl font-bold leading-none z-10"
                              style={{ color: accent }}
                              initial={{ opacity: 0, scale: 0.7, y: -8 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ duration: 0.22, ease: "easeOut" }}
                            >
                              {String(value).padStart(2, "0")}
                            </motion.span>

                            <div className="w-6 h-px my-1.5 z-10" style={{ backgroundColor: `${accent}30` }} />

                            <span className="text-[8px] tracking-[0.25em] uppercase z-10"
                                  style={{ color: accent, opacity: 0.50 }}>
                              {label}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Decorative bottom line */}
                      <div className="flex items-center gap-3 mt-5">
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${accent}30)` }} />
                        <motion.span
                          className="text-[10px] font-[family-name:var(--font-cormorant)] italic tracking-wider"
                          style={{ color: accent, opacity: 0.50 }}
                          animate={{ opacity: [0.35, 0.65, 0.35] }}
                          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          ✦ every second counts ✦
                        </motion.span>
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${accent}30)` }} />
                      </div>
                    </>
                  ) : (
                    <motion.div
                      className="py-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <p className="text-[9px] tracking-[0.35em] uppercase mb-3"
                         style={{ color: accent, opacity: 0.45 }}>
                        The Celebration Has Begun
                      </p>
                      <p className="font-[family-name:var(--font-great-vibes)] text-3xl"
                         style={{ color: accent, opacity: 0.85 }}>
                        🪷 Today, forever begins 🪷
                      </p>
                    </motion.div>
                  )}
                </motion.div>

                {/* Lotus divider 4 — after countdown */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.86 }}>
                  <LotusDivider color={accent} className="w-full opacity-40 mb-3" />
                </motion.div>

                {/* ══════════════════════════════════════════════
                    SECTION 6 — Venue
                ══════════════════════════════════════════════ */}
                <motion.div
                  className="px-6 pb-6 text-center"
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.88 }}
                >
                  {/* Section label */}
                  <p className="text-[9px] tracking-[0.35em] uppercase mb-4"
                     style={{ color: accent, opacity: 0.45 }}>
                    Venue
                  </p>

                  {/* Pin icon */}
                  <div
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3"
                    style={{
                      background: `linear-gradient(135deg, ${accent}22, ${accent}38)`,
                      border: `1.5px solid ${accent}50`,
                      boxShadow: `0 2px 12px ${accent}30`,
                    }}
                  >
                    <span className="text-lg">📍</span>
                  </div>

                  {/* Hall name */}
                  <p
                    className="font-[family-name:var(--font-playfair)] text-base font-bold tracking-wide leading-tight mb-1"
                    style={{ color: accent }}
                  >
                    {card.venueName ?? card.venue}
                  </p>

                  {/* Thin rule */}
                  <div className="w-10 h-px mx-auto my-2.5" style={{ backgroundColor: `${accent}40` }} />

                  {/* Address lines */}
                  {card.venueAddress ? (
                    card.venueAddress.split("\n").map((line, i) => (
                      <p
                        key={i}
                        className="font-[family-name:var(--font-cormorant)] text-[13px] leading-relaxed"
                        style={{ color: accent, opacity: i === 0 ? 0.80 : 0.60 }}
                      >
                        {line}
                      </p>
                    ))
                  ) : (
                    <p className="font-[family-name:var(--font-cormorant)] text-[13px] leading-relaxed"
                       style={{ color: accent, opacity: 0.65 }}>
                      {card.venue}
                    </p>
                  )}

                  {/* Google Maps button */}
                  {card.mapLink && (
                    <motion.a
                      href={card.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-full text-[11px] font-semibold tracking-wide transition"
                      style={{
                        backgroundColor: accent,
                        color: PARCHMENT,
                        boxShadow: `0 3px 14px ${accent}40`,
                      }}
                      whileHover={{ scale: 1.05, boxShadow: `0 6px 22px ${accent}55` }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      Get Directions
                    </motion.a>
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

                {/* Lotus divider 3 */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.80 }}>
                  <LotusDivider color={accent} className="w-full opacity-40 mb-3" />
                </motion.div>

                {/* ══════════════════════════════════════════════
                    SECTION 7 — RSVP
                ══════════════════════════════════════════════ */}
                <motion.div
                  className="px-6 pb-8 text-center"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  {rsvpDone ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring" }}
                      className="py-6"
                    >
                      <motion.p
                        className="text-3xl mb-3"
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.2, repeat: 2 }}
                      >🪷</motion.p>
                      <p className="font-[family-name:var(--font-great-vibes)] text-3xl mb-1"
                         style={{ color: accent }}>
                        Thank you, {inviteeName}!
                      </p>
                      <p className="font-[family-name:var(--font-cormorant)] text-[13px] mt-1"
                         style={{ color: accent, opacity: 0.55 }}>
                        Your response has been noted.<br />We can&apos;t wait to see you!
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      {/* Decorative line */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${accent}35)` }} />
                        <span className="text-sm select-none" style={{ color: `${accent}55` }}>💌</span>
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${accent}35)` }} />
                      </div>

                      {/* Heading */}
                      <p className="text-[9px] tracking-[0.35em] uppercase mb-1"
                         style={{ color: accent, opacity: 0.45 }}>
                        RSVP
                      </p>
                      <p className="font-[family-name:var(--font-great-vibes)] text-4xl leading-snug mb-3"
                         style={{ color: accent }}>
                        Will You Join Us?
                      </p>

                      {/* Description */}
                      <p className="font-[family-name:var(--font-cormorant)] text-[13px] leading-relaxed mb-1"
                         style={{ color: accent, opacity: 0.60 }}>
                        We would be absolutely thrilled to celebrate with you.
                      </p>
                      <p className="font-[family-name:var(--font-cormorant)] text-[12px] italic mb-6"
                         style={{ color: accent, opacity: 0.45 }}>
                        Kindly respond by 22.11.2026
                      </p>

                      {!showRsvp ? (
                        <motion.button
                          onClick={() => setShowRsvp(true)}
                          className="px-10 py-3 rounded-full font-semibold text-sm tracking-widest uppercase shadow-lg transition"
                          style={{
                            backgroundColor: accent,
                            color: PARCHMENT,
                            boxShadow: `0 4px 20px ${accent}45`,
                            letterSpacing: "0.18em",
                          }}
                          whileHover={{ scale: 1.06, boxShadow: `0 8px 28px ${accent}55` }}
                          whileTap={{ scale: 0.95 }}
                        >
                          RSVP Now
                        </motion.button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className="space-y-3"
                        >
                          {/* Accept / Decline buttons */}
                          <div className="flex gap-2">
                            {([true, false] as const).map((val) => (
                              <motion.button
                                key={String(val)}
                                type="button"
                                onClick={() => setAttending(val)}
                                className="flex-1 py-3 rounded-xl text-xs font-semibold tracking-wide transition"
                                style={{
                                  border: `1.5px solid ${attending === val ? accent : `${accent}30`}`,
                                  backgroundColor: attending === val ? accent : `${accent}08`,
                                  color: attending === val ? PARCHMENT : accent,
                                }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                {val ? "🪷 Joyfully Accept" : "😔 Regretfully Decline"}
                              </motion.button>
                            ))}
                          </div>

                          {attending !== null && (
                            <motion.button
                              onClick={handleRsvp}
                              disabled={sending}
                              className="w-full py-3 rounded-full font-semibold text-sm tracking-widest uppercase shadow-md transition disabled:opacity-55"
                              style={{
                                backgroundColor: accent,
                                color: PARCHMENT,
                                boxShadow: `0 4px 18px ${accent}40`,
                                letterSpacing: "0.15em",
                              }}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ type: "spring" }}
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.96 }}
                            >
                              {sending ? "Sending… 💌" : "Send RSVP 💌"}
                            </motion.button>
                          )}
                        </motion.div>
                      )}
                    </>
                  )}
                </motion.div>
              </div>

              {/* ══════════════════════════════════════════════
                  SECTION 8 — With Love sign-off
              ══════════════════════════════════════════════ */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
              >
                <LotusDivider color={accent} className="w-full opacity-40" />
              </motion.div>

              <motion.div
                className="px-6 py-8 text-center relative"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15 }}
              >
                {/* Floating petals */}
                {["-18%", "18%", "-10%", "10%"].map((x, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-xs select-none pointer-events-none"
                    style={{ left: "50%", top: i < 2 ? "8%" : "85%", translateX: x }}
                    animate={{ y: [0, -6, 0], opacity: [0.4, 0.75, 0.4] }}
                    transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  >
                    🪷
                  </motion.span>
                ))}

                {/* "With Love" */}
                <p
                  className="text-[9px] tracking-[0.4em] uppercase mb-2"
                  style={{ color: accent, opacity: 0.45 }}
                >
                  With Love
                </p>

                {/* Thin ornamental rule */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${accent}40)` }} />
                  <span className="text-[10px] select-none" style={{ color: `${accent}50` }}>✶</span>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${accent}40)` }} />
                </div>

                {/* Bride & Groom — one line */}
                <motion.div
                  className="flex items-baseline justify-center gap-3"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.25, type: "spring", stiffness: 180, damping: 18 }}
                >
                  <span className="font-[family-name:var(--font-great-vibes)] text-4xl leading-tight"
                        style={{ color: accent }}>
                    {card.bride}
                  </span>
                  <span className="font-[family-name:var(--font-playfair)] text-xl select-none"
                        style={{ color: accent, opacity: 0.45 }}>
                    &amp;
                  </span>
                  <span className="font-[family-name:var(--font-great-vibes)] text-4xl leading-tight"
                        style={{ color: accent }}>
                    {card.groom}
                  </span>
                </motion.div>

                {/* Bottom ornamental rule */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${accent}30)` }} />
                  <motion.span
                    className="text-[11px] font-[family-name:var(--font-cormorant)] italic tracking-wider"
                    style={{ color: accent, opacity: 0.45 }}
                    animate={{ opacity: [0.30, 0.60, 0.30] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ✦ forever &amp; always ✦
                  </motion.span>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${accent}30)` }} />
                </div>
              </motion.div>

              {/* ── PERAHERA STRIP at bottom ── */}
              <motion.div
                className="w-full mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/perahara.svg"
                  alt="Kandyan perahera procession"
                  className="w-3/4 mx-auto object-contain block"
                />
              </motion.div>

              {/* Bottom corner foliage */}
              <div className="relative h-16 overflow-hidden">
                <CornerFoliage color={accent}
                  className="absolute bottom-0 w-32 h-40 opacity-55"
                  style={{ left: "-10%", transform: "scaleY(-1)" } as React.CSSProperties} />
                <CornerFoliage color={accent}
                  className="absolute bottom-0 w-32 h-40 opacity-55"
                  style={{ right: "-10%", transform: "scale(-1,-1)" } as React.CSSProperties} />
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
