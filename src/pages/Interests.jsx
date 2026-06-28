import { useStore } from '../store';
import Card from '../components/Card';
import { CategoryChip, StatusChip } from '../components/Chip';
import RefreshButton from '../components/RefreshButton';

const CAT_COLORS = {
  '관심사': { bg: 'var(--cat-interest-bg)', border: 'var(--cat-interest-dot)', text: 'var(--cat-interest-text)' },
  '프로젝트': { bg: 'var(--cat-project-bg)', border: 'var(--cat-project-dot)', text: 'var(--cat-project-text)' },
  '공연': { bg: 'var(--cat-perf-bg)', border: 'var(--cat-perf-dot)', text: 'var(--cat-perf-text)' },
  '경험': { bg: 'var(--cat-exp-bg)', border: 'var(--cat-exp-dot)', text: 'var(--cat-exp-text)' },
  '자동화': { bg: 'var(--cat-exp-bg)', border: 'var(--cat-exp-dot)', text: 'var(--cat-exp-text)' },
};

const INTENSITY_SIZE = { '높음': 88, '중간': 60, '낮음': 44 };

// Edges between interests
const EDGES = [
  { from: 'i1', to: 'i2', strong: true },
  { from: 'i1', to: 'i4', strong: true },
  { from: 'i2', to: 'i4', strong: false },
  { from: 'i1', to: 'i5', strong: false },
  { from: 'i5', to: 'i6', strong: false },
  { from: 'i3', to: 'i6', strong: false },
  { from: 'i2', to: 'i6', strong: false },
];

export default function Interests() {
  const interests = useStore(s => s.interests);
  const view = useStore(s => s.interestView);
  const setView = useStore(s => s.setInterestView);
  const selectedId = useStore(s => s.selectedInterest);
  const setSelected = useStore(s => s.setSelectedInterest);
  const fetchInterests = useStore(s => s.fetchInterests);

  const selected = interests.find(i => i.id === selectedId) || interests[0];

  const SVG_W = 600, SVG_H = 420;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card padding="22px 26px">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24 }}>관심사 맵</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>관심 주제와 연결 관계 시각화</div>
            </div>
            <RefreshButton onRefresh={fetchInterests} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '7px 14px', borderRadius: 999, background: 'var(--surface-soft)', border: '1px solid var(--hairline-2)', fontSize: 12, color: 'var(--muted)', cursor: 'pointer' }}>기간 전체 ▾</button>
            <div style={{ display: 'flex', background: 'var(--surface-soft)', borderRadius: 999, padding: 3, gap: 2 }}>
              {['그래프', '태그 클라우드'].map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: '6px 13px', borderRadius: 999,
                  background: view === v ? 'var(--accent)' : 'transparent',
                  color: view === v ? '#fff' : 'var(--muted)',
                  fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                }}>{v}</button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 16 }}>
        {/* Graph card */}
        <Card padding="20px" style={{ background: 'var(--surface-graph)', overflow: 'hidden' }}>
          {view === '그래프' ? (
            <div style={{ position: 'relative', width: SVG_W, height: SVG_H, maxWidth: '100%', margin: '0 auto' }}>
              <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {EDGES.map((e, i) => {
                  const from = interests.find(n => n.id === e.from);
                  const to = interests.find(n => n.id === e.to);
                  if (!from || !to) return null;
                  return (
                    <line key={i}
                      x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                      stroke={e.strong ? 'rgba(197,106,78,.5)' : '#E3D3BF'}
                      strokeWidth={e.strong ? 2 : 1.5}
                      strokeDasharray={e.strong ? 'none' : '5,4'}
                    />
                  );
                })}
              </svg>
              {interests.map(i => {
                const size = INTENSITY_SIZE[i.intensity] || 50;
                const c = CAT_COLORS[i.category] || CAT_COLORS['관심사'];
                const isSelected = (selected?.id === i.id);
                return (
                  <div
                    key={i.id}
                    onClick={() => setSelected(i.id)}
                    style={{
                      position: 'absolute',
                      left: i.x - size/2, top: i.y - size/2,
                      width: size, height: size,
                      borderRadius: '50%',
                      background: c.bg,
                      border: `${isSelected ? 2.5 : 1.5}px solid ${c.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: isSelected ? 'var(--shadow-accent)' : 'none',
                      transition: 'box-shadow .2s',
                      zIndex: 1,
                    }}
                  >
                    <span style={{ fontSize: size > 70 ? 12 : 10, color: c.text, fontWeight: 600, textAlign: 'center', padding: 4 }}>{i.name}</span>
                  </div>
                );
              })}
              {/* Legend */}
              <div style={{
                position: 'absolute', bottom: 10, left: 10,
                background: 'rgba(255,255,255,.8)',
                borderRadius: 999, padding: '5px 12px',
                display: 'flex', gap: 12, alignItems: 'center',
              }}>
                {['높음', '중간', '낮음'].map(l => (
                  <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: 'var(--muted)' }}>
                    <span style={{ width: l === '높음' ? 10 : l === '중간' ? 7 : 5, height: l === '높음' ? 10 : l === '중간' ? 7 : 5, borderRadius: '50%', background: 'var(--accent-soft)', border: '1.5px solid var(--accent)' }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, padding: '10px 0' }}>
              {interests.map(i => {
                const size = i.intensity === '높음' ? 18 : i.intensity === '중간' ? 15 : 12;
                return (
                  <span key={i.id} onClick={() => setSelected(i.id)} style={{
                    padding: `${i.intensity === '높음' ? 10 : 7}px ${i.intensity === '높음' ? 20 : 14}px`,
                    borderRadius: 999, fontSize: size,
                    background: 'var(--accent-soft)', color: 'var(--accent)',
                    fontWeight: i.intensity === '높음' ? 700 : 500, cursor: 'pointer',
                    opacity: i.intensity === '낮음' ? 0.6 : 1,
                  }}>{i.name}</span>
                );
              })}
            </div>
          )}
        </Card>

        {/* Detail panel */}
        {selected && (
          <Card padding="22px 22px">
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, marginBottom: 10 }}>{selected.name}</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <span style={{ padding: '3px 10px', borderRadius: 999, background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: 11, fontWeight: 600 }}>강도: {selected.intensity}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--muted)', padding: '3px 10px', background: 'var(--surface-soft)', borderRadius: 999 }}>{selected.period}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16 }}>{selected.desc}</p>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>연결된 관심사</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selected.related.map(r => (
                  <span key={r} style={{ padding: '4px 10px', borderRadius: 999, background: 'var(--surface-soft)', color: 'var(--muted)', fontSize: 12 }}>{r}</span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>관련 프로젝트</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selected.projects.map(p => (
                  <div key={p} style={{ background: 'var(--surface-soft)', borderRadius: 10, padding: '9px 12px', fontSize: 13, fontFamily: 'var(--font-heading)' }}>{p}</div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
