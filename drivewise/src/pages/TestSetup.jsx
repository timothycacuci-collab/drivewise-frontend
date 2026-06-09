import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import Header from "@/components/Header";
import { ArrowRight, Translate, CheckCircle } from "@phosphor-icons/react";

const COUNT_OPTIONS = [10, 15, 20];

export default function TestSetup() {
  const nav = useNavigate();
  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [country, setCountry] = useState(null);
  const [language, setLanguage] = useState("en");
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/countries"), api.get("/languages")]).then(([c, l]) => {
      setCountries(c.data);
      setLanguages(l.data);
    });
  }, []);

  const start = async () => {
    if (!country) { toast.error("Pick a country first"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/tests/generate", {
        country_code: country.code,
        language_code: language,
        num_questions: numQuestions,
      });
      nav(`/test/run/${data.session_id}`, { state: data });
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to generate test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
        <div className="text-xs uppercase tracking-[0.3em] font-bold text-stone-500 mb-4">Configure your test</div>
        <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight text-stone-900 mb-12">Where will you drive?</h1>

        {/* Country selector */}
        <div className="mb-16">
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 mb-4">1 · Country</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-stone-200">
            {countries.map((c) => {
              const selected = country?.code === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCountry(c)}
                  data-testid={`country-card-${c.code}`}
                  className={`text-left border-r border-b border-stone-200 p-6 transition-all relative ${selected ? "bg-blue-50 border-blue-600 border-2 -m-px z-10" : "bg-white hover:bg-stone-50"}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-5xl">{c.flag}</div>
                    {selected && <CheckCircle weight="fill" size={24} className="text-blue-600" />}
                  </div>
                  <div className="font-display font-bold text-lg text-stone-900 mb-1">{c.name}</div>
                  <div className="text-xs text-stone-500 leading-relaxed">{c.description}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-stone-500 mt-4">Passing: {c.passing_score}%</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Language selector */}
        <div className="mb-16">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-bold text-stone-900 mb-4">
            <Translate weight="bold" size={16} /> 2 · Translator
          </div>
          <p className="text-sm text-stone-500 mb-4">Pick the language you want to read questions in. You can toggle between this and English on every question.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0 border-l border-t border-stone-200">
            {languages.map((l) => {
              const selected = language === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  data-testid={`lang-card-${l.code}`}
                  className={`text-left border-r border-b border-stone-200 p-4 transition-all relative ${selected ? "bg-stone-900 text-white" : "bg-white text-stone-900 hover:bg-stone-50"}`}
                >
                  <div className="font-display font-bold text-base" dir={l.rtl ? "rtl" : "ltr"}>{l.native}</div>
                  <div className={`text-xs uppercase tracking-[0.15em] mt-1 ${selected ? "text-stone-300" : "text-stone-500"}`}>{l.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question count */}
        <div className="mb-16">
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-stone-900 mb-4">3 · How many questions</div>
          <div className="flex gap-0 border border-stone-200 w-fit">
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNumQuestions(n)}
                data-testid={`count-${n}`}
                className={`px-8 py-4 font-display font-bold text-xl transition-colors ${numQuestions === n ? "bg-stone-900 text-white" : "bg-white text-stone-900 hover:bg-stone-50"}`}
              >{n}</button>
            ))}
          </div>
        </div>

        {/* Start */}
        <div className="flex justify-end">
          <button
            onClick={start}
            disabled={!country || loading}
            data-testid="start-test-btn"
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-5 font-bold tracking-wide transition-colors"
          >
            {loading ? "Generating questions…" : "Start test"} <ArrowRight weight="bold" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
