import Card from '../components/Card';
import { CategoryChip, StatusChip, AccentPill } from '../components/Chip';
import RefreshButton from '../components/RefreshButton';
import { useStore } from '../store';

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      background: accent ? 'var(--accent)' : 'var(--surface-card)',
      borderRadius: 20,
      boxShadow: accent ? 'var(--shadow-accent)' : 'var(--shadow-card)',
      padding: '18px 20px',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{
        fontSize: 36, fontWeight: 700,
        fontFamily: 'var(--font-body)',
        letterSpacing: '-0.02em',
        color: accent ? '#fff' : 'var(--accent)',
        lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: 12, color: accent ? 'var(--accent-on-fill)' : 'var(--muted)', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const timeline = useStore(s => s.timeline);
  const interests = useStore(s => s.interests);
  const projects = useStore(s => s.projects);
  const ideas = useStore(s => s.ideas);
  const reviews = useStore(s => s.reviews);
  const setRoute = useStore(s => s.setRoute);
  const setModal = useStore(s => s.setModal);

  const activeProjects = projects.filter(p => p.status === '진행 중').length;
  const activeInterests = interests.filter(i => i.intensity !== '낮음').length;
  const thisMonthIdeas = ideas.filter(i => i.capturedAt >= '2026-06').length;
  const totalReviews = reviews.length;

  const fetchAll = useStore(s => s.fetchAll);
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  const latestReview = reviews[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Greeting header */}
      <Card padding="22px 26px">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>{today}</div>
          <RefreshButton onRefresh={fetchAll} />
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26, color: 'var(--ink)', marginBottom: 16 }}>안녕하세요, 오늘도 기록해볼까요</div>
        <div style={{
          background: 'var(--surface-soft)',
          borderRadius: 999,
          padding: '9px 16px',
          display: 'flex', alignItems: 'center', gap: 8,
          width: 220, border: '1.5px solid var(--hairline-2)',
        }}>
          <span style={{ color: 'var(--faint)', fontSize: 14 }}>🔍</span>
          <span style={{ color: 'var(--faint)', fontSize: 13 }}>검색…</span>
        </div>
      </Card>

      {/* 4-up stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard label="진행 중 프로젝트" value={activeProjects} />
        <StatCard label="활성 관심사" value={activeInterests} />
        <StatCard label="이번 달 아이디어" value={thisMonthIdeas} />
        <StatCard label={`누적 리뷰 ${totalReviews} · 연속 6개월 🔥`} value={totalReviews} accent />
      </div>

      {/* Bento grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, alignItems: 'start' }}>
        {/* Left col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Timeline preview */}
          <Card padding="20px 22px">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15, color: 'var(--ink)' }}>타임라인</span>
              <button onClick={() => setRoute('timeline')} style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>전체 보기 →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {timeline.slice(0, 4).map(e => (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', width: 60, flexShrink: 0, letterSpacing: '0.06em' }}>{e.date.slice(5)}</span>
                  <CategoryChip label={e.category} />
                  <span style={{ fontSize: 13, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* 이번 달 회고 */}
          <div style={{ background: 'var(--surface-soft)', borderRadius: 22, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15, color: 'var(--ink)' }}>이번 달 회고</span>
              <button onClick={() => setRoute('reviews')} style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>→</button>
            </div>
            {latestReview && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: '주요 활동', items: latestReview.activities },
                  { label: '배운 점', items: latestReview.learned },
                  { label: '다음 목표', items: latestReview.next },
                ].map(({ label, items }) => (
                  <div key={label} style={{
                    background: 'var(--surface-card)',
                    borderRadius: 14, padding: '12px 14px',
                  }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink)' }}>{items[0]}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 관심사 맵 */}
          <Card padding="18px 20px">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15 }}>관심사 맵</span>
              <button onClick={() => setRoute('interests')} style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>→</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {interests.map(i => (
                <span key={i.id} style={{
                  padding: i.intensity === '높음' ? '6px 14px' : i.intensity === '중간' ? '5px 12px' : '4px 10px',
                  borderRadius: 999,
                  fontSize: i.intensity === '높음' ? 13 : i.intensity === '중간' ? 12 : 11,
                  background: i.intensity === '높음' ? 'var(--accent-soft)' : 'var(--surface-soft)',
                  color: i.intensity === '높음' ? 'var(--accent)' : 'var(--muted)',
                  fontWeight: i.intensity === '높음' ? 600 : 400,
                  cursor: 'default',
                }}>{i.name}</span>
              ))}
            </div>
          </Card>

          {/* 프로젝트 허브 */}
          <Card padding="18px 20px">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15 }}>프로젝트 허브</span>
              <button onClick={() => setRoute('projects')} style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>→</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {projects.filter(p => p.status === '진행 중').slice(0,2).map(p => (
                <div key={p.id} style={{
                  background: 'var(--surface-soft)', borderRadius: 12, padding: '10px 12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 13, fontFamily: 'var(--font-heading)' }}>{p.name}</span>
                  <StatusChip status={p.status} />
                </div>
              ))}
            </div>
          </Card>

          {/* 아이디어 인박스 */}
          <Card padding="18px 20px">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15 }}>아이디어 인박스</span>
              <button onClick={() => setRoute('ideas')} style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>→</button>
            </div>
            <button
              onClick={() => setModal('capture')}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--accent-soft)', borderRadius: 12, padding: '9px 12px',
                marginBottom: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 16 }}>+</span>
              <span style={{ color: 'var(--faint)', fontSize: 12.5 }}>떠오른 생각을 적어보세요…</span>
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ideas.slice(0,2).map(i => (
                <div key={i.id} style={{
                  background: 'var(--surface-soft)', borderRadius: 10, padding: '9px 11px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500 }}>{i.title}</span>
                  <StatusChip status={i.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
