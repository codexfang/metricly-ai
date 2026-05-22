import { useCallback, useEffect, useState } from 'react';
import metricsData from './data/metrics.json';
import Header from './components/Header';
import ControlsPanel from './components/ControlsPanel';
import OverviewCards from './components/OverviewCards';
import InsightPanel from './components/InsightPanel';
import ChartsSection from './components/ChartsSection';
import CompareView from './components/CompareView';
import SampleScenarioModal from './components/SampleScenarioModal';
import {
  analyzeMetrics,
  saveAnalysisToStorage,
  loadAnalysisFromStorage,
  getScenarioFilters,
} from './utils/analyzeMetrics';

const DEFAULT_FILTERS = {
  category: 'all',
  metricType: 'performance',
  timeRange: '6m',
};

const DEFAULT_FILTERS_B = {
  category: 'retail',
  metricType: 'revenue',
  timeRange: '6m',
};

export default function App() {
  const [filtersA, setFiltersA] = useState(DEFAULT_FILTERS);
  const [filtersB, setFiltersB] = useState(DEFAULT_FILTERS_B);
  const [compareSide, setCompareSide] = useState('A');
  const [compareMode, setCompareMode] = useState(false);
  const [analysisA, setAnalysisA] = useState(null);
  const [analysisB, setAnalysisB] = useState(null);
  const [animateKey, setAnimateKey] = useState(0);
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState(null);
  const [hasStoredAnalysis, setHasStoredAnalysis] = useState(false);
  const [toast, setToast] = useState(null);

  const activeFilters = compareSide === 'B' ? filtersB : filtersA;
  const setActiveFilters = compareSide === 'B' ? setFiltersB : setFiltersA;

  useEffect(() => {
    setHasStoredAnalysis(!!loadAnalysisFromStorage());
  }, []);

  useEffect(() => {
    const result = analyzeMetrics(metricsData, filtersA);
    setAnalysisA(result);
    if (!compareMode) {
      saveAnalysisToStorage(result, filtersA);
      setHasStoredAnalysis(true);
    }
    setAnimateKey((k) => k + 1);
  }, [filtersA, compareMode]);

  useEffect(() => {
    if (!compareMode) return;
    const result = analyzeMetrics(metricsData, filtersB);
    setAnalysisB(result);
  }, [filtersB, compareMode]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setActiveScenario(null);
  };

  const runAnalysis = useCallback(
    (filters, setter) => {
      const result = analyzeMetrics(metricsData, filters);
      setter(result);
      return result;
    },
    []
  );

  const handleGenerate = () => {
    if (compareMode) {
      if (compareSide === 'A') {
        const result = runAnalysis(filtersA, setAnalysisA);
        saveAnalysisToStorage(result, filtersA);
        showToast('Dataset A insights generated');
      } else {
        const result = runAnalysis(filtersB, setAnalysisB);
        showToast('Dataset B insights generated');
      }
    } else {
      const result = runAnalysis(filtersA, setAnalysisA);
      saveAnalysisToStorage(result, filtersA);
      setHasStoredAnalysis(true);
      showToast('Insights updated successfully');
    }
    setAnimateKey((k) => k + 1);
  };

  const handleScenarioSelect = (scenarioKey) => {
    const overrides = getScenarioFilters(scenarioKey);
    if (!overrides) return;

    const newFilters = { ...DEFAULT_FILTERS, ...overrides };
    setFiltersA(newFilters);
    setActiveScenario(scenarioKey);
    setScenarioModalOpen(false);

    const result = analyzeMetrics(metricsData, newFilters);
    setAnalysisA(result);
    saveAnalysisToStorage(result, newFilters);
    setHasStoredAnalysis(true);
    setAnimateKey((k) => k + 1);
    showToast(`Loaded: ${scenarioKey.replace(/_/g, ' ')}`);
  };

  const handleRestoreStored = () => {
    const stored = loadAnalysisFromStorage();
    if (!stored) return;
    setFiltersA(stored.filters ?? DEFAULT_FILTERS);
    setAnalysisA(stored.analysis);
    setActiveScenario(null);
    setAnimateKey((k) => k + 1);
    showToast('Last analysis restored');
  };

  const handleToggleCompare = () => {
    setCompareMode((prev) => !prev);
  };

  const mainAnalysis = analysisA;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header compareMode={compareMode} />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-xl animate-fade-up">
          {toast}
        </div>
      )}

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <ControlsPanel
            filters={activeFilters}
            onFilterChange={handleFilterChange}
            onGenerate={handleGenerate}
            onLoadSample={() => setScenarioModalOpen(true)}
            onToggleCompare={handleToggleCompare}
            compareMode={compareMode}
            compareSide={compareSide}
            onCompareSideChange={setCompareSide}
            hasStoredAnalysis={hasStoredAnalysis}
            onRestoreStored={handleRestoreStored}
            activeScenario={activeScenario}
          />

          <div className="space-y-6">
            {compareMode ? (
              <>
                <CompareView analysisA={analysisA} analysisB={analysisB} />
                <ChartsSection analysis={analysisA} />
              </>
            ) : (
              <>
                <OverviewCards analysis={mainAnalysis} animateKey={animateKey} />
                <InsightPanel analysis={mainAnalysis} />
                <ChartsSection analysis={mainAnalysis} />
              </>
            )}

            {mainAnalysis?.meta && (
              <p className="text-center text-xs text-slate-400">
                Analysis based on {mainAnalysis.meta.recordCount} metric
                {mainAnalysis.meta.recordCount !== 1 ? 's' : ''} ·{' '}
                {mainAnalysis.meta.timeRange?.toUpperCase()} window
              </p>
            )}
          </div>
        </div>
      </main>

      <SampleScenarioModal
        open={scenarioModalOpen}
        onClose={() => setScenarioModalOpen(false)}
        onSelect={handleScenarioSelect}
      />
    </div>
  );
}
