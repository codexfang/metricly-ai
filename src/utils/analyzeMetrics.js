const TIME_RANGE_MONTHS = {
  '3m': 3,
  '6m': 6,
  '12m': 12,
};

const TREND_THRESHOLD = 2;

export const SAMPLE_SCENARIOS = {
  growth_leader: {
    label: 'Growth Leader',
    description: 'Strong upward momentum across technology and education sectors.',
    overrides: { category: 'tech', metricType: 'growth', timeRange: '6m' },
  },
  risk_alert: {
    label: 'Risk Alert',
    description: 'Elevated exposure in retail and healthcare performance metrics.',
    overrides: { category: 'retail', metricType: 'revenue', timeRange: '6m' },
  },
  balanced_portfolio: {
    label: 'Balanced Portfolio',
    description: 'Mixed performance with stable finance and education indicators.',
    overrides: { category: 'all', metricType: 'performance', timeRange: '6m' },
  },
  efficiency_focus: {
    label: 'Efficiency Focus',
    description: 'Operational efficiency gains in education and finance.',
    overrides: { category: 'education', metricType: 'efficiency', timeRange: '6m' },
  },
};

const STORAGE_KEY = 'metricly-ai-last-analysis';

export function getRiskLevel(riskIndicator) {
  if (riskIndicator < 0.35) return 'Low';
  if (riskIndicator < 0.55) return 'Medium';
  return 'High';
}

export function getTrendDirection(trendValue) {
  if (trendValue > TREND_THRESHOLD) return 'upward';
  if (trendValue < -TREND_THRESHOLD) return 'downward';
  return 'stable';
}

export function formatTrendLabel(direction) {
  const labels = {
    upward: 'Upward',
    stable: 'Stable',
    downward: 'Downward',
  };
  return labels[direction] ?? 'Stable';
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function sliceTimeSeries(series, months) {
  if (!series?.length) return [];
  return series.slice(-months);
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function computeSeriesSlope(series) {
  if (series.length < 2) return 0;
  const first = series[0].value;
  const last = series[series.length - 1].value;
  return ((last - first) / Math.max(first, 1)) * 100;
}

export function filterRecords(dataset, { category, metricType }) {
  let records = [...(dataset.records ?? [])];

  if (category && category !== 'all') {
    records = records.filter((r) => r.category === category);
  }

  if (metricType && metricType !== 'all') {
    records = records.filter((r) => r.metricType === metricType);
  }

  return records;
}

export function buildCategoryComparison(records) {
  const byCategory = {};

  for (const record of records) {
    if (!byCategory[record.category]) {
      byCategory[record.category] = [];
    }
    byCategory[record.category].push(record.performanceScore);
  }

  const labels = Object.keys(byCategory).sort();
  const values = labels.map((cat) =>
    clampScore(average(byCategory[cat]))
  );

  return { labels, values };
}

export function buildRiskDistribution(records) {
  const counts = { Low: 0, Medium: 0, High: 0 };

  for (const record of records) {
    const level = getRiskLevel(record.riskIndicator);
    counts[level] += 1;
  }

  return {
    labels: ['Low', 'Medium', 'High'],
    values: [counts.Low, counts.Medium, counts.High],
  };
}

function generateInsights({ score, riskLevel, trend, records, keyFactors }) {
  const insights = [];
  const categoryCount = new Set(records.map((r) => r.category)).size;

  if (trend === 'upward') {
    insights.push(
      'High upward trend detected in performance metrics over the selected period.'
    );
  } else if (trend === 'downward') {
    insights.push(
      'Performance metrics show a declining pattern that may require strategic review.'
    );
  } else {
    insights.push(
      'Metrics remain within a stable range, indicating consistent operational performance.'
    );
  }

  if (score >= 85) {
    insights.push(
      'Overall performance score ranks in the excellent tier for decision-ready reporting.'
    );
  } else if (score >= 70) {
    insights.push(
      'Performance remains solid with room for targeted optimization in weaker segments.'
    );
  } else {
    insights.push(
      'Composite score suggests attention to underperforming areas before the next planning cycle.'
    );
  }

  if (riskLevel === 'High') {
    insights.push(
      'Risk exposure is elevated; prioritize mitigation in categories with the weakest indicators.'
    );
  } else if (riskLevel === 'Low') {
    insights.push(
      'Risk profile is favorable, supporting confidence in near-term forecasts and investments.'
    );
  } else {
    insights.push(
      'Moderate risk levels warrant continued monitoring without immediate intervention.'
    );
  }

  if (categoryCount > 1) {
    insights.push(
      `Analysis spans ${categoryCount} business categories for a multi-dimensional view.`
    );
  }

  return {
    summary: insights[0],
    details: insights,
    keyFactors,
  };
}

function deriveKeyFactors(records, score, riskLevel, trend) {
  const factors = [];

  const topRecord = [...records].sort(
    (a, b) => b.performanceScore - a.performanceScore
  )[0];
  const weakRecord = [...records].sort(
    (a, b) => a.performanceScore - b.performanceScore
  )[0];

  if (topRecord) {
    factors.push({
      label: 'Top performer',
      value: `${capitalize(topRecord.category)} · ${capitalize(topRecord.metricType)} (${topRecord.performanceScore})`,
      impact: 'positive',
    });
  }

  if (weakRecord && weakRecord.id !== topRecord?.id) {
    factors.push({
      label: 'Needs attention',
      value: `${capitalize(weakRecord.category)} · ${capitalize(weakRecord.metricType)} (${weakRecord.performanceScore})`,
      impact: 'negative',
    });
  }

  const avgRisk = average(records.map((r) => r.riskIndicator));
  factors.push({
    label: 'Risk index',
    value: `${(avgRisk * 100).toFixed(0)}% · ${riskLevel} exposure`,
    impact: riskLevel === 'High' ? 'negative' : riskLevel === 'Low' ? 'positive' : 'neutral',
  });

  factors.push({
    label: 'Trend signal',
    value: formatTrendLabel(trend),
    impact: trend === 'upward' ? 'positive' : trend === 'downward' ? 'negative' : 'neutral',
  });

  factors.push({
    label: 'Composite score',
    value: `${score} / 100`,
    impact: score >= 75 ? 'positive' : score >= 60 ? 'neutral' : 'negative',
  });

  return factors;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function analyzeMetrics(dataset, options = {}) {
  const {
    category = 'all',
    metricType = 'all',
    timeRange = '6m',
  } = options;

  const months = TIME_RANGE_MONTHS[timeRange] ?? 6;
  const records = filterRecords(dataset, { category, metricType });

  if (!records.length) {
    return {
      score: 0,
      riskLevel: 'Medium',
      trend: 'stable',
      trendLabel: 'Stable',
      insights: {
        summary: 'No matching metrics found for the current selection.',
        details: ['Adjust category or metric filters to view intelligence results.'],
        keyFactors: [],
      },
      chartData: {
        trendLine: { labels: [], values: [] },
        categoryBar: { labels: [], values: [] },
        riskPie: { labels: ['Low', 'Medium', 'High'], values: [0, 0, 0] },
      },
      meta: { recordCount: 0, category, metricType, timeRange },
    };
  }

  const processed = records.map((record) => {
    const sliced = sliceTimeSeries(record.timeSeries, months);
    const slope = computeSeriesSlope(sliced);
    const avgValue = average(sliced.map((p) => p.value));
    return {
      ...record,
      slicedSeries: sliced,
      computedTrend: slope,
      avgPerformance: avgValue,
    };
  });

  const performanceScores = processed.map((r) => r.avgPerformance);
  const riskValues = processed.map((r) => r.riskIndicator);
  const trendValues = processed.map((r) => r.computedTrend ?? r.trendValue);

  const rawScore = average(performanceScores);
  const riskPenalty = average(riskValues) * 12;
  const trendBonus = average(trendValues) * 0.35;
  const score = clampScore(rawScore - riskPenalty + trendBonus);

  const avgRisk = average(riskValues);
  const riskLevel = getRiskLevel(avgRisk);
  const avgTrend = average(trendValues);
  const trend = getTrendDirection(avgTrend);
  const trendLabel = formatTrendLabel(trend);

  const keyFactors = deriveKeyFactors(processed, score, riskLevel, trend);
  const insights = generateInsights({
    score,
    riskLevel,
    trend,
    records: processed,
    keyFactors,
  });

  const primary = processed[0];
  const mergedSeries = mergeTimeSeries(processed);
  const trendLine = {
    labels: mergedSeries.map((p) => p.period),
    values: mergedSeries.map((p) => clampScore(p.value)),
  };

  const categoryBar = buildCategoryComparison(processed);
  const riskPie = buildRiskDistribution(processed);

  const result = {
    score,
    riskLevel,
    trend,
    trendLabel,
    insights,
    chartData: {
      trendLine,
      categoryBar,
      riskPie,
      primaryCategory: primary?.category,
    },
    meta: {
      recordCount: processed.length,
      category,
      metricType,
      timeRange,
      generatedAt: new Date().toISOString(),
    },
  };

  return result;
}

function mergeTimeSeries(records) {
  const periodMap = {};

  for (const record of records) {
    for (const point of record.slicedSeries ?? record.timeSeries ?? []) {
      if (!periodMap[point.period]) {
        periodMap[point.period] = [];
      }
      periodMap[point.period].push(point.value);
    }
  }

  return Object.keys(periodMap)
    .sort()
    .map((period) => ({
      period,
      value: average(periodMap[period]),
    }));
}

export function saveAnalysisToStorage(analysis, filters) {
  try {
    const payload = {
      filters,
      analysis,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function loadAnalysisFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearStoredAnalysis() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function getScenarioFilters(scenarioKey) {
  const scenario = SAMPLE_SCENARIOS[scenarioKey];
  return scenario?.overrides ?? null;
}
