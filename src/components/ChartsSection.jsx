import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#64748b', font: { size: 11 } },
    },
    y: {
      grid: { color: '#f1f5f9' },
      ticks: { color: '#64748b', font: { size: 11 } },
      min: 0,
      max: 100,
    },
  },
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#64748b', padding: 16, font: { size: 11 } },
    },
  },
};

function EmptyChart({ title }) {
  return (
    <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
      <p className="text-xs text-slate-400">{title} — no data yet</p>
    </div>
  );
}

export default function ChartsSection({ analysis }) {
  if (!analysis?.chartData) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        {['Trend', 'Categories', 'Risk'].map((t) => (
          <div
            key={t}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <EmptyChart title={t} />
          </div>
        ))}
      </div>
    );
  }

  const { trendLine, categoryBar, riskPie } = analysis.chartData;

  const lineData = {
    labels: trendLine.labels,
    datasets: [
      {
        label: 'Performance',
        data: trendLine.values,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: '#2563eb',
      },
    ],
  };

  const barData = {
    labels: categoryBar.labels.map(
      (l) => l.charAt(0).toUpperCase() + l.slice(1)
    ),
    datasets: [
      {
        label: 'Score',
        data: categoryBar.values,
        backgroundColor: [
          '#2563eb',
          '#3b82f6',
          '#60a5fa',
          '#93c5fd',
          '#1d4ed8',
          '#1e40af',
        ],
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: riskPie.labels,
    datasets: [
      {
        data: riskPie.values,
        backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
        borderWidth: 0,
      },
    ],
  };

  const hasTrend = trendLine.values?.length > 0;
  const hasBar = categoryBar.values?.length > 0;
  const hasPie = riskPie.values?.some((v) => v > 0);

  return (
    <div className="grid gap-4 lg:grid-cols-3 animate-fade-up">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-slate-200/40 transition hover:shadow-lg">
        <h4 className="mb-3 text-sm font-semibold text-slate-800">Performance Trend</h4>
        <div className="h-[220px]">
          {hasTrend ? (
            <Line data={lineData} options={chartOptions} />
          ) : (
            <EmptyChart title="Trend" />
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-slate-200/40 transition hover:shadow-lg">
        <h4 className="mb-3 text-sm font-semibold text-slate-800">
          Category Comparison
        </h4>
        <div className="h-[220px]">
          {hasBar ? (
            <Bar
              data={barData}
              options={{
                ...chartOptions,
                scales: { ...chartOptions.scales, y: { ...chartOptions.scales.y, max: 100 } },
              }}
            />
          ) : (
            <EmptyChart title="Categories" />
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md shadow-slate-200/40 transition hover:shadow-lg">
        <h4 className="mb-3 text-sm font-semibold text-slate-800">Risk Distribution</h4>
        <div className="h-[220px]">
          {hasPie ? (
            <Pie data={pieData} options={pieOptions} />
          ) : (
            <EmptyChart title="Risk" />
          )}
        </div>
      </div>
    </div>
  );
}
