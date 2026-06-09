import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy, ChartLineUp, CheckCircle, Plus, Clock, MapPin } from "@phosphor-icons/react";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([api.get("/tests/stats"), api.get("/tests/history")])
      .then(([s, h]) => {
        if (!mounted) return;
        setStats(s.data);
        setHistory(h.data);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div className="bg-stone-50 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] font-bold text-stone-500 mb-3">Dashboard</div>
            <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight text-stone-900" data-testid="dashboard-greeting">Hello, {user?.name?.split(" ")[0] || "Driver"}.</h1>
          </div>
          <Link to="/test/setup" data-testid="start-test-cta" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 font-bold tracking-wide transition-colors">
            <Plus weight="bold" size={20} /> Start a new test
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-l border-t border-stone-200 mb-16">
          <StatCard icon={<ChartLineUp weight="duotone" size={28} />} label="Tests taken" value={stats?.total_tests ?? 0} testid="stat-total" />
          <StatCard icon={<Trophy weight="duotone" size={28} />} label="Best score" value={stats ? `${stats.best_score}%` : "0%"} testid="stat-best" />
          <StatCard icon={<CheckCircle weight="duotone" size={28} />} label="Tests passed" value={stats?.passed_count ?? 0} testid="stat-passed" />
          <StatCard icon={<Clock weight="duotone" size={28} />} label="Average score" value={stats ? `${stats.avg_score}%` : "0%"} testid="stat-avg" />
        </div>

        {/* History */}
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-6">Recent attempts</h2>
          {loading ? (
            <div className="text-stone-500 text-sm" data-testid="history-loading">Loading…</div>
          ) : history.length === 0 ? (
            <div className="border-2 border-dashed border-stone-300 p-12 text-center" data-testid="history-empty">
              <MapPin weight="duotone" size={40} className="mx-auto text-stone-400 mb-4" />
              <div className="font-display font-bold text-xl text-stone-900 mb-2">No tests yet</div>
              <div className="text-stone-500 mb-6">Take your first mock exam to see your progress here.</div>
              <Link to="/test/setup" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-bold tracking-wide transition-colors" data-testid="empty-start-cta">Start first test</Link>
            </div>
          ) : (
            <div className="border border-stone-200 bg-white divide-y divide-stone-200" data-testid="history-list">
              {history.map((r) => (
                <Link key={r.id} to={`/test/results/${r.id}`} className="flex items-center justify-between gap-4 p-6 hover:bg-stone-50 transition-colors" data-testid={`history-item-${r.id}`}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-3xl">{r.country?.flag}</div>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-stone-900 truncate">{r.country?.name} · {r.language?.native}</div>
                      <div className="text-xs uppercase tracking-[0.2em] text-stone-500 mt-1">
                        {new Date(r.created_at).toLocaleDateString()} · {r.correct}/{r.total} correct
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`text-xs px-3 py-1 font-bold uppercase tracking-wider ${r.passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {r.passed ? "Passed" : "Failed"}
                    </div>
                    <div className="font-display font-black text-2xl text-stone-900 w-16 text-right">{r.score_pct}%</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, testid }) {
  return (
    <div className="border-r border-b border-stone-200 bg-white p-8" data-testid={testid}>
      <div className="text-blue-600 mb-4">{icon}</div>
      <div className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-2">{label}</div>
      <div className="font-display font-black text-3xl text-stone-900">{value}</div>
    </div>
  );
}
