import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-700">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 py-24 sm:py-32 text-center">
          <p className="text-sm tracking-widest uppercase text-[#b8860b] mb-4">
            🪷 Beautiful Wedding Invitations
          </p>
          <h1 className="font-[family-name:var(--font-great-vibes)] text-6xl sm:text-8xl text-[#b8860b] mb-6">
            Wedvite
          </h1>
          <p className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl text-gray-500 max-w-2xl mx-auto mb-4">
            Create stunning, interactive wedding invitation cards in traditional Sri Lankan Kandyan style.
          </p>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto">
            Customize your card, share via WhatsApp & email, and track RSVPs — all for free.
          </p>
          <Link
            href="/create"
            className="inline-block bg-[#b8860b] text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#a07608] transition shadow-lg hover:shadow-xl"
          >
            Create Your Invitation →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { icon: "✉️", title: "Interactive Cards", desc: "Beautiful envelope animation — tap to open and reveal your Kandyan-style invitation." },
            { icon: "🎨", title: "Fully Customizable", desc: "Choose colors, fonts, patterns. Personalize for each guest." },
            { icon: "📱", title: "Share & Track", desc: "Send via WhatsApp, Email, or link. Track RSVPs in Google Sheets." },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <p className="text-4xl mb-4">{f.icon}</p>
              <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold mb-2 text-gray-800">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-center mb-12 text-gray-800">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Design", desc: "Customize your Kandyan-style invitation card" },
              { step: "2", title: "Personalize", desc: "Add each guest's name" },
              { step: "3", title: "Share", desc: "Send via WhatsApp, email, or link" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-[#b8860b] text-white flex items-center justify-center mx-auto mb-3 font-bold">{s.step}</div>
                <h4 className="font-semibold mb-1 text-gray-800">{s.title}</h4>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="font-[family-name:var(--font-great-vibes)] text-5xl text-[#b8860b] mb-4">
          Your love story deserves a beautiful invitation
        </h2>
        <p className="text-gray-400 mb-8">Free forever. No account needed.</p>
        <Link
          href="/create"
          className="inline-block bg-[#b8860b] text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#a07608] transition"
        >
          Get Started Free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Wedvite. Made with 🪷</p>
      </footer>
    </div>
  );
}
