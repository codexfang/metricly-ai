# Metricly AI

Metricly AI is a browser-based intelligence dashboard for trends, predictions, performance insights, and risk scoring. It delivers SaaS-style analytics for business decision-making using structured metric data and in-app analytical processing.

![Metricly AI](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## Features

- **Performance scoring** (0–100) with risk levels (Low / Medium / High)
- **Trend detection** (upward, stable, downward)
- **Human-readable insights** and key factor breakdowns
- **Interactive charts** — trend line, category comparison, risk distribution
- **Sample scenarios** — predefined analytics presets
- **Compare mode** — side-by-side analysis of two filter configurations
- **Persistent session** — last analysis saved in browser storage

## Quick Start

```bash
git clone https://github.com/codexfang/metricly-ai.git
cd metricly-ai
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173/metricly-ai/`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Build and publish to GitHub Pages |

## Project Structure

```
src/
  components/     # UI (controls, cards, charts, compare)
  data/
    metrics.json  # Mock structured metrics dataset
  utils/
    analyzeMetrics.js  # Analytics engine
  App.jsx
  main.jsx
```

## Deploy to GitHub Pages

Repository: **codexfang/metricly-ai**

1. Create the GitHub repository `metricly-ai` under user `codexfang`.

2. Push this project:

```bash
git remote add origin https://github.com/codexfang/metricly-ai.git
git add .
git commit -m "Initial release: Metricly AI MVP"
git branch -M main
git push -u origin main
```

3. Install deploy dependency (included in devDependencies):

```bash
npm install
```

4. Deploy:

```bash
npm run deploy
```

This runs `vite build` and publishes `dist/` to the `gh-pages` branch.

5. In GitHub → **Settings** → **Pages**, set source to **Deploy from branch** → branch `gh-pages` → folder `/ (root)`.

6. Live site URL:

**https://codexfang.github.io/metricly-ai/**

### Base path

`vite.config.js` sets `base: '/metricly-ai/'` for GitHub Pages. If you deploy to a custom domain or root path, update `base` accordingly.

## Usage

1. Select **Category**, **Metric Type**, and **Time Range** in the left panel.
2. Click **Generate Insights** to refresh scores, risk, trends, and charts.
3. Use **Load Sample Data** to pick a predefined scenario.
4. Enable **Compare Mode** to configure and analyze Dataset A vs Dataset B.
5. **Restore Last Analysis** reloads your previous session from browser storage.

## License

MIT
