"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SESSION_KEY = "wedvite_admin_auth";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin1234";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed]     = useState(false);
  const [checked, setChecked]   = useState(false); // avoid flash before sessionStorage read
  const [input, setInput]       = useState("");
  const [error, setError]       = useState(false);
  const [shake, setShake]       = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setAuthed(true);
    }
    setChecked(true);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 500);
    }
  }

  // Don't render anything until we've checked sessionStorage (prevents flash)
  if (!checked) return null;

  if (authed) return <>{children}</>;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(160deg, #e8dfc8 0%, #f5efe0 50%, #ede4d0 100%)" }}
    >
      {/* Soft vignette */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{ boxShadow: "inset 0 0 120px rgba(100,70,20,0.12)" }}
      />

      <AnimatePresence>
        <motion.div
          key="gate"
          className="w-full max-w-sm relative"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={shake
            ? { x: [-10, 10, -8, 8, -4, 4, 0], opacity: 1, scale: 1 }
            : { opacity: 1, y: 0, scale: 1, x: 0 }
          }
          transition={{ duration: shake ? 0.45 : 0.45, ease: "easeOut" }}
        >
          <div
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "#f5efe0",
              border: "1.5px solid rgba(184,134,11,0.25)",
              boxShadow: "0 12px 50px rgba(100,70,20,0.18), 0 2px 8px rgba(100,70,20,0.10)",
            }}
          >
            {/* Header decoration strip */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Header-decoration.svg"
              alt=""
              className="w-2/3 mx-auto block mt-6 opacity-50"
            />

            <div className="px-8 pb-8 pt-4 text-center">
              {/* Lock icon */}
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                style={{
                  background: "linear-gradient(135deg, rgba(184,134,11,0.15), rgba(184,134,11,0.25))",
                  border: "1.5px solid rgba(184,134,11,0.45)",
                  boxShadow: "0 2px 14px rgba(184,134,11,0.20)",
                }}
              >
                <span className="text-2xl">🔐</span>
              </div>

              <p
                className="text-xs tracking-[0.3em] uppercase mb-1 font-semibold"
                style={{ color: "#7a5c0a", opacity: 0.85 }}
              >
                Admin Access
              </p>
              <p
                className="font-[family-name:var(--font-great-vibes)] text-4xl font-bold mb-1"
                style={{ color: "#7a5c0a" }}
              >
                Wedvite
              </p>
              <p
                className="font-[family-name:var(--font-cormorant)] text-sm mb-6"
                style={{ color: "#7a5c0a", opacity: 0.7 }}
              >
                Enter your password to continue
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="password"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError(false); }}
                  placeholder="Password"
                  autoFocus
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    border: error
                      ? "1.5px solid rgba(200,50,50,0.6)"
                      : "1.5px solid rgba(184,134,11,0.30)",
                    color: "#3a2a05",
                    boxShadow: error
                      ? "0 0 0 3px rgba(200,50,50,0.10)"
                      : "0 0 0 0px transparent",
                  }}
                />

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 text-left pl-1"
                  >
                    Incorrect password. Try again.
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  className="w-full py-3 rounded-full font-semibold text-sm tracking-widest uppercase shadow-md transition"
                  style={{
                    backgroundColor: "#b8860b",
                    color: "#f5efe0",
                    boxShadow: "0 4px 18px rgba(184,134,11,0.35)",
                    letterSpacing: "0.15em",
                  }}
                  whileHover={{ scale: 1.03, boxShadow: "0 6px 24px rgba(184,134,11,0.50)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Enter
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
