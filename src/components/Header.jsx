const S = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: 52,
    background: '#0d111a',
    borderBottom: '1px solid #1e2535',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexShrink: 0,
  },
  left: { display: 'flex', alignItems: 'center', gap: 12 },
  logo: {
    width: 28,
    height: 28,
    background: '#3b6ef0',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 700,
    fontSize: 13,
    color: '#fff',
    letterSpacing: '-0.5px',
  },
  title: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 700,
    fontSize: 16,
    color: '#e8edf5',
    letterSpacing: '0.5px',
  },
  subtitle: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 400,
    fontSize: 11,
    color: '#4e5d78',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
  badge: {
    background: '#0f1f48',
    border: '1px solid #1e3a7a',
    borderRadius: 4,
    padding: '2px 8px',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    color: '#3b6ef0',
    letterSpacing: '0.5px',
  },
};

export default function Header() {
  const now = new Date().toISOString().split('T')[0];
  return (
    <header style={S.header}>
      <div style={S.left}>
        <div style={S.logo}>EC</div>
        <div>
          <div style={S.title}>EuroCredit</div>
          <div style={S.subtitle}>Counterparty Credit Risk Terminal</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={S.badge}>SYNTHETIC DATA</span>
        <span style={{ ...S.badge, color: '#8899bb', borderColor: '#1e2535', background: '#111825' }}>
          {now}
        </span>
      </div>
    </header>
  );
}
