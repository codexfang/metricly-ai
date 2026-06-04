export default function DashboardEmptyState({ compareMode }) {
  return (
    <div className="flex h-full min-h-[560px] flex-1 flex-col items-center justify-center rounded-2xl border border-brand-100 bg-gradient-to-br from-white to-brand-50/50 px-8 py-16 text-center shadow-md shadow-brand-100/40">
      <h2 className="mt-6 text-xl font-semibold text-brand-700">
        Ready to analyze your metrics
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-500">
        {compareMode
          ? 'Configure filters for Dataset A or B, then generate insights for each side you want to compare.'
          : 'Select a category, metric type, and time range in the panel, then click Generate Insights to view scores, trends, and charts.'}
      </p>
      <ol className="mt-8 flex flex-col gap-3 text-left text-sm text-slate-600 sm:min-w-[280px]">
        <li className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white shadow-sm">
            1
          </span>
          Choose your analysis filters
        </li>
        <li className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white shadow-sm">
            2
          </span>
          Click<span className="font-semibold text-slate-800">Generate Insights</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white shadow-sm">
            3
          </span>
          Review scores, risk, and visual analytics
        </li>
      </ol>
    </div>
  );
}
