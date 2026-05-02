"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { decodeCardData } from "@/lib/card-data";
import { updateRsvp } from "@/lib/google-sheet";
import { motion, AnimatePresence } from "framer-motion";

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1a0a00] flex items-center justify-center">
          <p className="text-[#d4a017]/40">Loading...</p>
        </div>
      }
    >
      <InviteContent />
    </Suspense>
  );
}

function InviteContent() {
  const searchParams = useSearchParams();
  const card = decodeCardData(searchParams.get("data") || "");
  const inviteeName = searchParams.get("to") || "Guest";
  const [isOpen, setIsOpen] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [sending, setSending] = useState(false);

  if (!card) {
    return (
      <div className="min-h-screen bg-[#1a0a00] flex items-center justify-center">
        <p className="text-[#d4a017]/60">Invalid invitation link.</p>
      </div>
    );
  }

  const dateStr = new Date(card.date + "T00:00:00").toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  async function handleRsvp() {
    if (attending === null) return;
    setSending(true);
    await updateRsvp(inviteeName, attending ? "Yes" : "No");
    setSending(false);
    setRsvpDone(true);
  }

  const petals = ["🪷", "🌸", "✨", "💛", "🪷", "🌸", "✨", "💛", "🪷", "🌸"];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: card.primaryColor }}
    >
      {/* Floating background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {petals.map((p, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl select-none opacity-8"
            style={{ left: `${(i * 11) % 90}%`, top: `${(i * 13) % 85}%` }}
            animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            {p}
          </motion.span>
        ))}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${card.accentColor}12, transparent 70%)`,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* ── Kandyan Envelope ── */
          <motion.div
            key="envelope"
            className="relative cursor-pointer w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backgroundColor: card.primaryColor,
              border: `2px solid ${card.accentColor}30`,
            }}
            onClick={() => setIsOpen(true)}
            whileHover={{
              scale: 1.03,
              boxShadow: `0 20px 60px ${card.accentColor}25`,
            }}
            whileTap={{ scale: 0.97 }}
            exit={{ rotateY: -90, opacity: 0, transition: { duration: 0.4 } }}
          >
            {/* Couple photo background */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/couple-photo.svg"
                alt=""
                className="w-full h-full object-cover opacity-10"
              />
            </div>

            {/* Ornamental corner borders */}
            <div
              className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 rounded-tl-lg opacity-25"
              style={{ borderColor: card.accentColor }}
            />
            <div
              className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 rounded-tr-lg opacity-25"
              style={{ borderColor: card.accentColor }}
            />
            <div
              className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 rounded-bl-lg opacity-25"
              style={{ borderColor: card.accentColor }}
            />
            <div
              className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 rounded-br-lg opacity-25"
              style={{ borderColor: card.accentColor }}
            />

            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 opacity-10"
              style={{
                background: `linear-gradient(135deg, transparent 30%, ${card.accentColor}40 50%, transparent 70%)`,
                backgroundSize: "200% 200%",
              }}
              animate={{ backgroundPosition: ["0% 0%", "200% 200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating lotus petals */}
            <div className="absolute inset-0 pointer-events-none">
              {["🪷", "🌸", "✨"].map((h, i) => (
                <motion.span
                  key={i}
                  className="absolute text-lg opacity-10 select-none"
                  style={{ left: `${20 + i * 25}%`, top: `${15 + i * 20}%` }}
                  animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                >
                  {h}
                </motion.span>
              ))}
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              <motion.p
                className="text-sm opacity-40 mb-2"
                style={{ color: card.accentColor }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Dear
              </motion.p>
              <motion.p
                className="font-[family-name:var(--font-great-vibes)] text-3xl mb-6 text-center"
                style={{ color: card.accentColor }}
              >
                {inviteeName}
              </motion.p>

              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-10 h-px opacity-25"
                  style={{ backgroundColor: card.accentColor }}
                />
                <span className="text-lg select-none">🪷</span>
                <div
                  className="w-10 h-px opacity-25"
                  style={{ backgroundColor: card.accentColor }}
                />
              </div>

              <motion.p
                className="font-[family-name:var(--font-great-vibes)] text-4xl mb-1 text-center"
                style={{ color: card.accentColor }}
              >
                {card.groom}
              </motion.p>
              <p
                className="text-xl opacity-30 my-1 select-none"
                style={{ color: card.accentColor }}
              >
                ♥
              </p>
              <motion.p
                className="font-[family-name:var(--font-great-vibes)] text-4xl mb-6 text-center"
                style={{ color: card.accentColor }}
              >
                {card.bride}
              </motion.p>

              <p
                className="text-sm opacity-30 mb-8"
                style={{ color: card.accentColor }}
              >
                You&apos;re Invited
              </p>

              <motion.div
                className="flex items-center gap-2"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span
                  className="text-xs opacity-40"
                  style={{ color: card.accentColor }}
                >
                  ✉ Tap to Open
                </span>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* ── Open Kandyan Card with animated couple background ── */
          <motion.div
            key="card"
            className="w-full max-w-lg relative z-10"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Confetti — lotus petals + gold sparkles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
              {Array.from({ length: 35 }).map((_, i) => {
                const emojis = ["🪷", "🌸", "✨", "💛", "🌺", "⭐", "🌷"];
                return (
                  <motion.span
                    key={i}
                    className="absolute text-lg select-none"
                    style={{ left: `${Math.random() * 100}%`, top: "-5%" }}
                    animate={{
                      y: ["0vh", `${80 + Math.random() * 20}vh`],
                      x: [0, (Math.random() - 0.5) * 150],
                      rotate: [0, Math.random() * 360],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 2.5 + Math.random(),
                      delay: Math.random() * 0.8,
                      ease: "easeOut",
                    }}
                  >
                    {emojis[i % emojis.length]}
                  </motion.span>
                );
              })}
            </div>

            <div
              className="rounded-2xl shadow-2xl overflow-hidden relative"
              style={{
                backgroundColor: card.primaryColor,
                border: `2px solid ${card.accentColor}20`,
              }}
            >
              {/* Ornamental corners */}
              <div
                className="absolute top-4 left-4 w-14 h-14 border-t-2 border-l-2 rounded-tl-lg opacity-20 z-20"
                style={{ borderColor: card.accentColor }}
              />
              <div
                className="absolute top-4 right-4 w-14 h-14 border-t-2 border-r-2 rounded-tr-lg opacity-20 z-20"
                style={{ borderColor: card.accentColor }}
              />
              <div
                className="absolute bottom-4 left-4 w-14 h-14 border-b-2 border-l-2 rounded-bl-lg opacity-20 z-20"
                style={{ borderColor: card.accentColor }}
              />
              <div
                className="absolute bottom-4 right-4 w-14 h-14 border-b-2 border-r-2 rounded-br-lg opacity-20 z-20"
                style={{ borderColor: card.accentColor }}
              />

              {/* Content overlay with slight backdrop */}
              <div className="p-8 sm:p-12 text-center relative z-10">
                <div className="relative z-10">
                  <motion.p
                    className="text-2xl mb-2 select-none"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    🪷
                  </motion.p>

                  <motion.div
                    className="mb-6 space-y-1"
                    style={{ color: card.accentColor }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.6, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-xs tracking-widest uppercase">
                      Mr. &amp; Mrs. Herath
                    </p>
                    <p className="text-[10px] tracking-wider uppercase opacity-60">
                      together with
                    </p>
                    <p className="text-xs tracking-widest uppercase">
                      Mr. &amp; Mrs. Rathnayake
                    </p>
                    <p className="text-[10px] tracking-wider uppercase opacity-60 mt-2">
                      request the pleasure of the presence of
                    </p>
                    <p className="font-[family-name:var(--font-great-vibes)] text-2xl mt-1">
                      {inviteeName}
                    </p>
                  </motion.div>

                  <motion.p
                    className="text-[10px] tracking-wider uppercase mb-4"
                    style={{ color: card.accentColor }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 0.35 }}
                  >
                    at the wedding ceremony of
                  </motion.p>

                  <motion.h1
                    className="font-[family-name:var(--font-great-vibes)] text-5xl sm:text-6xl mb-2"
                    style={{ color: card.accentColor }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    {card.groom}
                  </motion.h1>
                  <motion.p
                    className="text-2xl my-2 opacity-30 select-none"
                    style={{ color: card.accentColor }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 0.5 }}
                  >
                    ♥
                  </motion.p>
                  <motion.h1
                    className="font-[family-name:var(--font-great-vibes)] text-5xl sm:text-6xl mb-6"
                    style={{ color: card.accentColor }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    {card.bride}
                  </motion.h1>

                  <motion.p
                    className="text-sm tracking-widest uppercase opacity-25 mb-6"
                    style={{ color: card.accentColor }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.25 }}
                    transition={{ delay: 0.7 }}
                  >
                    Request the pleasure of your company
                  </motion.p>

                  {/* Divider */}
                  <motion.div
                    className="flex items-center justify-center gap-2 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div
                      className="w-12 h-px opacity-20"
                      style={{ backgroundColor: card.accentColor }}
                    />
                    <motion.span
                      className="text-sm select-none"
                      style={{ color: card.accentColor }}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🪷
                    </motion.span>
                    <div
                      className="w-12 h-px opacity-20"
                      style={{ backgroundColor: card.accentColor }}
                    />
                  </motion.div>

                  {/* Poruwa Ceremony — highlighted */}
                  <motion.div
                    className="mb-6 mx-auto max-w-xs px-6 py-4 rounded-xl border"
                    style={{
                      borderColor: `${card.accentColor}30`,
                      backgroundColor: `${card.accentColor}08`,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85 }}
                  >
                    <p
                      className="text-xs tracking-widest uppercase opacity-50 mb-1"
                      style={{ color: card.accentColor }}
                    >
                      🪷 Poruwa Ceremony
                    </p>
                    <p
                      className="font-[family-name:var(--font-playfair)] text-2xl font-semibold"
                      style={{ color: card.accentColor }}
                    >
                      {card.poruwaTime}
                    </p>
                  </motion.div>

                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <p
                      className="font-[family-name:var(--font-playfair)] text-xl mb-1"
                      style={{ color: card.accentColor }}
                    >
                      {dateStr}
                    </p>
                    <p
                      className="text-lg opacity-50"
                      style={{ color: card.accentColor }}
                    >
                      {card.time} onwards
                    </p>
                  </motion.div>

                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <p
                      className="font-[family-name:var(--font-playfair)] text-lg"
                      style={{ color: card.accentColor }}
                    >
                      📍 {card.venue}
                    </p>
                    {card.mapLink && (
                      <a
                        href={card.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm underline opacity-40 hover:opacity-80 transition"
                        style={{ color: card.accentColor }}
                      >
                        Get Directions →
                      </a>
                    )}
                  </motion.div>

                  <motion.p
                    className="text-base italic opacity-40 mb-8 max-w-sm mx-auto leading-relaxed"
                    style={{ color: card.accentColor }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 1.1 }}
                  >
                    &ldquo;{card.message}&rdquo;
                  </motion.p>

                  {/* Bottom ornament */}
                  <div className="flex items-center justify-center gap-1 mb-6 opacity-15 select-none">
                    <span style={{ color: card.accentColor }}>✦</span>
                    <span
                      className="text-xs"
                      style={{ color: card.accentColor }}
                    >
                      forever & always
                    </span>
                    <span style={{ color: card.accentColor }}>✦</span>
                  </div>

                  {/* RSVP */}
                  {rsvpDone ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-4"
                    >
                      <p className="text-3xl mb-2">🪷</p>
                      <p
                        className="font-semibold"
                        style={{ color: card.accentColor }}
                      >
                        Thank you, {inviteeName}!
                      </p>
                      <p
                        className="text-sm opacity-35 mt-1"
                        style={{ color: card.accentColor }}
                      >
                        Your response has been noted.
                      </p>
                    </motion.div>
                  ) : !showRsvp ? (
                    <motion.div
                      className="flex flex-col items-center gap-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      <motion.button
                        onClick={() => setShowRsvp(true)}
                        className="px-8 py-3 rounded-full font-semibold text-sm tracking-wide transition shadow-lg"
                        style={{
                          backgroundColor: card.accentColor,
                          color: card.primaryColor,
                        }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: `0 8px 30px ${card.accentColor}35`,
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        💌 RSVP Now
                      </motion.button>
                      <p
                        className="text-xs opacity-35 italic"
                        style={{ color: card.accentColor }}
                      >
                        Kindly respond by {new Date(card.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 text-left"
                    >
                      <div className="flex gap-3">
                        {[true, false].map((val) => (
                          <button
                            key={String(val)}
                            type="button"
                            onClick={() => setAttending(val)}
                            className="flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition"
                            style={{
                              borderColor:
                                attending === val
                                  ? card.accentColor
                                  : `${card.accentColor}25`,
                              backgroundColor:
                                attending === val
                                  ? card.accentColor
                                  : "transparent",
                              color:
                                attending === val
                                  ? card.primaryColor
                                  : card.accentColor,
                            }}
                          >
                            {val
                              ? "🪷 Joyfully Accept"
                              : "😔 Regretfully Decline"}
                          </button>
                        ))}
                      </div>
                      {attending !== null && (
                        <button
                          onClick={handleRsvp}
                          disabled={sending}
                          className="w-full py-3 rounded-full font-semibold text-sm transition shadow-lg disabled:opacity-60"
                          style={{
                            backgroundColor: card.accentColor,
                            color: card.primaryColor,
                          }}
                        >
                          {sending ? "Sending… 💌" : "Send RSVP 💌"}
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
