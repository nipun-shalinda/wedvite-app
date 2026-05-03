"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-700">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Image
          src="/image/couple-photo.svg"
          alt="Wedvite"
          width={140}
          height={36}
          priority
        />
        <Link
          href="/create"
          className="text-sm font-semibold text-[#b8860b] hover:underline"
        >
          Create Invitation →
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center">
          <motion.p
            className="text-sm tracking-widest uppercase text-[#b8860b] mb-4"
            {...fadeUp(0)}
          >
            🪷 Beautiful Wedding Invitations
          </motion.p>
          <motion.h1
            className="font-[family-name:var(--font-great-vibes)] text-6xl sm:text-8xl text-[#b8860b] mb-6"
            {...fadeUp(0.1)}
          >
            Wedvite
          </motion.h1>
          <motion.p
            className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl text-gray-500 max-w-2xl mx-auto mb-4"
            {...fadeUp(0.2)}
          >
            Design breathtaking digital wedding invitations that leave a lasting
            impression.
          </motion.p>
          <motion.p
            className="text-gray-400 mb-10 max-w-lg mx-auto"
            {...fadeUp(0.3)}
          >
            Customize your card, share via WhatsApp & email, and track RSVPs —
            all for free.
          </motion.p>
          <motion.div {...fadeUp(0.4)}>
            <Link
              href="/create"
              className="inline-block bg-[#b8860b] text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#a07608] transition shadow-lg hover:shadow-xl"
            >
              Create Your Invitation →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              icon: "✉️",
              title: "Interactive Cards",
              desc: "Beautiful envelope animation — tap to open and reveal your Kandyan-style invitation.",
              delay: 0,
            },
            {
              icon: "🎨",
              title: "Fully Customizable",
              desc: "Choose colors, fonts, patterns. Personalize for each guest.",
              delay: 0.1,
            },
            {
              icon: "📱",
              title: "Share & Track",
              desc: "Send via WhatsApp, Email, or link. Track RSVPs in Google Sheets.",
              delay: 0.2,
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: f.delay }}
            >
              <p className="text-4xl mb-4">{f.icon}</p>
              <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold mb-2 text-gray-800">
                {f.title}
              </h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            className="font-[family-name:var(--font-playfair)] text-3xl text-center mb-12 text-gray-800"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Design",
                desc: "Customize your Kandyan-style invitation card",
                delay: 0,
              },
              {
                step: "2",
                title: "Personalize",
                desc: "Add each guest's name",
                delay: 0.1,
              },
              {
                step: "3",
                title: "Share",
                desc: "Send via WhatsApp, email, or link",
                delay: 0.2,
              },
            ].map((s) => (
              <motion.div
                key={s.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: s.delay }}
              >
                <div className="w-10 h-10 rounded-full bg-[#b8860b] text-white flex items-center justify-center mx-auto mb-3 font-bold">
                  {s.step}
                </div>
                <h4 className="font-semibold mb-1 text-gray-800">{s.title}</h4>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <motion.h2
          className="font-[family-name:var(--font-great-vibes)] text-5xl text-[#b8860b] mb-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Your love story deserves a beautiful invitation
        </motion.h2>
        <motion.p
          className="text-gray-400 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Free forever. No account needed.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link
            href="/create"
            className="inline-block bg-[#b8860b] text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#a07608] transition"
          >
            Get Started Free →
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-gray-400 text-sm">
        <Image
          src="/logo.svg"
          alt="Wedvite"
          width={100}
          height={26}
          className="mx-auto mb-3 opacity-50"
        />
        <p>© {new Date().getFullYear()} Wedvite. Made with 🪷</p>
      </footer>
    </div>
  );
}
