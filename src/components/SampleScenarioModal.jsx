import { SAMPLE_SCENARIOS } from '../utils/analyzeMetrics';

export default function SampleScenarioModal({ open, onClose, onSelect }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-fade-up"
        role="dialog"
        aria-labelledby="scenario-title"
      >
        <h2 id="scenario-title" className="text-lg font-semibold text-slate-900">
          Load Sample Scenario
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose a predefined analytics scenario to explore Metricly AI.
        </p>

        <ul className="mt-4 space-y-2">
          {Object.entries(SAMPLE_SCENARIOS).map(([key, scenario]) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => onSelect(key)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-brand-400 hover:bg-brand-50"
              >
                <span className="font-medium text-slate-900">{scenario.label}</span>
                <p className="mt-1 text-xs text-slate-500">{scenario.description}</p>
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
