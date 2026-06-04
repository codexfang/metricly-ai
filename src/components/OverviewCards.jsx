const RISK_STYLES = {
  Low: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  Medium: 'bg-amber-100 text-amber-800 ring-amber-200',
  High: 'bg-rose-100 text-rose-800 ring-rose-200',
};

const TREND_STYLES = {
  upward: { icon: '↑', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  stable: { icon: '→', color: 'text-slate-600', bg: 'bg-slate-100' },
  downward: { icon: '↓', color: 'text-rose-600', bg: 'bg-rose-50' },
};

export default function OverviewCards({ analysis, animateKey }) {
  if (!analysis) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center">
        <p className="text-sm text-slate-500">
          Generate insights for this dataset to view scores and trends.
        </p>
      </div>
    );
  }

  const { score, riskLevel, trendLabel, trend } = analysis;
  const trendStyle = TREND_STYLES[trend] ?? TREND_STYLES.stable;

  return (
    <div key={animateKey} className="grid gap-4 sm:grid-cols-3 animate-fade-up">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/40 transition hover:shadow-lg">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Performance Score
        </p>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-4xl font-bold tabular-nums text-slate-900 transition-all duration-700">
            {score}
          </span>
          <span className="mb-1 text-sm text-slate-400">/ 100</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 animate-score-bar"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/40 transition hover:shadow-lg">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Risk Level
        </p>
        <div className="mt-4">
          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset ${RISK_STYLES[riskLevel]}`}
          >
            {riskLevel}
          </span>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Based on composite risk indicators across selected metrics
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/40 transition hover:shadow-lg">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Trend
        </p>
        <div className="mt-4 flex items-center gap-3">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${trendStyle.bg} ${trendStyle.color}`}
          >
            {trendStyle.icon}
          </span>
          <div>
            <p className="text-lg font-semibold text-slate-900">{trendLabel}</p>
            <p className="text-xs text-slate-500">Period-over-period direction</p>
          </div>
        </div>
      </div>
    </div>
  );
}
