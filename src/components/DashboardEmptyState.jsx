export default function DashboardEmptyState({ compareMode }) {
  return (
    <div className="flex h-full min-h-[560px] flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 shadow-inner">
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 18V10l4 5 4-8 4 6 4-5v10H4z"
            fill="currentColor"
          />
        </svg>
      </div>
      <h2 className="mt-6 text-xl font-semibold text-slate-900">
        Ready to analyze your metrics
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        {compareMode
          ? 'Configure filters for Dataset A or B, then generate insights for each side you want to compare.'
          : 'Select a category, metric type, and time range in the panel, then click Generate Insights to view scores, trends, and charts.'}
      </p>
      <ol className="mt-8 flex flex-col gap-3 text-left text-sm text-slate-600 sm:min-w-[280px]">
        <li className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            1
          </span>
          Choose your analysis filters
        </li>
        <li className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            2
          </span>
          Click <span className="font-semibold text-slate-800">Generate Insights</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            3
          </span>
          Review scores, risk, and visual analytics
        </li>
      </ol>
    </div>
  );
}
