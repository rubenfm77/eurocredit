// Seeded pseudo-random number generator (mulberry32)
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const COUNTRIES = [
  { name: 'Germany',     code: 'DE', riskWeight: 0.05, suffixes: ['GmbH', 'AG', 'KG'] },
  { name: 'France',      code: 'FR', riskWeight: 0.08, suffixes: ['SAS', 'SA', 'SARL'] },
  { name: 'Netherlands', code: 'NL', riskWeight: 0.06, suffixes: ['B.V.', 'N.V.'] },
  { name: 'Spain',       code: 'ES', riskWeight: 0.15, suffixes: ['S.A.', 'S.L.'] },
  { name: 'Italy',       code: 'IT', riskWeight: 0.18, suffixes: ['S.p.A.', 'S.r.l.', 'S.A.'] },
  { name: 'Portugal',    code: 'PT', riskWeight: 0.20, suffixes: ['S.A.', 'Lda.'] },
  { name: 'Poland',      code: 'PL', riskWeight: 0.22, suffixes: ['S.A.', 'Sp. z o.o.'] },
  { name: 'Sweden',      code: 'SE', riskWeight: 0.06, suffixes: ['AB', 'HB'] },
  { name: 'Ireland',     code: 'IE', riskWeight: 0.12, suffixes: ['Ltd', 'plc', 'DAC'] },
  { name: 'Greece',      code: 'GR', riskWeight: 0.35, suffixes: ['S.A.', 'E.P.E.'] },
  { name: 'Austria',     code: 'AT', riskWeight: 0.07, suffixes: ['GmbH', 'AG'] },
  { name: 'Belgium',     code: 'BE', riskWeight: 0.09, suffixes: ['NV', 'SA', 'BV'] },
];

export const SECTORS = [
  { name: 'Technology',          cyclicality: 0.30 },
  { name: 'Manufacturing',       cyclicality: 0.50 },
  { name: 'Retail',              cyclicality: 0.45 },
  { name: 'Energy',              cyclicality: 0.60 },
  { name: 'Healthcare',          cyclicality: 0.15 },
  { name: 'Financial Services',  cyclicality: 0.55 },
  { name: 'Construction',        cyclicality: 0.65 },
  { name: 'Logistics',           cyclicality: 0.45 },
  { name: 'Hospitality',         cyclicality: 0.70 },
  { name: 'Agriculture',         cyclicality: 0.40 },
  { name: 'Pharmaceuticals',     cyclicality: 0.10 },
  { name: 'Telecom',             cyclicality: 0.25 },
];

const WORD_LIST = [
  'Apex', 'Atlas', 'Aura', 'Aurora', 'Axion', 'Baltic', 'Beacon', 'Bridge',
  'Capital', 'Cascade', 'Crest', 'Crown', 'Delta', 'Dune', 'Eagle', 'Eden',
  'Elite', 'Empire', 'Euro', 'Faro', 'Ferro', 'Finex', 'Flint', 'Forte',
  'Fusion', 'Galax', 'Genex', 'Global', 'Granite', 'Haven', 'Helix', 'Helm',
  'Hermes', 'Horizon', 'Hydra', 'Ibex', 'Iris', 'Ista', 'Kern', 'Kite',
  'Lato', 'Lenis', 'Link', 'Lumen', 'Lynx', 'Mach', 'Magna', 'Matrix',
  'Maxon', 'Meridian', 'Metro', 'Mira', 'Modo', 'Monza', 'Mosaic', 'Nexus',
  'Nordic', 'Nova', 'Onyx', 'Open', 'Orea', 'Orion', 'Oskar', 'Paxo',
  'Peak', 'Pilot', 'Pivot', 'Plaza', 'Porto', 'Prism', 'Proton', 'Pulse',
  'Quant', 'Quark', 'Radius', 'Rapid', 'Reef', 'Regal', 'Relay', 'Renix',
  'Rhone', 'Ridge', 'Riva', 'Rondo', 'Sable', 'Saga', 'Scala', 'Scope',
  'Senso', 'Sigma', 'Solar', 'Sonar', 'Spark', 'Spire', 'Sprint', 'Strive',
  'Summit', 'Surge', 'Talon', 'Terra', 'Titan', 'Torex', 'Trace', 'Track',
  'Trans', 'Triad', 'Trion', 'Unity', 'Valor', 'Vanta', 'Vario', 'Vector',
  'Velox', 'Venta', 'Vera', 'Verex', 'Veris', 'Verox', 'Vertex', 'Vesta',
  'Vibe', 'Vigor', 'Vitex', 'Vivo', 'Volta', 'Vortex', 'Voya', 'Weld',
  'Xara', 'Xeno', 'Xenon', 'Xion', 'Zara', 'Zeal', 'Zenit', 'Zeta',
];

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function randBetween(min, max, rng) {
  return min + rng() * (max - min);
}

function generateCompany(id, rng) {
  const country = COUNTRIES[id % COUNTRIES.length];
  const sector = SECTORS[id % SECTORS.length];

  const w1 = pick(WORD_LIST, rng);
  const w2 = rng() > 0.45 ? pick(WORD_LIST, rng) : '';
  const suffix = pick(country.suffixes, rng);
  const name = w2 ? `${w1} ${w2} ${suffix}` : `${w1} ${suffix}`;

  const revenueMln = Math.round(randBetween(30, 4800, rng) * 10) / 10;
  const revenueGrowth = randBetween(-0.30, 0.40, rng);
  const priorRevenueMln = Math.round(revenueMln / (1 + revenueGrowth) * 10) / 10;

  const assetMultiplier = randBetween(0.6, 3.2, rng);
  const totalAssetsMln = Math.round(revenueMln * assetMultiplier * 10) / 10;

  const leverageRatio = randBetween(0.25, 0.92, rng);
  const totalLiabilitiesMln = Math.round(totalAssetsMln * leverageRatio * 10) / 10;
  const equityMln = Math.round((totalAssetsMln - totalLiabilitiesMln) * 10) / 10;

  const ebitMargin = randBetween(-0.08, 0.22, rng);
  const ebitMln = Math.round(revenueMln * ebitMargin * 10) / 10;

  // retained earnings as proxy: cumulative fraction of equity
  const retainedEarningsMln = Math.round(equityMln * randBetween(0.1, 0.85, rng) * 10) / 10;

  // working capital: current assets - current liabilities (fraction of total assets)
  const currentAssetRatio = randBetween(0.20, 0.55, rng);
  const currentLiabRatio = randBetween(0.10, currentAssetRatio * 0.95, rng);
  const workingCapitalMln = Math.round(totalAssetsMln * (currentAssetRatio - currentLiabRatio) * 10) / 10;

  const mvEquityMln = Math.round(equityMln * randBetween(0.4, 3.0, rng) * 10) / 10;
  const opCashFlowMln = Math.round(ebitMln * randBetween(0.6, 1.4, rng) * 10) / 10;

  const employees = Math.round(randBetween(50, 45000, rng));
  const yearsTrading = Math.round(randBetween(2, 80, rng));

  return {
    id,
    name,
    country: country.name,
    countryCode: country.code,
    countryRiskWeight: country.riskWeight,
    sector: sector.name,
    sectorCyclicality: sector.cyclicality,
    revenueMln,
    priorRevenueMln,
    totalAssetsMln,
    totalLiabilitiesMln,
    equityMln,
    ebitMln,
    retainedEarningsMln,
    workingCapitalMln,
    mvEquityMln,
    opCashFlowMln,
    employees,
    yearsTrading,
  };
}

// Generate 60 companies deterministically with seed 0xc0ffee
const rng = mulberry32(0xc0ffee);
export const COMPANIES = Array.from({ length: 60 }, (_, i) => generateCompany(i, rng));
