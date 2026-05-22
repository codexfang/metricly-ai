import OverviewCards from './OverviewCards';
import InsightPanel from './InsightPanel';

export default function CompareView({ analysisA, analysisB }) {
  const delta =
    analysisA && analysisB ? analysisB.score - analysisA.score : null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4">
        <p className="text-sm text-brand-800">
          <span className="font-semibold">Compare Mode:</span> Adjust filters for each
          side using the control panel, then generate insights for Dataset A and B.
        </p>
        {delta !== null && (
          <p className="mt-2 text-sm font-medium text-slate-700">
            Score delta (B − A):{' '}
            <span
              className={
                delta >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }
            >
              {delta >= 0 ? '+' : ''}
              {delta} points
            </span>
          </p>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">Dataset A</h3>
          <OverviewCards analysis={analysisA} animateKey="a" />
          <InsightPanel analysis={analysisA} />
        </section>
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">Dataset B</h3>
          <OverviewCards analysis={analysisB} animateKey="b" />
          <InsightPanel analysis={analysisB} />
        </section>
      </div>
    </div>
  );
}
