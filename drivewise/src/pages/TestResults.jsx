import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Header from "@/components/Header";
import api from "@/lib/api";
import { CheckCircle, XCircle, Trophy, ArrowClockwise, House } from "@phosphor-icons/react";

export default function TestResults() {
  const { resultId } = useParams();
  const location = useLocation();
  const [data, setData] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);

  useEffect(() => {
    if (data) return;
    // fallback: fetch from history endpoint
    api.get("/tests/history").then(({ data: hist }) => {
      const r = hist.find((x) => x.id === resultId);
      if (r) setData({ ...r, review: [], country: r.country, language: r.language, score_pct: r.score_pct, correct: r.correct, total: r.total, passed: r.passed, passing_score: r.country?.passing_score });
    }).finally(() => setLoading(false));
  }, [data, resultId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-stone-500">Loading…</div>;
  }
  if (!data) {
    return (
      <div className="bg-stone-50 min-h-screen">
        <Header />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className="font-display text-3xl font-black text-stone-900 mb-4">Result not found</div>
          <Link to="/dashboard" className="text-blue-600 font-bold">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  const { score_pct, correct, total, passed, passing_score, country, language, review } = data;

  return (
    <div className="bg-stone-50 min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
        {/* Headline */}
        <div className={`p-10 md:p-16 mb-12 border-2 ${passed ? "bg-emerald-50 border-emerald-600" : "bg-rose-50 border-rose-600"}`} data-testid="result-headline">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] font-bold text-stone-700 mb-3">
                {country?.flag} {country?.name} · {language?.native}
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-black tracking-tighter text-stone-900 mb-3" data-testid="result-status">
                {passed ? "You passed." : "Not quite."}
              </h1>
              <p className="text-stone-700 max-w-md">
                {passed
                  ? `You scored above the ${passing_score}% required to pass. Great work — keep practising.`
                  : `You needed ${passing_score}% to pass. Review the questions below and try again.`}
              </p>
            </div>
            <div className="text-right">
              <div className="font-display font-black text-7xl md:text-8xl text-stone-900 leading-none" data-testid="result-score">{score_pct}%</div>
              <div className="text-xs uppercase tracking-[0.2em] text-stone-600 mt-2">{correct} / {total} correct</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Link to="/test/setup" data-testid="result-retake" className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-blue-600 text-white px-6 py-4 font-bold tracking-wide transition-colors">
              <ArrowClockwise weight="bold" size={18} /> Take another test
            </Link>
            <Link to="/dashboard" data-testid="result-home" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-900 px-6 py-4 font-bold tracking-wide transition-colors">
              <House weight="bold" size={18} /> Back to dashboard
            </Link>
          </div>
        </div>

        {/* Review */}
        {review && review.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
              <Trophy weight="duotone" size={26} className="text-blue-600" /> Question review
            </h2>
            <div className="space-y-4" data-testid="review-list">
              {review.map((r, idx) => (
                <div key={r.id} className={`bg-white border-l-4 ${r.is_correct ? "border-emerald-600" : "border-rose-600"} border-y border-r border-stone-200 p-6 md:p-8`} data-testid={`review-${idx}`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-stone-500">Question {idx + 1}{r.topic ? ` · ${r.topic}` : ""}</div>
                    <div className={`flex items-center gap-1 text-xs uppercase tracking-[0.2em] font-bold ${r.is_correct ? "text-emerald-700" : "text-rose-700"}`}>
                      {r.is_correct ? <CheckCircle weight="fill" size={16} /> : <XCircle weight="fill" size={16} />}
                      {r.is_correct ? "Correct" : "Incorrect"}
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-lg md:text-xl text-stone-900 mb-4" dir={language?.rtl ? "rtl" : "ltr"}>{r.question}</h3>
                  <div className="grid grid-cols-1 gap-2 mb-4">
                    {Object.entries(r.options).map(([key, label]) => {
                      const isCorrect = key === r.correct;
                      const isGiven = key === r.given;
                      const bg = isCorrect ? "bg-emerald-50 border-emerald-600" : isGiven ? "bg-rose-50 border-rose-600" : "bg-stone-50 border-stone-200";
                      return (
                        <div key={key} className={`flex items-center gap-3 p-3 border ${bg}`}>
                          <div className={`w-8 h-8 flex items-center justify-center font-display font-black text-sm ${isCorrect ? "bg-emerald-600 text-white" : isGiven ? "bg-rose-600 text-white" : "bg-stone-200 text-stone-700"}`}>{key}</div>
                          <div className="flex-1 text-sm md:text-base text-stone-900" dir={language?.rtl ? "rtl" : "ltr"}>{label}</div>
                          {isCorrect && <span className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-700">Correct</span>}
                          {isGiven && !isCorrect && <span className="text-xs uppercase tracking-[0.2em] font-bold text-rose-700">Your answer</span>}
                        </div>
                      );
                    })}
                  </div>
                  {r.explanation && (
                    <div className="bg-stone-50 border-l-2 border-stone-300 px-4 py-3 text-sm text-stone-700">
                      <span className="font-bold uppercase tracking-[0.2em] text-xs text-stone-500 mr-2">Why</span>
                      {r.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
