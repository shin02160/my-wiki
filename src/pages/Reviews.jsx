import { useStore } from '../store';
import Card from '../components/Card';
import { StatusChip } from '../components/Chip';
import RefreshButton from '../components/RefreshButton';

const TYPES = ['전체', '월간', '분기', '연간'];
const TYPE_DOT = { '월간': 'var(--accent)', '분기': 'var(--cat-interest-dot)', '연간': 'var(--cat-exp-dot)' };

export default function Reviews() {
  const reviews = useStore(s => s.reviews);
  const type = useStore(s => s.reviewType);
  const setType = useStore(s => s.setReviewType);
  const fetchReviews = useStore(s => s.fetchReviews);

  const filtered = type === '전체' ? reviews : reviews.filter(r => r.type === type);
  const latest = filtered[0];
  const rest = filtered.slice(1, 3);

  const totalReviews = reviews.length;
  const monthly = reviews.filter(r => r.type === '월간').length;
  const quarterly = reviews.filter(r => r.type === '분기').length;
  const yearly = reviews.filter(r => r.type === '연간').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card padding="22px 26px">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24 }}>주기별 리뷰</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>자기 이해 데이터 누적</div>
            </div>
            <RefreshButton onRefresh={fetchReviews} />
          </div>
          <div style={{ display: 'flex', background: 'var(--surface-soft)', borderRadius: 999, padding: 3, gap: 2 }}>
            {TYPES.map(t => (
              <button key={t} onClick={() => setType(t)} style={{
                padding: '6px 13px', borderRadius: 999,
                background: type === t ? 'var(--accent)' : 'transparent',
                color: type === t ? '#fff' : 'var(--muted)',
                fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
              }}>{t}</button>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, alignItems: 'start' }}>
        {/* Left: reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {latest && (
            <Card padding="22px 24px">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 21, color: 'var(--ink)' }}>{latest.period}</div>
                <StatusChip status={latest.type} />
                {latest.isLatest && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em' }}>최신</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                {[
                  { label: '주요 활동', items: latest.activities },
                  { label: '배운 점', items: latest.learned },
                  { label: '다음 목표', items: latest.next },
                ].map(({ label, items }) => (
                  <div key={label} style={{ background: 'var(--surface-soft)', borderRadius: 14, padding: '14px' }}>
                    <div style={{ fontSize: 9.5, fontFamily: 'var(--font-mono)', color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
                    {items.map((item, idx) => (
                      <div key={idx} style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.6, marginBottom: 4 }}>· {item}</div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rest.map(r => (
              <Card key={r.id} padding="16px 20px">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 17 }}>{r.period}</div>
                  <StatusChip status={r.type} />
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {r.activities.slice(0,2).map(a => (
                    <span key={a} style={{ padding: '3px 9px', borderRadius: 999, background: 'var(--surface-soft)', color: 'var(--muted)', fontSize: 11 }}>{a}</span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: stats + log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card padding="20px 22px">
            <div style={{ display: 'flex', gap: 0, marginBottom: 16 }}>
              {[
                { label: '누적', value: totalReviews },
                { label: '연속', value: '6개월' },
              ].map(s => (
                <div key={s.label} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 32, color: 'var(--accent)', letterSpacing: '-0.02em' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 12, display: 'flex', justifyContent: 'center', gap: 20 }}>
              {[{ label: '월간', v: monthly }, { label: '분기', v: quarterly }, { label: '연간', v: yearly }].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: 18, color: 'var(--ink)' }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="16px 18px">
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, marginBottom: 12, color: 'var(--ink)' }}>리뷰 로그</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {reviews.map((r, idx) => (
                <div key={r.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
                  borderBottom: idx < reviews.length - 1 ? '1px solid var(--hairline)' : 'none',
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: TYPE_DOT[r.type] || 'var(--faint-2)', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{r.period}</span>
                  <StatusChip status={r.type} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
