import { COUNTRIES, SECTORS } from '../data/companies.js';

const GRADES = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C', 'D'];
const SORT_OPTIONS = [
  { value: 'name_asc',    label: 'Name A–Z' },
  { value: 'name_desc',   label: 'Name Z–A' },
  { value: 'pd_asc',      label: 'PD Low–High' },
  { value: 'pd_desc',     label: 'PD High–Low' },
  { value: 'revenue_desc',label: 'Revenue ↓' },
  { value: 'grade_asc',   label: 'Grade Best–Worst' },
  { value: 'flags_desc',  label: 'Most Flags' },
];

const S = {
  bar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    padding: '10px 24px',
    background: '#0d111a',
    borderBottom: '1px solid #1e2535',
    alignItems: 'center',
    flexShrink: 0,
  },
  select: {
    background: '#111825',
    border: '1px solid #1e2535',
    borderRadius: 5,
    color: '#c8cfd8',
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 12,
    padding: '5px 10px',
    cursor: 'pointer',
    outline: 'none',
    height: 30,
  },
  toggle: (active) => ({
    background: active ? '#0f1f48' : '#111825',
    border: `1px solid ${active ? '#3b6ef0' : '#1e2535'}`,
    borderRadius: 5,
    color: active ? '#3b6ef0' : '#8899bb',
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 12,
    padding: '5px 12px',
    cursor: 'pointer',
    height: 30,
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  }),
  label: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    color: '#4e5d78',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginRight: 2,
  },
  searchInput: {
    background: '#111825',
    border: '1px solid #1e2535',
    borderRadius: 5,
    color: '#c8cfd8',
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 12,
    padding: '5px 10px',
    outline: 'none',
    height: 30,
    width: 160,
  },
};

export default function FilterBar({ filters, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  const toggle = (key) => () => onChange({ ...filters, [key]: !filters[key] });

  return (
    <div style={S.bar}>
      <span style={S.label}>Filter</span>

      <input
        style={S.searchInput}
        placeholder="Search name…"
        value={filters.search}
        onChange={set('search')}
      />

      <select style={S.select} value={filters.country} onChange={set('country')}>
        <option value="">All Countries</option>
        {COUNTRIES.map(c => (
          <option key={c.code} value={c.name}>{c.name}</option>
        ))}
      </select>

      <select style={S.select} value={filters.sector} onChange={set('sector')}>
        <option value="">All Sectors</option>
        {SECTORS.map(s => (
          <option key={s.name} value={s.name}>{s.name}</option>
        ))}
      </select>

      <select style={S.select} value={filters.maxGrade} onChange={set('maxGrade')}>
        <option value="">Max Grade</option>
        {GRADES.map(g => (
          <option key={g} value={g}>{g} and below</option>
        ))}
      </select>

      <span style={{ ...S.label, marginLeft: 4 }}>Sort</span>
      <select style={S.select} value={filters.sort} onChange={set('sort')}>
        {SORT_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <button style={S.toggle(filters.flaggedOnly)} onClick={toggle('flaggedOnly')}>
        Flagged Only
      </button>
      <button style={S.toggle(filters.distressOnly)} onClick={toggle('distressOnly')}>
        Distress Zone
      </button>
    </div>
  );
}
