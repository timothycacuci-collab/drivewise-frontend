import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import { ArrowRight, Translate, X } from "@phosphor-icons/react";

// Lightweight translation cache for the "English fallback" toggle
async function fetchEnglish(sessionId) {
  const { data } = await api.post("/tests/generate", { session_id: sessionId }); // unused fallback
  return data;
}

export default function TestRunner() {
  const { sessionId } = useParams();
  const location = useLocation();
  const nav = useNavigate();

  const initial = location.state;
  const [data, setData] = useState(initial || null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showEnglish, setShowEnglish] = useState(false);
  const [englishMap, setEnglishMap] = useState(null);   // {q.id -> {question, options}}
  const [translating, setTranslating] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!initial) {
      // Came in via refresh — bail to dashboard
      toast.error("Test session expired. Please start again.");
      nav("/test/setup");
    }
  }, [initial, nav]);

  if (!data) return null;

  const questions = data.questions;
  const q = questions[idx];
  const total = questions.length;
  const selected = answers[q.id];
  const language = data.language;
  const country = data.country;

  const choose = (key) => setAnswers((a) => ({ ...a, [q.id]: key }));

  const goNext = () => {
    if (idx < total - 1) setIdx(idx + 1);
  };
  const goPrev = () => idx > 0 && setIdx(idx - 1);

  const allAnswered = Object.keys(answers).length === total;

  const submit = async () => {
    if (!allAnswered) { toast.error("Answer every question first."); return; }
    setSubmitting(true);
    try {
      const duration = Math.round((Date.now() - startedAt) / 1000);
      const { data: result } = await api.post("/tests/submit", {
        session_id: sessionId,
        answers,
        duration_seconds: duration,
      });
      nav(`/test/results/${result.result_id}`, { state: result });
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed to submit test");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleEnglish = async () => {
    if (language.code === "en") return;
    if (showEnglish) { setShowEnglish(false); return; }
    if (englishMap) { setShowEnglish(true); return; }

    setTranslating(true);
    try {
      // Generate english version by re-asking backend translator for same questions
      const { data: enData } = await api.post("/tests/translate", {
        session_id: sessionId,
        target_language: "en",
      });
      const map = {};
      enData.questions.forEach((eq) => { map[eq.id] = eq; });
      setEnglishMap(map);
      setShowEnglish(true);
    } catch (e) {
      toast.error("Could not load English version");
    } finally {
      setTranslating(false);
    }
  };

  const progress = ((idx + 1) / total) * 100;

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Slim test header */}
      <div className="sticky top-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-2xl">{country?.flag}</div>
            <div className="min-w-0">
              <div className="font-display font-bold text-sm md:text-base text-stone-900 truncate">{country?.name} Theory Test</div>
              <div className="text-xs uppercase tracking-[0.2em] text-stone-500">Question {idx + 1} of {total} · {language?.native}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { if (confirm("Quit this test? Your progress will be lost.")) nav("/dashboard"); }}
            data-testid="quit-test"
            className="text-stone-500 hover:text-rose-600 transition-colors p-2"
            aria-label="Quit test"
          >
            <X weight="bold" size={20} />
          </button>
        </div>
        <div className="h-1 bg-stone-200">
          <div className="h-1 bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} data-testid="progress-bar" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
        {/* Translation toggle */}
        {language?.code !== "en" && (
          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={toggleEnglish}
              data-testid="toggle-english"
              disabled={translating}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.2em] font-bold border transition-colors ${showEnglish ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-900 border-stone-300 hover:border-stone-900"}`}
            >
              <Translate weight="bold" size={16} />
              {translating ? "Translating…" : showEnglish ? "Hide English" : "Show English"}
            </button>
          </div>
        )}

        {/* Question card */}
        <div key={q.id} className="bg-white border-2 border-stone-200 p-8 md:p-12 rise rise-1" data-testid={`question-card-${idx}`}>
          {q.topic && <div className="text-xs uppercase tracking-[0.3em] font-bold text-blue-600 mb-4">{q.topic}</div>}
          <div className={`grid ${showEnglish && englishMap?.[q.id] ? "md:grid-cols-2 gap-8" : "grid-cols-1"}`}>
            <div dir={language?.rtl ? "rtl" : "ltr"}>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-stone-900 leading-snug mb-2">{q.question}</h2>
              <div className="text-xs uppercase tracking-[0.2em] text-stone-400">{language?.native}</div>
            </div>
            {showEnglish && englishMap?.[q.id] && (
              <div className="border-l-2 border-stone-200 pl-8">
                <h2 className="font-display font-semibold text-xl md:text-2xl text-stone-700 leading-snug mb-2">{englishMap[q.id].question}</h2>
                <div className="text-xs uppercase tracking-[0.2em] text-stone-400">English</div>
              </div>
            )}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3">
            {Object.entries(q.options).map(([key, label]) => {
              const isSel = selected === key;
              const enLabel = showEnglish && englishMap?.[q.id]?.options?.[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => choose(key)}
                  data-testid={`option-${key}`}
                  className={`text-left p-5 border transition-all ${isSel ? "border-blue-600 bg-blue-50 border-2" : "border-stone-200 bg-white hover:border-stone-900 hover:bg-stone-50"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 flex items-center justify-center font-display font-black text-base ${isSel ? "bg-blue-600 text-white" : "bg-stone-100 text-stone-900"}`}>{key}</div>
                    <div className="flex-1 pt-1">
                      <div className="text-base md:text-lg font-medium text-stone-900" dir={language?.rtl ? "rtl" : "ltr"}>{label}</div>
                      {enLabel && enLabel !== label && (
                        <div className="text-sm text-stone-500 mt-1 italic">{enLabel}</div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nav */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8">
          <button
            type="button"
            onClick={goPrev}
            disabled={idx === 0}
            data-testid="prev-question"
            className="px-6 py-4 border border-stone-300 hover:border-stone-900 disabled:opacity-40 disabled:cursor-not-allowed font-bold tracking-wide transition-colors"
          >Previous</button>

          <div className="flex-1 flex items-center gap-2 px-2 overflow-x-auto" data-testid="question-pips">
            {questions.map((qq, i) => {
              const answered = answers[qq.id];
              const isCurrent = i === idx;
              return (
                <button
                  key={qq.id}
                  type="button"
                  onClick={() => setIdx(i)}
                  data-testid={`pip-${i}`}
                  className={`flex-shrink-0 w-8 h-8 text-xs font-bold transition-colors ${isCurrent ? "bg-stone-900 text-white" : answered ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "bg-stone-100 text-stone-500 hover:bg-stone-200"}`}
                >{i + 1}</button>
              );
            })}
          </div>

          {idx < total - 1 ? (
            <button
              type="button"
              onClick={goNext}
              data-testid="next-question"
              className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-blue-600 text-white px-6 py-4 font-bold tracking-wide transition-colors"
            >Next <ArrowRight weight="bold" size={18} /></button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!allAnswered || submitting}
              data-testid="submit-test"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 font-bold tracking-wide transition-colors"
            >{submitting ? "Submitting…" : "Submit test"} <ArrowRight weight="bold" size={18} /></button>
          )}
        </div>
      </div>
    </div>
  );
}
