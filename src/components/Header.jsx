export default function Header({ compareMode }) {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.65rem]">
            Metricly AI
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {compareMode && (
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
              Compare Mode
            </span>
          )}
          <span className="hidden rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 sm:inline">
            Live Analytics
          </span>
        </div>
      </div>
    </header>
  );
}
