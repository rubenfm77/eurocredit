# EuroCredit — Counterparty Credit Risk Terminal

A browser-based financial instrument panel for analysing credit risk across a portfolio of European companies. Built as a React proof-of-concept with fully synthetic data — no backend, no API keys, runs entirely offline.

**Live demo:** https://rubenfm77.github.io/eurocredit/

---

## What the app does

EuroCredit presents a database of ~60 synthetic European companies in a sortable, filterable table. Clicking a row opens a **credit dossier** on the right that shows:

- An **Altman Z″ score** with Safe / Grey / Distress band classification
- A **multi-factor score** covering leverage, profitability, debt coverage, country risk, sector cyclicality, and company age
- A **blended rating** (AAA → D) and a **12-month probability-of-default (PD)** estimate
- Key financial ratios with traffic-light colour coding
- Automatically detected **compliance and risk flags**

A portfolio summary strip at the top shows aggregate statistics across all 60 counterparties.

---

## Rating methodology

### 1 · Altman Z″ Score

The **non-manufacturing / emerging-market variant** of the Altman Z-Score is used (Altman, Hartzell & Peck 1995):

```
Z″ = 6.56·(WC/TA) + 3.26·(RE/TA) + 6.72·(EBIT/TA) + 1.05·(Equity/Liabilities)
```

| Variable | Meaning |
|---|---|
| WC / TA | Working capital / Total assets — short-term liquidity |
| RE / TA | Retained earnings / Total assets — cumulative profitability |
| EBIT / TA | Operating profit / Total assets — asset productivity |
| Equity / Liabilities | Market value of equity / Total liabilities — leverage |

**Bands:** Z > 2.6 = Safe · 1.1–2.6 = Grey · < 1.1 = Distress

### 2 · Multi-factor score (0–100)

Five independent sub-scores are summed:

| Sub-score | Max pts | Signal |
|---|---|---|
| Leverage (1 − Debt/Assets) | 25 | Solvency buffer |
| EBIT margin | 25 | Profitability |
| Debt-service coverage (OpCF ÷ estimated interest) | 20 | Liquidity |
| Country risk (inverted) | 15 | Sovereign/macro risk |
| Sector cyclicality (inverted) | 10 | Business cycle sensitivity |
| Company age | 5 | Track-record credit |

### 3 · Blended rating & PD

`Blended = 50% × normalised Z″ + 50% × multi-factor`

The blended score maps to a letter grade and an illustrative 12-month probability-of-default:

| Grade | Score | Est. PD |
|---|---|---|
| AAA | ≥ 90 | 0.02% |
| AA  | ≥ 82 | 0.06% |
| A   | ≥ 72 | 0.14% |
| BBB | ≥ 60 | 0.40% |
| BB  | ≥ 48 | 1.00% |
| B   | ≥ 35 | 3.50% |
| CCC | ≥ 22 | 10.0% |
| CC  | ≥ 12 | 22.0% |
| C   | ≥  4 | 40.0% |
| D   | < 4  | 75.0% |

### 4 · Compliance & monitoring flags

Each company is automatically tagged when any threshold is breached:

| Flag | Type | Trigger |
|---|---|---|
| Revenue Anomaly | ANOMALY | Year-on-year revenue change > ±30% |
| Negative Equity | REGULATORY | Equity < 0 (insolvency review) |
| High Leverage | RISK | Debt/Assets > 85% |
| Operating Loss | RISK | EBIT < 0 |
| Enhanced Due Diligence | REGULATORY | Country risk weight ≥ 0.20 |
| PD Above Threshold | RISK | 12-month PD > 5% |
| Weak Debt Coverage | RISK | Debt-service coverage < 1.5× |

---

## Run locally

**Requirements:** Node 18+ and npm.

```bash
git clone https://github.com/rubenfm77/eurocredit.git
cd eurocredit
npm install
npm run dev
```

Open **http://localhost:5173/eurocredit/** in your browser.

To create a production build:

```bash
npm run build
# output goes to dist/
```

---

## Deploy to GitHub Pages

The project uses [Vite's `base` option](https://vitejs.dev/config/server-options.html) set to `/eurocredit/` and deploys via GitHub Actions.

### Automatic (CI)

Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and publishes to the `gh-pages` branch automatically.

### Manual one-shot

```bash
npm run build
# then push the dist/ folder to your gh-pages branch, or use:
npx gh-pages -d dist
```

The live URL is: `https://rubenfm77.github.io/eurocredit/`

---

## Data & going to production

### Current state

**All data in EuroCredit is entirely synthetic.** Companies are generated deterministically from a seeded random-number generator (`mulberry32`, seed `0xc0ffee`) using a word-list and country-appropriate legal suffixes. No real company is represented. Revenue, balance-sheet figures, and employee counts are fabricated. Do not use this application for any real credit decision.

### How a real version would work

A production version would replace the in-code data generator with a data pipeline:

#### Free / open sources (identity & public filings)

| Source | Coverage | What it provides |
|---|---|---|
| [GLEIF LEI](https://www.gleif.org/) | Global | Legal entity identity, ownership (Level 2 data), registration status |
| [UK Companies House API](https://developer-specs.company-information.service.gov.uk/) | UK | Filed accounts, directors, charges |
| [ECB / Eurostat](https://data.ecb.europa.eu/) | EU | Country-level macro indicators, sovereign spreads |
| [European Data Portal / ESMA](https://www.esma.europa.eu/) | EU | Public bond ratings, MAR disclosures |

#### Commercial pan-European financials

| Vendor | Notes |
|---|---|
| **Bureau van Dijk Orbis** | Broadest EU coverage, structured financials, ownership trees |
| **Creditsafe** | Real-time credit scores, payment data, limit recommendations |
| **Dun & Bradstreet** | Global, strong SME coverage, PAYDEX payment scores |
| **Moody's Analytics** | Sovereign and corporate PD models, EDF™ data |

A real pipeline would: ingest annual report data → normalise to a common chart of accounts → run the rating model → persist scores to a database → serve via an API. Incremental updates would trigger on new filing events (XBRL or structured PDF extraction).

### Regulatory and AI Act note

Any system that **automates creditworthiness scoring of individuals** (including sole traders) falls under the **EU AI Act** as a **high-risk AI system** (Annex III, § 5b). Such a system must:

- Implement human oversight and the right to explanation (Article 14)
- Maintain technical documentation and logs (Articles 11–12)
- Register in the EU database (Article 49)
- Comply with **GDPR** for personal data processing, including lawful basis and data minimisation

For **corporate counterparties only** (as in this demo), the AI Act's high-risk provisions do not directly apply, but GDPR still applies to any personal data of directors or beneficial owners. Model governance best practice (backtesting, bias audits, challenger models) applies regardless.

---

*EuroCredit is an open-source demonstration project. Not investment advice.*
