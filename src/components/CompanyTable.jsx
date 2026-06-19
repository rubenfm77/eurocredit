import { useState } from 'react';
import { FLAG_DEFS } from '../engine/rating.js';

function gradeColor(grade) {
  if (['AAA', 'AA', 'A'].includes(grade)) return '#22c55e';
  if (['BBB'].includes(grade)) return '#4ade80';
  if (['BB', 'B'].includes(grade)) return '#f59e0b';
  if (['CCC', 'CC'].includes(grade)) return '#f97316';
  return '#ef4444';
}

function flagTypeColor(type) {
  if (type === 'REGULATORY') return '#a78bfa';
  if (type === 'ANOMALY') return '#38bdf8';
  return '#f59e0b';
}

const S = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
  },
  tableWrap: {
    overflowY: 'auto',
    flex: 1,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
  },
  th: {
    padding: '8px 12px',
    textAlign: 'left',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    fontWeight: 500,
    color: '#4e5d78',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    background: '#0d111a',
    borderBottom: '1px solid #1e2535',
    position: 'sticky',
    top: 0,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
  },
  thRight: {
    textAlign: 'right',
  },
  row: (selected, hovered) => ({
    background: selected ? '#0f1f48' : hovered ? '#111825' : 'transparent',
    borderBottom: '1px solid #1a2030',
    cursor: 'pointer',
    transition: 'background 0.1s',
  }),
  td: {
    padding: '8px 12px',
    color: '#c8cfd8',
    whiteSpace: 'nowrap',
  },
  tdRight: {
    textAlign: 'right',
  },
  gradePill: (grade) => ({
    display: 'inline-block',
    minWidth: 36,
    textAlign: 'center',
    padding: '1px 6px',
    borderRadius: 3,
    fontWeight: 600,
    fontSize: 11,
    color: gradeColor(grade),
    background: `${gradeColor(grade)}18`,
    border: `1px solid ${gradeColor(grade)}40`,
  }),
  flagDot: (type) => ({
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: flagTypeColor(type),
    marginRight: 3,
  }),
  empty: {
    padding: 40,
    textAlign: 'center',
    color: '#4e5d78',
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 13,
  },
};

const COLS = [
  { key: 'name',    label: 'Company',      right: false },
  { key: 'country', label: 'Country',      right: false },
  { key: 'sector',  label: 'Sector',       right: false },
  { key: 'grade',   label: 'Rating',       right: true  },
  { key: 'pd',      label: 'PD 12m',       right: true  },
  { key: 'revenue', label: 'Rev (M€)',      right: true  },
  { key: 'flags',   label: 'Flags',        right: false },
];

export default function CompanyTable({ companies, selectedId, onSelect }) {
  const [hovered, setHovered] = useState(null);

  if (companies.length === 0) {
    return <div style={S.empty}>No companies match the current filters.</div>;
  }

  return (
    <div style={S.wrapper}>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              {COLS.map(col => (
                <th
                  key={col.key}
                  style={{ ...S.th, ...(col.right ? S.thRight : {}) }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {companies.map(c => {
              const { grade, pd, flags } = c.rating;
              const isSelected = c.id === selectedId;
              const isHovered = c.id === hovered;
              return (
                <tr
                  key={c.id}
                  style={S.row(isSelected, isHovered)}
                  onClick={() => onSelect(c.id)}
                  onMouseEnter={() => setHovered(c.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <td style={S.td}>
                    <span style={{ color: isSelected ? '#7ba4f7' : '#c8cfd8' }}>{c.name}</span>
                  </td>
                  <td style={S.td}>
                    <span style={{ color: '#8899bb' }}>{c.countryCode}</span>{' '}
                    {c.country}
                  </td>
                  <td style={{ ...S.td, color: '#8899bb' }}>{c.sector}</td>
                  <td style={{ ...S.td, ...S.tdRight }}>
                    <span style={S.gradePill(grade)}>{grade}</span>
                  </td>
                  <td style={{ ...S.td, ...S.tdRight, color: gradeColor(grade) }}>
                    {pd.toFixed(2)}%
                  </td>
                  <td style={{ ...S.td, ...S.tdRight }}>
                    {c.revenueMln.toLocaleString('en-EU', { maximumFractionDigits: 1 })}
                  </td>
                  <td style={S.td}>
                    {flags.slice(0, 3).map(f => (
                      <span key={f} title={FLAG_DEFS[f].label}>
                        <span style={S.flagDot(FLAG_DEFS[f].type)} />
                      </span>
                    ))}
                    {flags.length > 3 && (
                      <span style={{ color: '#4e5d78', fontSize: 10 }}>+{flags.length - 3}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
