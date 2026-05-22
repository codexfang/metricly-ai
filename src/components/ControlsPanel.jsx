import { SAMPLE_SCENARIOS } from '../utils/analyzeMetrics';

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'finance', label: 'Finance' },
  { value: 'travel', label: 'Travel' },
  { value: 'education', label: 'Education' },
  { value: 'tech', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail' },
];

const METRIC_TYPES = [
  { value: 'all', label: 'All Metrics' },
  { value: 'performance', label: 'Performance' },
  { value: 'growth', label: 'Growth' },
  { value: 'efficiency', label: 'Efficiency' },
  { value: 'retention', label: 'Retention' },
  { value: 'revenue', label: 'Revenue' },
];

const TIME_RANGES = [
  { value: '3m', label: 'Last 3 Months' },
  { value: '6m', label: 'Last 6 Months' },
  { value: '12m', label: 'Last 12 Months' },
];

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm transition hover:border-brand-500 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function ControlsPanel({
  filters,
  onFilterChange,
  onGenerate,
  onLoadSample,
  onToggleCompare,
  compareMode,
  compareSide,
  onCompareSideChange,
  hasStoredAnalysis,
  onRestoreStored,
  activeScenario,
}) {
  return (
    <aside className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-900">Analysis Controls</h2>
        <p className="mt-1 text-xs text-slate-500">
          Configure filters and generate intelligence
        </p>
      </div>

      <div className="space-y-4">
        {compareMode && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Compare Side
            </span>
            <select
              value={compareSide}
              onChange={(e) => onCompareSideChange(e.target.value)}
              className="w-full rounded-lg border border-brand-200 bg-brand-50 px-3 py-2.5 text-sm font-medium text-brand-800"
            >
              <option value="A">Dataset A</option>
              <option value="B">Dataset B</option>
            </select>
          </label>
        )}

        <SelectField
          label="Category"
          value={filters.category}
          onChange={(v) => onFilterChange('category', v)}
          options={CATEGORIES}
        />
        <SelectField
          label="Metric Type"
          value={filters.metricType}
          onChange={(v) => onFilterChange('metricType', v)}
          options={METRIC_TYPES}
        />
        <SelectField
          label="Time Range"
          value={filters.timeRange}
          onChange={(v) => onFilterChange('timeRange', v)}
          options={TIME_RANGES}
        />
      </div>

      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={onGenerate}
          className="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/30 transition hover:bg-brand-700 hover:shadow-lg active:scale-[0.98]"
        >
          Generate Insights
        </button>
        <button
          type="button"
          onClick={onLoadSample}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
        >
          Load Sample Data
        </button>
        <button
          type="button"
          onClick={onToggleCompare}
          className={`w-full rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
            compareMode
              ? 'border-brand-600 bg-brand-50 text-brand-700'
              : 'border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          {compareMode ? 'Exit Compare Mode' : 'Enable Compare Mode'}
        </button>
        {hasStoredAnalysis && (
          <button
            type="button"
            onClick={onRestoreStored}
            className="w-full rounded-lg border border-dashed border-slate-300 px-4 py-2 text-xs text-slate-500 transition hover:border-brand-400 hover:text-brand-600"
          >
            Restore Last Analysis
          </button>
        )}
      </div>

      {activeScenario && (
        <div className="mt-4 rounded-lg bg-brand-50 p-3 text-xs text-brand-800">
          <span className="font-semibold">Scenario:</span>{' '}
          {SAMPLE_SCENARIOS[activeScenario]?.label}
        </div>
      )}
    </aside>
  );
}
