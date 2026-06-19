// ─── Altman Z″ Score (non-manufacturing / emerging-market variant) ─────────────
// Z = 6.56·(WC/TA) + 3.26·(RE/TA) + 6.72·(EBIT/TA) + 1.05·(Equity/Liabilities)
function altmanZ(company) {
  const { workingCapitalMln, retainedEarningsMln, ebitMln, totalAssetsMln,
          equityMln, totalLiabilitiesMln } = company;
  if (totalAssetsMln <= 0) return 0;
  const liab = totalLiabilitiesMln <= 0 ? 0.001 : totalLiabilitiesMln;
  const x1 = workingCapitalMln / totalAssetsMln;
  const x2 = retainedEarningsMln / totalAssetsMln;
  const x3 = ebitMln / totalAssetsMln;
  const x4 = equityMln / liab;
  return 6.56 * x1 + 3.26 * x2 + 6.72 * x3 + 1.05 * x4;
}

function zBand(z) {
  if (z > 2.6) return 'Safe';
  if (z >= 1.1) return 'Grey';
  return 'Distress';
}

// Normalize Z to 0–100 (clamp raw range roughly -2 to 6)
function normalizeZ(z) {
  const clamped = Math.max(-2, Math.min(6, z));
  return ((clamped + 2) / 8) * 100;
}

// ─── Multi-factor score (0–100) ───────────────────────────────────────────────
function multiFactor(company) {
  const { totalLiabilitiesMln, totalAssetsMln, ebitMln, revenueMln,
          opCashFlowMln, countryRiskWeight, sectorCyclicality, yearsTrading } = company;

  const leverage = totalAssetsMln > 0 ? totalLiabilitiesMln / totalAssetsMln : 1;
  const leverageScore = Math.max(0, (1 - leverage)) * 25;

  const ebitMargin = revenueMln > 0 ? ebitMln / revenueMln : -0.1;
  const ebitClamped = Math.max(-0.1, Math.min(0.25, ebitMargin));
  const ebitScore = ((ebitClamped + 0.1) / 0.35) * 25;

  // Debt-service coverage proxy: opCashFlow / (liabilities * assumed avg cost 5%)
  const annualDebtCost = totalLiabilitiesMln * 0.05;
  const dsc = annualDebtCost > 0 ? opCashFlowMln / annualDebtCost : 3;
  const dscClamped = Math.max(0, Math.min(4, dsc));
  const dscScore = (dscClamped / 4) * 20;

  const countryScore = (1 - Math.min(countryRiskWeight, 1)) * 15;
  const sectorScore = (1 - sectorCyclicality) * 10;
  const ageScore = (Math.min(yearsTrading, 25) / 25) * 5;

  return Math.min(100, Math.max(0,
    leverageScore + ebitScore + dscScore + countryScore + sectorScore + ageScore
  ));
}

// ─── Grade & PD mapping ───────────────────────────────────────────────────────
const GRADE_TABLE = [
  { grade: 'AAA', minScore: 90, pd: 0.02 },
  { grade: 'AA',  minScore: 82, pd: 0.06 },
  { grade: 'A',   minScore: 72, pd: 0.14 },
  { grade: 'BBB', minScore: 60, pd: 0.40 },
  { grade: 'BB',  minScore: 48, pd: 1.00 },
  { grade: 'B',   minScore: 35, pd: 3.50 },
  { grade: 'CCC', minScore: 22, pd: 10.0 },
  { grade: 'CC',  minScore: 12, pd: 22.0 },
  { grade: 'C',   minScore:  4, pd: 40.0 },
  { grade: 'D',   minScore:  0, pd: 75.0 },
];

function scoreToGrade(blended) {
  for (const row of GRADE_TABLE) {
    if (blended >= row.minScore) return row;
  }
  return GRADE_TABLE[GRADE_TABLE.length - 1];
}

// ─── Compliance flags ─────────────────────────────────────────────────────────
export const FLAG_DEFS = {
  REVENUE_ANOMALY:    { label: 'Revenue Anomaly',         type: 'ANOMALY',    desc: 'YoY revenue change > ±30%' },
  NEGATIVE_EQUITY:    { label: 'Negative Equity',         type: 'REGULATORY', desc: 'Equity < 0; regulatory insolvency review triggered' },
  HIGH_LEVERAGE:      { label: 'High Leverage',           type: 'RISK',       desc: 'Debt/assets > 85%' },
  OPERATING_LOSS:     { label: 'Operating Loss',          type: 'RISK',       desc: 'EBIT < 0' },
  ELEVATED_COUNTRY:   { label: 'Enhanced Due Diligence',  type: 'REGULATORY', desc: 'Elevated country risk weight ≥ 0.20' },
  HIGH_PD:            { label: 'PD Above Threshold',      type: 'RISK',       desc: 'Estimated 12-month PD exceeds 5% origination limit' },
  WEAK_DSC:           { label: 'Weak Debt Coverage',      type: 'RISK',       desc: 'Debt-service coverage ratio < 1.5×' },
};

function detectFlags(company, pd) {
  const flags = [];
  const { revenueMln, priorRevenueMln, equityMln, totalLiabilitiesMln,
          totalAssetsMln, ebitMln, opCashFlowMln, countryRiskWeight } = company;

  const yoy = priorRevenueMln > 0 ? Math.abs((revenueMln - priorRevenueMln) / priorRevenueMln) : 0;
  if (yoy > 0.30) flags.push('REVENUE_ANOMALY');
  if (equityMln < 0) flags.push('NEGATIVE_EQUITY');
  if (totalAssetsMln > 0 && totalLiabilitiesMln / totalAssetsMln > 0.85) flags.push('HIGH_LEVERAGE');
  if (ebitMln < 0) flags.push('OPERATING_LOSS');
  if (countryRiskWeight >= 0.20) flags.push('ELEVATED_COUNTRY');
  if (pd > 5) flags.push('HIGH_PD');

  const annualDebtCost = totalLiabilitiesMln * 0.05;
  if (annualDebtCost > 0 && opCashFlowMln / annualDebtCost < 1.5) flags.push('WEAK_DSC');

  return flags;
}

// ─── Public API ───────────────────────────────────────────────────────────────
export function rateCompany(company) {
  const z = altmanZ(company);
  const zNorm = normalizeZ(z);
  const mf = multiFactor(company);
  const blended = 0.5 * zNorm + 0.5 * mf;
  const { grade, pd } = scoreToGrade(blended);
  const flags = detectFlags(company, pd);

  const leverage = company.totalAssetsMln > 0
    ? company.totalLiabilitiesMln / company.totalAssetsMln
    : 0;
  const ebitMargin = company.revenueMln > 0
    ? company.ebitMln / company.revenueMln
    : 0;
  const annualDebtCost = company.totalLiabilitiesMln * 0.05;
  const dsc = annualDebtCost > 0 ? company.opCashFlowMln / annualDebtCost : 99;
  const yoyChange = company.priorRevenueMln > 0
    ? (company.revenueMln - company.priorRevenueMln) / company.priorRevenueMln
    : 0;

  return {
    z,
    zBand: zBand(z),
    zNorm,
    mf,
    blended,
    grade,
    pd,
    flags,
    ratios: { leverage, ebitMargin, dsc, yoyChange },
  };
}

export function rateAll(companies) {
  return companies.map(c => ({ ...c, rating: rateCompany(c) }));
}

export function isInvestmentGrade(grade) {
  return ['AAA', 'AA', 'A', 'BBB'].includes(grade);
}

export { GRADE_TABLE };
