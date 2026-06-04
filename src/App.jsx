import { useCallback, useState } from 'react';
import metricsData from './data/metrics.json';
import Header from './components/Header';
import ControlsPanel from './components/ControlsPanel';
import OverviewCards from './components/OverviewCards';
import InsightPanel from './components/InsightPanel';
import ChartsSection from './components/ChartsSection';
import CompareView from './components/CompareView';
import SampleScenarioModal from './components/SampleScenarioModal';
import DashboardEmptyState from './components/DashboardEmptyState';
import {
  analyzeMetrics,
  saveAnalysisToStorage,
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
  const [generatedA, setGeneratedA] = useState(false);
  const [generatedB, setGeneratedB] = useState(false);
  const [animateKey, setAnimateKey] = useState(0);
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState(null);
  const [toast, setToast] = useState(null);

  const activeFilters = compareSide === 'B' ? filtersB : filtersA;
  const setActiveFilters = compareSide === 'B' ? setFiltersB : setFiltersA;

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setActiveScenario(null);
  };

  const runAnalysis = useCallback((filters, setter) => {
    const result = analyzeMetrics(metricsData, filters);
    setter(result);
    return result;
  }, []);

  const handleGenerate = () => {
    if (compareMode) {
      if (compareSide === 'A') {
        const result = runAnalysis(filtersA, setAnalysisA);
        setGeneratedA(true);
        saveAnalysisToStorage(result, filtersA);
        showToast('Dataset A insights generated');
      } else {
        const result = runAnalysis(filtersB, setAnalysisB);
        setGeneratedB(true);
        showToast('Dataset B insights generated');
      }
    } else {
      const result = runAnalysis(filtersA, setAnalysisA);
      setGeneratedA(true);
      saveAnalysisToStorage(result, filtersA);
      showToast('Insights generated successfully');
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
    setGeneratedA(true);
    saveAnalysisToStorage(result, newFilters);
    setAnimateKey((k) => k + 1);
    showToast(`Loaded: ${scenarioKey.replace(/_/g, ' ')}`);
  };

  const handleToggleCompare = () => {
    setCompareMode((prev) => {
      if (prev) {
        setGeneratedB(false);
        setAnalysisB(null);
      }
      return !prev;
    });
  };

  const showEmptyState = compareMode
    ? !generatedA && !generatedB
    : !generatedA;
  const showMainDashboard = !compareMode && generatedA && analysisA;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/40">
      <Header compareMode={compareMode} />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand-600/30 animate-fade-up">
          {toast}
        </div>
      )}

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-stretch">
          <ControlsPanel
            filters={activeFilters}
            onFilterChange={handleFilterChange}
            onGenerate={handleGenerate}
            onLoadSample={() => setScenarioModalOpen(true)}
            onToggleCompare={handleToggleCompare}
            compareMode={compareMode}
            compareSide={compareSide}
            onCompareSideChange={setCompareSide}
            activeScenario={activeScenario}
          />

          <div className="flex h-full min-h-[560px] flex-col">
            {showEmptyState ? (
              <DashboardEmptyState compareMode={compareMode} />
            ) : compareMode ? (
              <div className="flex h-full flex-col space-y-6">
                <CompareView
                  analysisA={generatedA ? analysisA : null}
                  analysisB={generatedB ? analysisB : null}
                />
                {generatedA && <ChartsSection analysis={analysisA} />}
              </div>
            ) : (
              <div className="flex h-full flex-col space-y-6">
                {showMainDashboard && (
                  <>
                    <OverviewCards analysis={analysisA} animateKey={animateKey} />
                    <InsightPanel analysis={analysisA} />
                    <ChartsSection analysis={analysisA} />
                    {analysisA?.meta && (
                      <p className="text-center text-xs text-slate-400">
                        Analysis based on {analysisA.meta.recordCount} metric
                        {analysisA.meta.recordCount !== 1 ? 's' : ''} ·{' '}
                        {analysisA.meta.timeRange?.toUpperCase()} window
                      </p>
                    )}
                  </>
                )}
              </div>
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
