# EuroCredit — Counterparty Credit Risk Terminal

A browser-based financial instrument panel for analysing credit risk across a portfolio of synthetic European companies. Built with React and Vite — no backend, no API keys, runs fully offline as a proof of concept.

**Live demo:** https://rubenfm77.github.io/eurocredit/

---

## Table of contents

1. [What the app does](#what-the-app-does)
2. [Glossary — key terms explained](#glossary--key-terms-explained)
3. [Rating methodology](#rating-methodology)
4. [Compliance & monitoring flags](#compliance--monitoring-flags)
5. [Running the app locally](#running-the-app-locally)
6. [Deploying to GitHub Pages](#deploying-to-github-pages)
7. [Data & going to production](#data--going-to-production)
8. [Legal & regulatory note](#legal--regulatory-note)

---

## What the app does

EuroCredit simulates the kind of **counterparty credit risk terminal** used by corporate treasury teams, credit analysts, and compliance officers to monitor a portfolio of business counterparties (suppliers, customers, financial counterparties).

The main screen has three zones:

| Zone | What it shows |
|---|---|
| **Portfolio strip** (top) | Aggregate statistics: total counterparties, average probability of default, how many are investment-grade, total active compliance flags |
| **Company table** (left) | All 60 synthetic companies, sortable and filterable by country, sector, rating grade, flags, and name |
| **Credit dossier** (right) | Full detail for the selected company: rating breakdown bars, financial ratios, compliance flags with descriptions |

---

## Glossary — key terms explained

### Credit rating grades

Ratings run from **AAA** (safest) to **D** (defaulted). They are grouped into two tiers:

| Tier | Grades | Meaning |
|---|---|---|
| **Investment grade** | AAA, AA, A, BBB | Low default risk; acceptable for most lending and trade-credit policies |
| **Sub-investment grade** ("junk") | BB, B, CCC, CC, C, D | Elevated default risk; requires enhanced monitoring or credit enhancement |

In EuroCredit, a letter grade is assigned by mapping the blended score (0–100) to a threshold table. Real-world ratings are issued by agencies such as Moody's, S&P, and Fitch after detailed fundamental analysis.

---

### Probability of Default (PD)

The **12-month PD** is the estimated probability that a company will fail to meet a financial obligation within the next year. Expressed as a percentage:

- **0.02%** (AAA) → 2 companies out of every 10,000 would be expected to default
- **10%** (CCC) → 1 in 10 companies would be expected to default
- **75%** (D) → company is already in or near default

PD is a core input to the Basel III capital adequacy framework used by banks. Under the Internal Ratings-Based (IRB) approach, banks must estimate PD, Loss Given Default (LGD), and Exposure at Default (EAD) for every credit exposure.

---

### Altman Z″ Score

The **Altman Z-Score** was developed by Professor Edward Altman in 1968 as a quantitative model to predict corporate bankruptcy. The version used here is the **Z″ variant** (1995), adapted for non-manufacturing and emerging-market companies. It combines four financial ratios into a single number:

```
Z″ = 6.56·(WC/TA) + 3.26·(RE/TA) + 6.72·(EBIT/TA) + 1.05·(Equity/Liabilities)
```

| Component | What it measures | Why it matters |
|---|---|---|
| **WC/TA** — Working capital / Total assets | Short-term liquidity cushion | Negative working capital → can't pay near-term bills |
| **RE/TA** — Retained earnings / Total assets | Cumulative profitability over life of company | Low retained earnings → company has not generated returns |
| **EBIT/TA** — Earnings before interest & tax / Total assets | Asset productivity / operating efficiency | Negative EBIT → core operations are loss-making |
| **Equity/Liabilities** — Book equity / Total liabilities | Solvency buffer | Low ratio → heavily indebted relative to net worth |

**Interpretation bands:**

| Z″ value | Zone | Meaning |
|---|---|---|
| > 2.6 | **Safe** (green) | Low bankruptcy risk |
| 1.1 – 2.6 | **Grey** (amber) | Uncertain; warrants monitoring |
| < 1.1 | **Distress** (red) | High bankruptcy risk |

The Z-Score has known limitations: it works best for publicly listed manufacturing companies, uses book values rather than market values where unavailable, and cannot capture qualitative factors like management quality or geopolitical exposure.

---

### Leverage

**Leverage** = Total Liabilities / Total Assets. It measures how much of a company's assets are funded by debt rather than equity.

- **< 50%** → conservative balance sheet
- **50–85%** → moderate; common in capital-intensive industries
- **> 85%** → high leverage; a flag is raised in EuroCredit

High leverage amplifies both returns and losses. During downturns, highly leveraged companies are more likely to breach debt covenants or default.

---

### EBIT Margin

**EBIT margin** = EBIT / Revenue. It shows how profitable the core business is before the effects of financing (interest) and taxation.

- Positive → company earns more from operations than it spends
- Negative → operating losses; company is burning cash on its core activities
- A negative EBIT is flagged in EuroCredit as an **Operating Loss**

---

### Debt-Service Coverage Ratio (DSCR)

**DSCR** = Operating Cash Flow / Annual Debt Service Cost

Measures whether a company generates enough cash to service its debt obligations. In EuroCredit, the annual debt service cost is estimated as `Total Liabilities × 5%` (an assumed average cost of debt).

- **DSCR > 2×** → comfortable; company earns twice what it needs to service debt
- **DSCR 1–2×** → adequate but tight
- **DSCR < 1.5×** → flagged as **Weak Debt Coverage** in EuroCredit
- **DSCR < 1×** → the company cannot service its debt from operating cash flow alone

---

### Country Risk

Each of the 12 countries in EuroCredit has an **illustrative risk weight** reflecting sovereign and macro risk. Higher-risk countries face wider sovereign spreads, weaker institutional quality, or recent financial stress:

| Country | Risk weight | Context |
|---|---|---|
| Germany | 5% | Anchor of the euro area |
| Sweden | 6% | AAA-rated sovereign |
| Netherlands | 6% | Strong fiscal position |
| Austria | 7% | Stable, export-oriented |
| Belgium | 9% | Moderate debt level |
| France | 8% | Large economy, AAA/AA range |
| Ireland | 12% | Recovered from 2010 bailout |
| Spain | 15% | Peripheral euro-area risk |
| Italy | 18% | High public debt / political risk |
| Portugal | 20% | Historically fragile public finances |
| Poland | 22% | Emerging market / non-euro |
| Greece | 35% | Sovereign debt crisis history |

A country risk weight ≥ 20% triggers an **Enhanced Due Diligence** flag (see below).

---

### Sector Cyclicality

Some industries are more exposed to the economic cycle than others. In EuroCredit each sector has a **cyclicality weight** (0 = non-cyclical, 1 = highly cyclical) which reduces the multi-factor score:

| Sector | Cyclicality | Why |
|---|---|---|
| Pharmaceuticals | 10% | Demand is non-discretionary |
| Healthcare | 15% | Relatively recession-proof |
| Telecom | 25% | Sticky subscriptions |
| Technology | 30% | Moderately discretionary |
| Agriculture | 40% | Weather-driven but staple goods |
| Retail | 45% | Consumer spending-sensitive |
| Logistics | 45% | Tied to trade volumes |
| Manufacturing | 50% | Capital goods demand falls in recessions |
| Financial Services | 55% | Amplifies credit cycles |
| Energy | 60% | Commodity price driven |
| Construction | 65% | Very sensitive to rates and capex |
| Hospitality | 70% | First to suffer in downturns |

---

### Multi-factor Score

A composite 0–100 score built from five independent signals:

| Sub-score | Max pts | How it's computed |
|---|---|---|
| Leverage | 25 | `(1 − Debt/Assets) × 25` — rewards low leverage |
| EBIT margin | 25 | Normalised from −10% to +25% range |
| Debt-service coverage | 20 | DSCR capped at 4× mapped to 0–20 pts |
| Country risk | 15 | `(1 − risk weight) × 15` |
| Sector cyclicality | 10 | `(1 − cyclicality) × 10` |
| Company age | 5 | Years trading capped at 25, scaled to 0–5 pts |

---

### Blended Rating

`Blended score = 50% × normalised Z″ + 50% × multi-factor score`

This 50/50 blend balances the balance-sheet-focused Altman model (backward-looking) with the multi-factor score that incorporates forward-looking context (country, sector, age). The blended score maps to a grade and PD:

| Grade | Min score | Est. 12m PD | Tier |
|---|---|---|---|
| AAA | 90 | 0.02% | Investment |
| AA  | 82 | 0.06% | Investment |
| A   | 72 | 0.14% | Investment |
| BBB | 60 | 0.40% | Investment |
| BB  | 48 | 1.00% | Speculative |
| B   | 35 | 3.50% | Speculative |
| CCC | 22 | 10.0% | Speculative |
| CC  | 12 | 22.0% | Speculative |
| C   |  4 | 40.0% | Speculative |
| D   |  0 | 75.0% | Default |

---

## Compliance & monitoring flags

Each company is automatically tagged when a threshold is breached. Flags appear as coloured pills in the dossier and as dots in the table.

| Flag | Type | Trigger | What to do in practice |
|---|---|---|---|
| **Revenue Anomaly** | ANOMALY (blue) | Year-on-year revenue change > ±30% | Investigate cause — organic growth, acquisition, restatement, or fraud |
| **Negative Equity** | REGULATORY (purple) | Total equity < 0 | Regulatory insolvency review may be required; assess going concern |
| **High Leverage** | RISK (amber) | Debt/Assets > 85% | Review debt covenants, refinancing risk, and collateral |
| **Operating Loss** | RISK (amber) | EBIT < 0 | Assess whether losses are structural or temporary; review cash runway |
| **Enhanced Due Diligence** | REGULATORY (purple) | Country risk weight ≥ 20% | Apply enhanced KYC/AML procedures per FATF recommendations |
| **PD Above Threshold** | RISK (amber) | 12m PD > 5% | Exceeds typical origination threshold; escalate to credit committee |
| **Weak Debt Coverage** | RISK (amber) | DSCR < 1.5× | Assess refinancing risk and covenant headroom |

**Flag type colour coding:**
- 🟣 **REGULATORY** — triggers a mandatory compliance or legal review process
- 🔵 **ANOMALY** — unusual data pattern requiring investigation before action
- 🟡 **RISK** — financial risk signal; requires credit judgement

---

## Running the app locally

### Prerequisites

- **Node.js 18+** — download from https://nodejs.org (LTS version recommended)
- **npm** — included with Node.js
- **Git** — download from https://git-scm.com

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/rubenfm77/eurocredit.git
cd eurocredit

# 2. Install dependencies (React, Vite, and the React plugin — ~66 packages total)
npm install

# 3. Start the development server
npm run dev
```

Open **http://localhost:5173/eurocredit/** in your browser. The app loads instantly with no internet connection required (Google Fonts will load if online; the layout still works offline).

### Available commands

| Command | What it does |
|---|---|
| `npm run dev` | Start local dev server with hot-reload at localhost:5173 |
| `npm run build` | Build optimised production bundle into `dist/` |
| `npm run preview` | Serve the production build locally for testing |

### No connections required

The app is **fully self-contained**. There are no:
- API calls to external services
- Database connections
- Authentication flows
- Environment variables

Everything — company data, financial figures, ratings, and flags — is generated in-browser from a seeded random function in `src/data/companies.js`. The only external resource is **Google Fonts** (IBM Plex Sans + IBM Plex Mono), which loads from `fonts.googleapis.com` if you are online. If offline, the browser falls back to system monospace and sans-serif fonts gracefully.

---

## Deploying to GitHub Pages

### Automatic (recommended)

Every push to `main` triggers the GitHub Actions workflow in `.github/workflows/deploy.yml`, which:

1. Installs dependencies (`npm ci`)
2. Builds the production bundle (`npm run build`)
3. Publishes the `dist/` folder to GitHub Pages

No manual steps needed after the first setup. The live URL is always:
```
https://rubenfm77.github.io/eurocredit/
```

### First-time Pages setup

After creating the repository on GitHub:

1. Go to **Settings → Pages** in the repo
2. Under **Source**, select **GitHub Actions**
3. Push to `main` — the workflow runs automatically

### Manual deploy (alternative)

```bash
npm run build
npx gh-pages -d dist
```

This pushes the `dist/` folder to a `gh-pages` branch. Configure GitHub Pages to serve from that branch in repo settings.

---

## Data & going to production

### Current state — everything is synthetic

**No real company data exists in this app.** The 60 companies are generated deterministically by a seeded random-number generator (`mulberry32`, seed `0xc0ffee`) in `src/data/companies.js` using a word list and country-appropriate legal suffixes. Revenue, balance sheets, employee counts, and all financial ratios are fabricated. Do not use this application for any real credit decision.

### What a production version would need

A real version requires three things the demo omits:

#### 1. A company data source

The app needs real financial statements (balance sheet, income statement, cash flow) for each counterparty, refreshed at least annually or on filing events.

**Free / open sources (identity & public filings):**

| Source | Coverage | What it provides | How to connect |
|---|---|---|---|
| [GLEIF LEI API](https://www.gleif.org/en/lei-data/gleif-api) | Global | Legal entity identity, ownership (Level 1 & 2), registration status | REST API, no auth required |
| [UK Companies House API](https://developer-specs.company-information.service.gov.uk/) | UK | Filed accounts, directors, charges, insolvency events | REST API, free API key |
| [ECB Data Portal](https://data.ecb.europa.eu/) | EU | Sovereign spreads, country macro indicators, HICP | REST API, no auth |
| [Eurostat](https://ec.europa.eu/eurostat/web/json-and-unicode-web-services) | EU | National accounts, sector statistics | REST API, no auth |
| [ESMA FIRDS / EUISS](https://www.esma.europa.eu/data-and-reports) | EU | Public bond ratings, MAR disclosures, prospectuses | Bulk download + REST |
| [OpenCorporates](https://opencorporates.com/api) | 140+ jurisdictions | Company registration data | REST API, free tier |

**Commercial pan-European financials (the real workhorses):**

| Vendor | Strengths | Typical use case |
|---|---|---|
| **Bureau van Dijk Orbis** | 400M+ companies, structured financials, ownership trees, PD models | Enterprise credit analysis; broadest EU SME coverage |
| **Creditsafe** | Real-time scores, payment behaviour, credit limits | Automated credit decisioning, trade credit |
| **Dun & Bradstreet** | PAYDEX payment scores, global, strong SME data | Supply chain risk, procurement |
| **Moody's Analytics / CreditEdge** | EDF™ (Expected Default Frequency) models, sovereign risk | Bank IRB models, regulatory capital |
| **S&P Market Intelligence** | Deep financials, public company focus | Capital markets, investor-grade analysis |
| **Refinitiv / LSEG** | Market data + ESG scores + credit analytics | Integrated into trading workflows |

**Integration pattern for a real app:**

```
Data vendor API → ingestion pipeline (Python / Node ETL)
  → structured DB (PostgreSQL / BigQuery)
    → rating engine (Python / R)
      → REST/GraphQL API
        → this React frontend
```

Incremental updates would be triggered by filing events (XBRL submissions, gazette notices) rather than polling.

#### 2. A secure backend

Replacing the in-browser data generator requires:

- A server (Node.js/Python/Go) to hold API credentials securely
- A database to persist company records, ratings history, and flag audit trails
- Authentication for the frontend (OAuth 2.0 / OIDC)
- Rate-limiting and caching to avoid hammering data vendor APIs

#### 3. Model validation

A production rating model must be backtested against historical default data to demonstrate predictive power (Gini coefficient / AUROC). The Altman Z″ thresholds used here are from the original 1995 paper and have not been recalibrated for current market conditions or the specific portfolio in question.

---

## Legal & regulatory note

### EU AI Act

Any system that **automates creditworthiness scoring of individuals** (including sole traders and micro-businesses treated as natural persons) is classified as a **high-risk AI system** under the EU AI Act (Annex III, § 5b). Obligations include:

- Human oversight and the right to a meaningful explanation of any decision (Article 14)
- Technical documentation and post-market monitoring logs (Articles 11–12)
- Conformity assessment before deployment (Article 43)
- Registration in the EU AI Act database (Article 49)

This app analyses **synthetic companies only** and does not score individuals, so these provisions do not directly apply to this demo.

### GDPR

Any processing of personal data relating to directors, beneficial owners, or individual guarantors requires a lawful basis under GDPR (Article 6). In a production context:

- Legitimate interest (Article 6(1)(f)) is the most common basis for B2B credit checks
- Data subjects have rights of access, rectification, and erasure
- Cross-border transfers (e.g. using a US-headquartered data vendor) require adequacy decisions or Standard Contractual Clauses

### Basel III / CRR II (for banks)

Banks using this type of tool for regulatory capital calculations must comply with the Capital Requirements Regulation (CRR II). Internal Rating-Based (IRB) models require supervisory approval, annual validation, and must meet minimum standards for PD estimation, LGD, EAD, and stress testing.

---

*EuroCredit is an open-source demonstration project. Not investment advice. All data is synthetic.*
