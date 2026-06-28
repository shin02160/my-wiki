import { useStore } from '../store';
import Card from '../components/Card';
import { CategoryChip, MicroTag, AccentPill } from '../components/Chip';

const COLUMNS = [
  { status: '진행 중', dot: 'var(--accent)', dotColor: 'var(--accent)' },
  { status: '완료',   dot: 'var(--cat-exp-dot)', dotColor: 'var(--cat-exp-dot)' },
  { status: '아이디어', dot: 'var(--cat-perf-dot)', dotColor: 'var(--cat-perf-dot)' },
];

function ProjectCard({ proj }) {
  const isIdea = proj.status === '아이디어';
  const isDone = proj.status === '완료';
  return (
    <div style={{
      background: 'var(--surface-card)',
      borderRadius: 16,
      boxShadow: 'var(--shadow-card-sm)',
      padding: '14px 16px',
      opacity: isDone ? 0.92 : 1,
      border: isIdea ? '1px dashed #E7D8C2' : 'none',
      background: isIdea ? 'transparent' : 'var(--surface-card)',
    }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, color: 'var(--ink)', marginBottom: 8 }}>{proj.name}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
        {proj.stack.map(s => <MicroTag key={s} label={s} mono />)}
      </div>
      <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CategoryChip label={proj.relatedInterest} size="sm" showDot />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
          color: proj.prdUrl ? 'var(--accent)' : 'var(--faint)',
          cursor: proj.prdUrl ? 'pointer' : 'default',
        }}>
          {proj.prdUrl ? 'PRD ↗' : 'PRD —'}
        </span>
      </div>
    </div>
  );
}

export default function Projects() {
  const projects = useStore(s => s.projects);
  const setModal = useStore(s => s.setModal);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card padding="22px 26px">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24 }}>프로젝트 허브</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>상태별 프로젝트 관리</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              padding: '7px 14px', borderRadius: 999,
              background: 'var(--surface-soft)', border: '1px solid var(--hairline-2)',
              fontSize: 12, color: 'var(--muted)', cursor: 'pointer',
            }}>카테고리 ▾</button>
            <AccentPill small onClick={() => setModal('new-project')}>+ 새 프로젝트</AccentPill>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {COLUMNS.map(col => {
          const items = projects.filter(p => p.status === col.status);
          return (
            <div key={col.status} style={{
              background: 'var(--surface-soft-2)',
              borderRadius: 20, padding: '16px 14px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.dotColor }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{col.status}</span>
                <span style={{
                  marginLeft: 'auto', background: 'var(--surface-card)',
                  borderRadius: 999, padding: '2px 8px', fontSize: 11, color: 'var(--muted)',
                }}>{items.length}</span>
              </div>
              {items.map(p => <ProjectCard key={p.id} proj={p} />)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
