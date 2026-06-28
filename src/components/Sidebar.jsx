import { useStore } from '../store';

const NAV_ITEMS = [
  { id: 'dashboard', label: '대시보드' },
  { id: 'timeline', label: '타임라인' },
  { id: 'interests', label: '관심사 맵' },
  { id: 'projects', label: '프로젝트 허브' },
  { id: 'ideas', label: '아이디어 인박스' },
  { id: 'reviews', label: '주기별 리뷰' },
];

export default function Sidebar() {
  const route = useStore(s => s.route);
  const setRoute = useStore(s => s.setRoute);

  return (
    <aside style={{
      width: 212, minWidth: 212,
      background: 'var(--surface-card)',
      borderRadius: 22,
      boxShadow: 'var(--shadow-card)',
      padding: '22px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      flexShrink: 0,
    }}>
      {/* Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{
          width: 32, height: 32,
          background: 'var(--accent)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
          fontFamily: 'var(--font-heading)',
          fontSize: 18,
          fontWeight: 700,
          flexShrink: 0,
        }}>w</div>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17, color: 'var(--ink)' }}>my wiki</span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const active = route === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setRoute(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 13px',
                borderRadius: 13,
                background: active ? 'var(--accent-soft)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--muted)',
                fontWeight: active ? 600 : 400,
                fontSize: 13.5,
                textAlign: 'left',
                transition: 'background .15s, color .15s',
              }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                background: active ? 'var(--accent)' : '#E5D8C8',
              }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User chip */}
      <div style={{
        marginTop: 'auto',
        background: 'var(--surface-soft)',
        borderRadius: 14,
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'var(--avatar-bg)',
          color: 'var(--avatar-text)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-heading)',
          fontSize: 13,
          fontWeight: 700,
          flexShrink: 0,
        }}>신</div>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>shin02160</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Notion 연동됨</div>
        </div>
      </div>
    </aside>
  );
}
