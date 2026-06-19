import { FLAG_DEFS } from '../engine/rating.js';

function gradeColor(grade) {
  if (['AAA', 'AA', 'A'].includes(grade)) return '#22c55e';
  if (['BBB'].includes(grade)) return '#4ade80';
  if (['BB', 'B'].includes(grade)) return '#f59e0b';
  if (['CCC', 'CC'].includes(grade)) return '#f97316';
  return '#ef4444';
}

function flagBg(type) {
  if (type === 'REGULATORY') return { bg: '#1a1040', border: '#6d28d9', text: '#a78bfa' };
  if (type === 'ANOMALY')    return { bg: '#0c1e30', border: '#0369a1', text: '#38bdf8' };
  return { bg: '#1c1400', border: '#92400e', text: '#f59e0b' };
}

function Bar({ label, value, max, color, format }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: '#8899bb' }}>{label}</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#c8cfd8' }}>
          {format ? format(value) : value.toFixed(2)}
        </span>
      </div>
      <div style={{ height: 5, background: '#1e2535', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10,
        color: '#4e5d78',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        marginBottom: 10,
        paddingBottom: 6,
        borderBottom: '1px solid #1a2030',
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Kv({ label, value, mono, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'baseline' }}>
      <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: '#8899bb' }}>{label}</span>
      <span style={{
        fontFamily: mono !== false ? "'IBM Plex Mono', monospace" : "'IBM Plex Sans', sans-serif",
        fontSize: 12,
        color: color || '#c8cfd8',
      }}>
        {value}
      </span>
    </div>
  );
}

function fmt(n) {
  if (Math.abs(n) >= 1000) return `€${(n / 1000).toFixed(1)}B`;
  return `€${n.toFixed(1)}M`;
}

function pct(n) {
  return `${(n * 100).toFixed(1)}%`;
}

const S = {
  wrapper: {
    height: '100%',
    overflowY: 'auto',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  empty: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 12,
    color: '#4e5d78',
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 13,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  companyName: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 600,
    fontSize: 16,
    color: '#e8edf5',
    lineHeight: 1.3,
    flex: 1,
    paddingRight: 12,
  },
  gradeBig: (grade) => ({
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 700,
    fontSize: 28,
    color: gradeColor(grade),
    lineHeight: 1,
  }),
  meta: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 11,
    color: '#4e5d78',
    marginBottom: 16,
  },
  pdRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 20,
  },
  pdCard: (color) => ({
    flex: 1,
    background: '#0d111a',
    border: `1px solid ${color}30`,
    borderRadius: 6,
    padding: '10px 14px',
  }),
  pdLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9,
    color: '#4e5d78',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginBottom: 4,
  },
  pdValue: (color) => ({
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 600,
    fontSize: 18,
    color: color,
  }),
  flagPill: (type) => {
    const c = flagBg(type);
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 4,
      padding: '4px 8px',
      marginBottom: 6,
      marginRight: 6,
    };
  },
  flagLabel: (type) => ({
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 11,
    fontWeight: 500,
    color: flagBg(type).text,
  }),
  flagType: (type) => ({
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9,
    color: flagBg(type).text,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  }),
  zBandPill: (band) => {
    const colors = { Safe: '#22c55e', Grey: '#f59e0b', Distress: '#ef4444' };
    const c = colors[band] || '#8899bb';
    return {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      background: `${c}18`,
      border: `1px solid ${c}40`,
      color: c,
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 11,
      fontWeight: 600,
    };
  },
};

export default function Dossier({ company }) {
  if (!company) {
    return (
      <div style={S.empty}>
        <div style={{ fontSize: 32 }}>←</div>
        <div>Select a counterparty to view its credit dossier</div>
      </div>
    );
  }

  const { rating } = company;
  const { z, zBand, zNorm, mf, blended, grade, pd, flags, ratios } = rating;
  const gc = gradeColor(grade);

  const leverage = ratios.leverage;
  const ebitMargin = ratios.ebitMargin;
  const dsc = ratios.dsc;
  const yoyChange = ratios.yoyChange;

  return (
    <div style={S.wrapper}>
      {/* Header */}
      <div style={S.nameRow}>
        <div style={S.companyName}>{company.name}</div>
        <div style={S.gradeBig(grade)}>{grade}</div>
      </div>
      <div style={S.meta}>
        {company.country} · {company.sector} · {company.yearsTrading} yrs trading · {company.employees.toLocaleString()} employees
      </div>

      {/* PD + Score Cards */}
      <div style={S.pdRow}>
        <div style={S.pdCard(gc)}>
          <div style={S.pdLabel}>12m PD</div>
          <div style={S.pdValue(gc)}>{pd.toFixed(2)}%</div>
        </div>
        <div style={S.pdCard('#3b6ef0')}>
          <div style={S.pdLabel}>Blended Score</div>
          <div style={S.pdValue('#3b6ef0')}>{blended.toFixed(1)}</div>
        </div>
        <div style={S.pdCard(zBand === 'Safe' ? '#22c55e' : zBand === 'Grey' ? '#f59e0b' : '#ef4444')}>
          <div style={S.pdLabel}>Altman Z″</div>
          <div style={S.pdValue(zBand === 'Safe' ? '#22c55e' : zBand === 'Grey' ? '#f59e0b' : '#ef4444')}>
            {z.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <Section title="Rating Breakdown">
        <Bar label="Altman Z″ (normalised)" value={zNorm} max={100} color="#3b6ef0"
             format={v => `${v.toFixed(1)} / 100`} />
        <Bar label="Multi-factor score" value={mf} max={100} color="#6366f1"
             format={v => `${v.toFixed(1)} / 100`} />
        <Bar label="Blended score (50/50)" value={blended} max={100} color={gc}
             format={v => `${v.toFixed(1)} / 100`} />
        <div style={{ marginTop: 6 }}>
          <Kv label="Altman Z″ band" value={<span style={S.zBandPill(zBand)}>{zBand}</span>} mono={false} />
        </div>
      </Section>

      {/* Financial Ratios */}
      <Section title="Key Ratios">
        <Bar label="Leverage (Debt/Assets)"
             value={leverage * 100} max={100}
             color={leverage > 0.85 ? '#ef4444' : leverage > 0.6 ? '#f59e0b' : '#22c55e'}
             format={v => `${v.toFixed(1)}%`} />
        <Bar label="EBIT Margin"
             value={Math.max(0, ebitMargin * 100)} max={30}
             color={ebitMargin < 0 ? '#ef4444' : ebitMargin < 0.05 ? '#f59e0b' : '#22c55e'}
             format={() => `${(ebitMargin * 100).toFixed(1)}%`} />
        <Bar label="Debt-Service Coverage"
             value={Math.min(dsc, 6)} max={6}
             color={dsc < 1.5 ? '#ef4444' : dsc < 2.5 ? '#f59e0b' : '#22c55e'}
             format={() => `${dsc > 50 ? '> 50' : dsc.toFixed(1)}×`} />
        <Bar label="Country Risk"
             value={company.countryRiskWeight * 100} max={50}
             color={company.countryRiskWeight >= 0.2 ? '#ef4444' : company.countryRiskWeight >= 0.1 ? '#f59e0b' : '#22c55e'}
             format={v => `${v.toFixed(0)}bp`} />
      </Section>

      {/* Financials */}
      <Section title="Financials (M€)">
        <Kv label="Revenue" value={fmt(company.revenueMln)} />
        <Kv label="Prior Year Revenue" value={fmt(company.priorRevenueMln)} />
        <Kv label="Revenue YoY" value={`${yoyChange >= 0 ? '+' : ''}${(yoyChange * 100).toFixed(1)}%`}
            color={Math.abs(yoyChange) > 0.30 ? '#f59e0b' : '#c8cfd8'} />
        <Kv label="Total Assets" value={fmt(company.totalAssetsMln)} />
        <Kv label="Total Liabilities" value={fmt(company.totalLiabilitiesMln)} />
        <Kv label="Equity" value={fmt(company.equityMln)}
            color={company.equityMln < 0 ? '#ef4444' : '#c8cfd8'} />
        <Kv label="EBIT" value={fmt(company.ebitMln)}
            color={company.ebitMln < 0 ? '#ef4444' : '#c8cfd8'} />
        <Kv label="Retained Earnings" value={fmt(company.retainedEarningsMln)} />
        <Kv label="Working Capital" value={fmt(company.workingCapitalMln)} />
        <Kv label="Operating Cash Flow" value={fmt(company.opCashFlowMln)}
            color={company.opCashFlowMln < 0 ? '#ef4444' : '#c8cfd8'} />
        <Kv label="Market Value of Equity" value={fmt(company.mvEquityMln)} />
      </Section>

      {/* Compliance Flags */}
      <Section title={`Compliance & Risk Flags (${flags.length})`}>
        {flags.length === 0 ? (
          <div style={{ color: '#22c55e', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12 }}>
            No active flags
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {flags.map(f => {
              const def = FLAG_DEFS[f];
              return (
                <div key={f} style={S.flagPill(def.type)} title={def.desc}>
                  <span style={S.flagType(def.type)}>{def.type}</span>
                  <span style={S.flagLabel(def.type)}>{def.label}</span>
                </div>
              );
            })}
          </div>
        )}
        {flags.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {flags.map(f => {
              const def = FLAG_DEFS[f];
              return (
                <div key={f} style={{
                  display: 'flex', gap: 8, marginBottom: 4, alignItems: 'flex-start',
                }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#4e5d78', marginTop: 1 }}>›</span>
                  <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: '#8899bb' }}>
                    <strong style={{ color: '#c8cfd8' }}>{def.label}: </strong>{def.desc}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </div>
  );
}
