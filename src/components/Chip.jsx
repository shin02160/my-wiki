const CAT_MAP = {
  '프로젝트': { text: 'var(--cat-project-text)', bg: 'var(--cat-project-bg)', dot: 'var(--cat-project-dot)' },
  '공연':     { text: 'var(--cat-perf-text)',    bg: 'var(--cat-perf-bg)',    dot: 'var(--cat-perf-dot)' },
  '경험':     { text: 'var(--cat-exp-text)',     bg: 'var(--cat-exp-bg)',     dot: 'var(--cat-exp-dot)' },
  '관심사':   { text: 'var(--cat-interest-text)',bg: 'var(--cat-interest-bg)',dot: 'var(--cat-interest-dot)' },
  '리뷰':     { text: 'var(--cat-interest-text)',bg: 'var(--cat-interest-bg)',dot: 'var(--cat-interest-dot)' },
  '자동화':   { text: 'var(--cat-exp-text)',     bg: 'var(--cat-exp-bg)',     dot: 'var(--cat-exp-dot)' },
};

export function CategoryChip({ label, showDot = true, size = 'sm' }) {
  const c = CAT_MAP[label] || { text: '#7A7164', bg: 'var(--surface-soft)', dot: 'var(--faint-2)' };
  const fs = size === 'sm' ? 11 : 12;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'sm' ? '3px 8px' : '4px 10px',
      borderRadius: 999,
      background: c.bg,
      color: c.text,
      fontSize: fs,
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>
      {showDot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />}
      {label}
    </span>
  );
}

export function StatusChip({ status }) {
  const map = {
    '진행 중': { color: 'var(--accent)', bg: 'var(--accent-soft)' },
    '완료':    { color: 'var(--cat-exp-text)', bg: 'var(--cat-exp-bg)' },
    '아이디어':{ color: 'var(--cat-perf-text)', bg: 'var(--cat-perf-bg)' },
    '캡처됨':  { color: 'var(--faint)', bg: 'var(--hairline)' },
    '검토 중': { color: 'var(--cat-perf-text)', bg: 'var(--cat-perf-bg)' },
    '프로젝트 전환': { color: 'var(--cat-exp-text)', bg: 'var(--cat-exp-bg)' },
    '보류·폐기':{ color: 'var(--muted)', bg: 'var(--hairline)' },
    '월간':    { color: 'var(--accent)', bg: 'var(--accent-soft)' },
    '분기':    { color: 'var(--cat-interest-text)', bg: 'var(--cat-interest-bg)' },
    '연간':    { color: 'var(--cat-exp-text)', bg: 'var(--cat-exp-bg)' },
  };
  const c = map[status] || { color: 'var(--muted)', bg: 'var(--hairline)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 9px', borderRadius: 999,
      background: c.bg, color: c.color,
      fontSize: 11, fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>{status}</span>
  );
}

export function MicroTag({ label, mono }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 7px', borderRadius: 6,
      background: 'var(--surface-soft)',
      color: 'var(--muted)',
      fontSize: 11,
      fontFamily: mono ? 'var(--font-mono)' : 'inherit',
      whiteSpace: 'nowrap',
    }}>{label}</span>
  );
}

export function AccentPill({ children, onClick, small, outline }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: small ? '6px 14px' : '8px 18px',
        borderRadius: 999,
        background: outline ? 'transparent' : 'var(--accent)',
        border: outline ? '1.5px solid var(--hairline-2)' : 'none',
        color: outline ? 'var(--muted)' : '#fff',
        fontSize: small ? 12 : 13,
        fontWeight: 600,
        boxShadow: outline ? 'none' : 'var(--shadow-accent)',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
      }}
    >{children}</button>
  );
}
