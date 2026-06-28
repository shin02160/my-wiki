import { useStore } from '../store';
import Card from '../components/Card';
import { CategoryChip } from '../components/Chip';

const PERIODS = ['전체 기간', '2026', '2025'];
const CATEGORIES = ['전체', '프로젝트', '공연', '경험', '관심사', '리뷰'];

const CAT_DOT = {
  '프로젝트': 'var(--cat-project-dot)',
  '공연':     'var(--cat-perf-dot)',
  '경험':     'var(--cat-exp-dot)',
  '관심사':   'var(--cat-interest-dot)',
  '리뷰':     'var(--cat-review-dot)',
};

export default function Timeline() {
  const timeline = useStore(s => s.timeline);
  const period = useStore(s => s.timelinePeriod);
  const setPeriod = useStore(s => s.setTimelinePeriod);
  const cat = useStore(s => s.timelineCategory);
  const setCat = useStore(s => s.setTimelineCategory);

  const filtered = timeline.filter(e => {
    const yearOk = period === '전체 기간' || e.date.startsWith(period);
    const catOk = cat === '전체' || e.category === cat;
    return yearOk && catOk;
  });

  const byYear = filtered.reduce((acc, e) => {
    const y = e.date.slice(0, 4);
    if (!acc[y]) acc[y] = [];
    acc[y].push(e);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <Card padding="22px 26px">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, color: 'var(--ink)' }}>타임라인</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>연도별로 쌓인 사건과 관심의 흐름</div>
          </div>
          {/* Period segmented */}
          <div style={{ display: 'flex', background: 'var(--surface-soft)', borderRadius: 999, padding: 3, gap: 2, flexShrink: 0 }}>
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                padding: '6px 14px', borderRadius: 999,
                background: period === p ? 'var(--accent)' : 'transparent',
                color: period === p ? '#fff' : 'var(--muted)',
                fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                transition: 'background .15s',
              }}>{p}</button>
            ))}
          </div>
        </div>
        {/* Category filters */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 999,
              background: cat === c ? 'var(--accent-soft)' : 'var(--surface-soft)',
              color: cat === c ? 'var(--accent)' : 'var(--muted)',
              fontSize: 12, fontWeight: cat === c ? 600 : 400,
              border: 'none', cursor: 'pointer',
            }}>
              {c !== '전체' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: CAT_DOT[c] || 'var(--faint-2)', flexShrink: 0 }} />}
              {c}
            </button>
          ))}
        </div>
      </Card>

      {/* Body */}
      <Card padding="20px 24px" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {Object.entries(byYear).sort(([a],[b]) => b - a).map(([year, events]) => (
            <div key={year} style={{ display: 'flex', gap: 24 }}>
              {/* Year label */}
              <div style={{ width: 74, flexShrink: 0, textAlign: 'right', paddingTop: 18 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 30, color: '#E3CDBB', lineHeight: 1 }}>{year}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--faint)', letterSpacing: '0.06em', marginTop: 4 }}>{events.length} events</div>
              </div>

              {/* Events rail */}
              <div style={{
                flex: 1,
                borderLeft: '2px solid var(--hairline-3)',
                paddingLeft: 28,
                display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                {events.map(e => (
                  <div key={e.id} style={{ position: 'relative' }}>
                    {/* Dot */}
                    <div style={{
                      position: 'absolute', left: -35, top: 19,
                      width: 11, height: 11, borderRadius: '50%',
                      background: CAT_DOT[e.category] || 'var(--faint)',
                      boxShadow: `0 0 0 2.5px #fff, 0 0 0 4px var(--hairline-3)`,
                    }} />
                    {/* Card */}
                    <div style={{
                      background: 'var(--surface-soft)',
                      borderRadius: 16, padding: '14px 16px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--muted)', letterSpacing: '0.08em' }}>{e.date}</span>
                        <CategoryChip label={e.category} />
                      </div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>{e.title}</div>
                      {e.desc && <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6 }}>{e.desc}</div>}
                      {e.tags?.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                          {e.tags.map(t => (
                            <span key={t} style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
