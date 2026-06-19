import { isInvestmentGrade } from '../engine/rating.js';

const S = {
  strip: {
    display: 'flex',
    gap: 1,
    background: '#0d111a',
    borderBottom: '1px solid #1e2535',
    padding: '0 24px',
    flexShrink: 0,
  },
  cell: {
    padding: '10px 20px 10px 0',
    minWidth: 130,
  },
  label: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    color: '#4e5d78',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: 3,
  },
  value: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 20,
    fontWeight: 500,
    color: '#e8edf5',
    letterSpacing: '-0.5px',
  },
  sub: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 11,
    color: '#4e5d78',
    marginTop: 1,
  },
  divider: {
    width: 1,
    background: '#1e2535',
    margin: '8px 20px 8px 0',
    flexShrink: 0,
  },
};

function Stat({ label, value, sub, valueColor }) {
  return (
    <>
      <div style={S.cell}>
        <div style={S.label}>{label}</div>
        <div style={{ ...S.value, color: valueColor || '#e8edf5' }}>{value}</div>
        {sub && <div style={S.sub}>{sub}</div>}
      </div>
      <div style={S.divider} />
    </>
  );
}

export default function SummaryStrip({ companies }) {
  const total = companies.length;
  const avgPd = companies.reduce((s, c) => s + c.rating.pd, 0) / (total || 1);
  const igCount = companies.filter(c => isInvestmentGrade(c.rating.grade)).length;
  const flagCount = companies.reduce((s, c) => s + c.rating.flags.length, 0);
  const igPct = total > 0 ? Math.round((igCount / total) * 100) : 0;

  const pdColor = avgPd < 1 ? '#22c55e' : avgPd < 5 ? '#f59e0b' : '#ef4444';
  const flagColor = flagCount === 0 ? '#22c55e' : flagCount < 20 ? '#f59e0b' : '#ef4444';

  return (
    <div style={S.strip}>
      <Stat label="Counterparties" value={total} sub="in portfolio" />
      <Stat label="Avg 12m PD" value={`${avgPd.toFixed(2)}%`} sub="probability of default" valueColor={pdColor} />
      <Stat label="Investment Grade" value={`${igCount}`} sub={`${igPct}% of portfolio`} valueColor="#22c55e" />
      <Stat label="Active Flags" value={flagCount} sub="compliance & risk" valueColor={flagColor} />
    </div>
  );
}
