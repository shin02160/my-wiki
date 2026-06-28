import { useState } from 'react';

export default function RefreshButton({ onRefresh }) {
  const [spinning, setSpinning] = useState(false);

  const handleClick = async () => {
    if (spinning) return;
    setSpinning(true);
    try { await onRefresh(); } finally { setSpinning(false); }
  };

  return (
    <button
      onClick={handleClick}
      title="새로고침"
      style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'var(--surface-soft)',
        border: '1.5px solid var(--hairline-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: spinning ? 'default' : 'pointer',
        fontSize: 15,
        color: spinning ? 'var(--faint)' : 'var(--muted)',
        transition: 'color .2s',
        animation: spinning ? 'spin .7s linear infinite' : 'none',
        flexShrink: 0,
      }}
    >
      ↻
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
