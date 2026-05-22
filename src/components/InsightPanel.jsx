const IMPACT_STYLES = {
  positive: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  negative: 'border-rose-200 bg-rose-50 text-rose-800',
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
};

export default function InsightPanel({ analysis }) {
  if (!analysis?.insights) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
        <p className="text-sm text-slate-500">
          Configure your filters and select Generate Insights to view intelligence
          results.
        </p>
      </div>
    );
  }

  const { insights } = analysis;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/40 animate-fade-up">
      <h3 className="text-sm font-semibold text-slate-900">Intelligence Summary</h3>
      <p className="mt-3 text-base leading-relaxed text-slate-700">
        {insights.summary}
      </p>

      <ul className="mt-4 space-y-2">
        {insights.details?.slice(1).map((line, i) => (
          <li key={i} className="flex gap-2 text-sm text-slate-600">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            {line}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <h4 className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Key Factors
        </h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {insights.keyFactors?.map((factor, i) => (
            <div
              key={i}
              className={`rounded-xl border px-4 py-3 transition hover:scale-[1.01] ${IMPACT_STYLES[factor.impact] ?? IMPACT_STYLES.neutral}`}
            >
              <p className="text-xs font-medium opacity-80">{factor.label}</p>
              <p className="mt-1 text-sm font-semibold">{factor.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
