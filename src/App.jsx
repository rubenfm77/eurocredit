import { useState, useMemo } from 'react';
import { COMPANIES } from './data/companies.js';
import { rateAll, isInvestmentGrade } from './engine/rating.js';
import Header from './components/Header.jsx';
import SummaryStrip from './components/SummaryStrip.jsx';
import FilterBar from './components/FilterBar.jsx';
import CompanyTable from './components/CompanyTable.jsx';
import Dossier from './components/Dossier.jsx';

const GRADE_ORDER = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C', 'D'];
const RATED = rateAll(COMPANIES);

const DEFAULT_FILTERS = {
  search: '',
  country: '',
  sector: '',
  maxGrade: '',
  sort: 'pd_asc',
  flaggedOnly: false,
  distressOnly: false,
};

function applyFilters(companies, filters) {
  let list = companies;

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(c => c.name.toLowerCase().includes(q));
  }
  if (filters.country) list = list.filter(c => c.country === filters.country);
  if (filters.sector)  list = list.filter(c => c.sector === filters.sector);
  if (filters.flaggedOnly) list = list.filter(c => c.rating.flags.length > 0);
  if (filters.distressOnly) list = list.filter(c => c.rating.zBand === 'Distress');
  if (filters.maxGrade) {
    const maxIdx = GRADE_ORDER.indexOf(filters.maxGrade);
    list = list.filter(c => GRADE_ORDER.indexOf(c.rating.grade) >= maxIdx);
  }

  const { sort } = filters;
  return [...list].sort((a, b) => {
    if (sort === 'name_asc')    return a.name.localeCompare(b.name);
    if (sort === 'name_desc')   return b.name.localeCompare(a.name);
    if (sort === 'pd_asc')      return a.rating.pd - b.rating.pd;
    if (sort === 'pd_desc')     return b.rating.pd - a.rating.pd;
    if (sort === 'revenue_desc')return b.revenueMln - a.revenueMln;
    if (sort === 'grade_asc')   return GRADE_ORDER.indexOf(a.rating.grade) - GRADE_ORDER.indexOf(b.rating.grade);
    if (sort === 'flags_desc')  return b.rating.flags.length - a.rating.flags.length;
    return 0;
  });
}

const S = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 55%',
    minWidth: 0,
    borderRight: '1px solid #1e2535',
    overflow: 'hidden',
  },
  right: {
    flex: '0 0 45%',
    minWidth: 0,
    overflow: 'hidden',
    background: '#0a0d12',
  },
  tableCount: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    color: '#4e5d78',
    padding: '6px 24px',
    background: '#0a0d12',
    borderBottom: '1px solid #1a2030',
    flexShrink: 0,
  },
  footer: {
    borderTop: '1px solid #1e2535',
    padding: '8px 24px',
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 10,
    color: '#2e3a50',
    background: '#0a0d12',
    flexShrink: 0,
    textAlign: 'center',
    lineHeight: 1.6,
  },
};

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => applyFilters(RATED, filters), [filters]);
  const selected = useMemo(() => RATED.find(c => c.id === selectedId) || null, [selectedId]);

  const handleSelect = (id) => {
    setSelectedId(prev => prev === id ? null : id);
  };

  return (
    <div style={S.app}>
      <Header />
      <SummaryStrip companies={RATED} />
      <FilterBar filters={filters} onChange={setFilters} />
      <div style={S.body}>
        <div style={S.left}>
          <div style={S.tableCount}>
            {filtered.length} of {RATED.length} counterparties
          </div>
          <CompanyTable companies={filtered} selectedId={selectedId} onSelect={handleSelect} />
        </div>
        <div style={S.right}>
          <Dossier company={selected} />
        </div>
      </div>
      <footer style={S.footer}>
        DISCLAIMER: All company data displayed in EuroCredit is entirely synthetic and generated algorithmically for demonstration purposes only.
        No real company is represented. This application does not constitute investment advice, credit analysis, or a regulatory assessment.
        Ratings and probability-of-default figures are illustrative outputs of a simplified model and must not be used for any real-world credit decision.
      </footer>
    </div>
  );
}
