import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { ArrowRight, Globe, Brain, ShieldCheck, MapPin } from "@phosphor-icons/react";

const COUNTRY_PREVIEW = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
];

const LANG_PREVIEW = ["English", "Română", "Español", "Français", "Deutsch", "中文", "العربية", "हिन्दी", "Português", "Русский", "日本語", "한국어"];

export default function Landing() {
  return (
    <div className="bg-stone-50 min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-stone-200">
        <div className="absolute inset-0 grain"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative z-10">
            <div className="rise rise-1 inline-flex items-center gap-2 bg-stone-900 text-white px-4 py-2 text-xs font-bold tracking-[0.2em] uppercase mb-8" data-testid="hero-pill">
              <Globe weight="bold" size={14} /> 5 Countries · 12 Languages
            </div>
            <h1 className="rise rise-2 font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-stone-900 mb-8">
              Pass your driving test.<br/>
              <span className="text-blue-600">Anywhere in the world.</span>
            </h1>
            <p className="rise rise-3 text-lg md:text-xl text-stone-600 max-w-xl leading-relaxed mb-10">
              AI-generated theory questions modelled on the real exams of the US, UK, Canada, Germany & Romania — instantly translated into your language. Study in the language you think in. Pass in the country you'll drive in.
            </p>
            <div className="rise rise-4 flex flex-col sm:flex-row gap-4">
              <Link to="/register" data-testid="hero-cta-primary" className="group inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 font-bold tracking-wide transition-colors">
                Start practising free
                <ArrowRight weight="bold" size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" data-testid="hero-cta-secondary" className="inline-flex items-center justify-center gap-3 border border-stone-300 hover:border-stone-900 text-stone-900 px-8 py-5 font-bold tracking-wide transition-colors">
                I already have an account
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-md">
              <div>
                <div className="font-display text-4xl font-black text-stone-900">5</div>
                <div className="text-xs uppercase tracking-[0.2em] text-stone-500 mt-1">Countries</div>
              </div>
              <div>
                <div className="font-display text-4xl font-black text-stone-900">12</div>
                <div className="text-xs uppercase tracking-[0.2em] text-stone-500 mt-1">Languages</div>
              </div>
              <div>
                <div className="font-display text-4xl font-black text-stone-900">∞</div>
                <div className="text-xs uppercase tracking-[0.2em] text-stone-500 mt-1">AI Questions</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] bg-stone-200 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1527593167147-e9c94a5883e6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwzfHxkcml2aW5nJTIwdGVzdCUyMGRyaXZpbmclMjBjYXIlMjBsZWFybmVyfGVufDB8fHx8MTc4MTAyOTI5MHww&ixlib=rb-4.1.0&q=85"
                alt="Confident driver"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white p-6 border-t-2 border-stone-900">
                <div className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2">Now translating</div>
                <div className="font-display font-bold text-2xl text-stone-900">English ↔ Română</div>
                <div className="h-1 mt-3 w-full bg-stone-200">
                  <div className="h-1 bg-blue-600 w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countries strip */}
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
          <div className="text-xs uppercase tracking-[0.3em] font-bold text-stone-500 mb-8">Choose your country</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-0 border-l border-t border-stone-200">
            {COUNTRY_PREVIEW.map((c) => (
              <div key={c.code} className="border-r border-b border-stone-200 p-8 hover:bg-stone-50 transition-colors group" data-testid={`country-preview-${c.code}`}>
                <div className="text-5xl mb-4">{c.flag}</div>
                <div className="font-display font-bold text-lg text-stone-900">{c.name}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-stone-500 mt-2 group-hover:text-blue-600 transition-colors">Theory Test →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <div className="text-xs uppercase tracking-[0.3em] font-bold text-blue-600 mb-6">Why DriveWise</div>
            <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-stone-900 leading-tight">
              The only theory test that speaks your language.
            </h2>
          </div>
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-0 border-l border-t border-stone-200">
            <Feature icon={<Brain weight="duotone" size={28} />} title="AI-Generated" body="Every test is freshly generated by Claude — never the same questions twice. Mirrors the real exam style." />
            <Feature icon={<Globe weight="duotone" size={28} />} title="12 Languages" body="Read each question in English and your native language, side by side, with one tap." />
            <Feature icon={<MapPin weight="duotone" size={28} />} title="Country-Specific" body="Real speed limits, real laws, real road signs. Tailored to where you'll actually take the test." />
            <Feature icon={<ShieldCheck weight="duotone" size={28} />} title="Track Progress" body="Your scores, passes, and weak topics — saved automatically so you focus where it counts." />
          </div>
        </div>
      </section>

      {/* Language strip */}
      <section className="bg-stone-900 text-stone-100 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-xs uppercase tracking-[0.3em] font-bold text-stone-400 mb-8">Available languages</div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {LANG_PREVIEW.map((l) => (
              <div key={l} className="font-display font-bold text-3xl md:text-4xl text-stone-100 hover:text-blue-400 transition-colors cursor-default">
                {l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-24 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-stone-900 mb-6">Ready when you are.</h2>
          <p className="text-lg text-stone-600 mb-10 max-w-xl mx-auto">Create a free account, pick your country and language, and take your first AI-powered mock exam in under a minute.</p>
          <Link to="/register" data-testid="cta-bottom" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 font-bold tracking-wide transition-colors">
            Create free account <ArrowRight weight="bold" size={20} />
          </Link>
        </div>
      </section>

      <footer className="bg-stone-950 text-stone-500 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="font-display font-black text-white">DriveWise</div>
          <div>© {new Date().getFullYear()} DriveWise · Practice for the real road.</div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, body }) {
  return (
    <div className="border-r border-b border-stone-200 p-8">
      <div className="text-blue-600 mb-4">{icon}</div>
      <div className="font-display font-bold text-xl text-stone-900 mb-2">{title}</div>
      <p className="text-stone-600 leading-relaxed text-sm">{body}</p>
    </div>
  );
}
