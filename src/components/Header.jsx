export default function Header({ compareMode }) {
  return (
    <header className="bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-800 px-6 py-4 shadow-lg">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-[1.65rem]">
            Metricly AI
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {compareMode && (
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
              Compare Mode
            </span>
          )}
          <span className="hidden rounded-full border border-white/30 px-3 py-1 text-xs text-white/80 sm:inline">
            Live Analytics
          </span>
        </div>
      </div>
    </header>
  );
}
