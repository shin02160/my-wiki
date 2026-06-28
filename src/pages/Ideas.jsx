import { useState } from 'react';
import { useStore } from '../store';
import Card from '../components/Card';
import { CategoryChip, AccentPill } from '../components/Chip';
import RefreshButton from '../components/RefreshButton';

const COLUMNS = [
  { status: '캡처됨',     dot: 'var(--faint-2)' },
  { status: '검토 중',    dot: 'var(--cat-perf-dot)' },
  { status: '프로젝트 전환', dot: 'var(--cat-exp-dot)' },
  { status: '보류·폐기',  dot: '#D9C6B2' },
];

function IdeaCard({ idea }) {
  const isDead = idea.status === '보류·폐기';
  return (
    <div style={{
      background: 'var(--surface-card)',
      borderRadius: 14,
      boxShadow: 'var(--shadow-card-sm)',
      padding: '12px 14px',
      opacity: isDead ? 0.7 : 1,
    }}>
      {idea.linkedProject && (
        <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>→ {idea.linkedProject}</div>
      )}
      {idea.linkedProject && <div style={{ borderTop: '1px solid var(--hairline)', marginBottom: 8 }} />}
      <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>{idea.title}</div>
      {idea.memo && <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 8 }}>{idea.memo}</div>}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CategoryChip label={idea.category} size="sm" />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--faint)' }}>{idea.capturedAt}</span>
      </div>
    </div>
  );
}

export default function Ideas() {
  const ideas = useStore(s => s.ideas);
  const setModal = useStore(s => s.setModal);
  const fetchIdeas = useStore(s => s.fetchIdeas);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card padding="22px 26px">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24 }}>아이디어 인박스</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>빠른 캡처 → 발전 → 프로젝트화</div>
            </div>
            <RefreshButton onRefresh={fetchIdeas} />
          </div>
        </div>
        {/* Capture bar */}
        <button
          onClick={() => setModal('capture')}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--surface-soft)',
            border: '1.5px solid #F0E2D2',
            borderRadius: 16, padding: '12px 16px',
            cursor: 'pointer', textAlign: 'left',
          }}
        >
          <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 18 }}>+</span>
          <span style={{ color: 'var(--faint)', fontSize: 13 }}>떠오른 생각을 적어보세요…</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {['관심사', '프로젝트'].map(c => (
              <span key={c} style={{ padding: '3px 9px', borderRadius: 999, background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: 11, fontWeight: 500 }}>{c}</span>
            ))}
          </div>
          <span style={{ background: 'var(--accent)', color: '#fff', padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, marginLeft: 4, flexShrink: 0 }}>캡처</span>
        </button>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {COLUMNS.map(col => {
          const items = ideas.filter(i => i.status === col.status);
          return (
            <div key={col.status} style={{
              background: 'var(--surface-soft-2)',
              borderRadius: 20, padding: '14px 12px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: col.dot }} />
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{col.status}</span>
                <span style={{ marginLeft: 'auto', background: 'var(--surface-card)', borderRadius: 999, padding: '1px 7px', fontSize: 11, color: 'var(--muted)' }}>{items.length}</span>
              </div>
              {items.map(i => <IdeaCard key={i.id} idea={i} />)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
