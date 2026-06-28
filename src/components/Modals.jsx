import { useEffect, useRef } from 'react';
import { useStore } from '../store';

function Scrim({ onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(58,42,28,.34)',
        backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function ModalBox({ children, width = 480 }) {
  return (
    <div style={{
      width, background: 'var(--surface-card)',
      borderRadius: 24, boxShadow: 'var(--shadow-modal)',
      padding: '26px 28px',
    }}>{children}</div>
  );
}

function ModalHead({ title, onClose }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 18 }}>+</span>
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 19, flex: 1 }}>{title}</span>
      <button onClick={onClose} style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'var(--surface-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, color: 'var(--muted)', cursor: 'pointer',
      }}>×</button>
    </div>
  );
}

const CATS = ['관심사', '프로젝트', '공연', '경험', '자동화'];

export function CaptureModal() {
  const setModal = useStore(s => s.setModal);
  const draft = useStore(s => s.ideaDraft);
  const setDraft = useStore(s => s.setIdeaDraft);
  const addIdea = useStore(s => s.addIdea);
  const textRef = useRef(null);

  useEffect(() => { textRef.current?.focus(); }, []);

  const handleSubmit = () => {
    if (!draft.title.trim()) return;
    addIdea({ title: draft.title, category: draft.category, memo: '', relatedInterests: draft.relatedInterests });
    setDraft({ title: '', category: '관심사', relatedInterests: [] });
    setModal(null);
  };

  return (
    <Scrim onClose={() => setModal(null)}>
      <ModalBox>
        <ModalHead title="아이디어 캡처" onClose={() => setModal(null)} />

        <textarea
          ref={textRef}
          value={draft.title}
          onChange={e => setDraft({ title: e.target.value })}
          placeholder="떠오른 생각을 적어보세요…"
          style={{
            width: '100%', minHeight: 96,
            background: 'var(--surface-soft)',
            border: '1.5px solid var(--hairline-2)',
            borderRadius: 14, padding: '12px 14px',
            fontSize: 14, color: 'var(--ink)',
            resize: 'none', outline: 'none',
            lineHeight: 1.6,
          }}
        />

        <div style={{ marginTop: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>카테고리</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setDraft({ category: c })} style={{
                padding: '5px 12px', borderRadius: 999,
                background: draft.category === c ? 'var(--accent)' : 'var(--surface-soft)',
                color: draft.category === c ? '#fff' : 'var(--muted)',
                fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
              }}>{c}</button>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>상태 · 캡처됨으로 저장</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setModal(null)} style={{
              padding: '8px 18px', borderRadius: 999,
              background: 'var(--surface-soft)', border: '1.5px solid var(--hairline-2)',
              color: 'var(--muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>취소</button>
            <button onClick={handleSubmit} style={{
              padding: '8px 18px', borderRadius: 999,
              background: 'var(--accent)', color: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: 'var(--shadow-accent)',
            }}>캡처</button>
          </div>
        </div>
      </ModalBox>
    </Scrim>
  );
}

const PROJECT_STATUSES = ['진행 중', '완료', '아이디어'];

export function NewProjectModal() {
  const setModal = useStore(s => s.setModal);
  const draft = useStore(s => s.projectDraft);
  const setDraft = useStore(s => s.setProjectDraft);
  const addProject = useStore(s => s.addProject);
  const [stackInput, setStackInput] = [
    draft._stackInput || '',
    (v) => setDraft({ _stackInput: v }),
  ];

  const handleAddStack = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      setDraft({ stack: [...draft.stack, e.target.value.trim()], _stackInput: '' });
    }
  };

  const removeStack = (s) => setDraft({ stack: draft.stack.filter(x => x !== s) });

  const handleSubmit = () => {
    if (!draft.name.trim()) return;
    addProject({ name: draft.name, status: draft.status, stack: draft.stack, category: draft.category, prdUrl: draft.prdUrl, relatedInterest: draft.category, period: '' });
    setDraft({ name: '', status: '아이디어', stack: [], category: '프로젝트', prdUrl: '', _stackInput: '' });
    setModal(null);
  };

  return (
    <Scrim onClose={() => setModal(null)}>
      <ModalBox width={560}>
        <ModalHead title="새 프로젝트" onClose={() => setModal(null)} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* 프로젝트명 */}
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>프로젝트명</div>
            <input value={draft.name} onChange={e => setDraft({ name: e.target.value })} placeholder="프로젝트 이름" style={{
              width: '100%', background: 'var(--surface-soft)', border: '1.5px solid var(--hairline-2)',
              borderRadius: 12, padding: '12px 14px', fontSize: 14, outline: 'none',
            }} />
          </div>

          {/* 상태 */}
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>상태</div>
            <div style={{ display: 'flex', background: 'var(--surface-soft)', borderRadius: 999, padding: 3, gap: 2, width: 'fit-content' }}>
              {PROJECT_STATUSES.map(s => (
                <button key={s} onClick={() => setDraft({ status: s })} style={{
                  padding: '6px 16px', borderRadius: 999,
                  background: draft.status === s ? 'var(--accent)' : 'transparent',
                  color: draft.status === s ? '#fff' : 'var(--muted)',
                  fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                }}>{s}</button>
              ))}
            </div>
          </div>

          {/* 기술 스택 */}
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>기술 스택</div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
              background: 'var(--surface-soft)', border: '1.5px solid var(--hairline-2)',
              borderRadius: 12, padding: '10px 12px', minHeight: 48,
            }}>
              {draft.stack.map(s => (
                <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 6, background: 'var(--hairline)', color: 'var(--muted)', fontSize: 11.5, fontFamily: 'var(--font-mono)' }}>
                  {s}
                  <button onClick={() => removeStack(s)} style={{ color: 'var(--faint)', fontSize: 13, lineHeight: 1, cursor: 'pointer' }}>×</button>
                </span>
              ))}
              <input
                value={draft._stackInput || ''}
                onChange={e => setDraft({ _stackInput: e.target.value })}
                onKeyDown={handleAddStack}
                placeholder="+ 추가 (Enter)"
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, color: 'var(--muted)', minWidth: 80 }}
              />
            </div>
          </div>

          {/* PRD URL */}
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>PRD URL</div>
            <input value={draft.prdUrl} onChange={e => setDraft({ prdUrl: e.target.value })} placeholder="https://notion.so/…" style={{
              width: '100%', background: 'var(--surface-soft)', border: '1.5px solid var(--hairline-2)',
              borderRadius: 12, padding: '12px 14px', fontSize: 13, outline: 'none', fontFamily: 'var(--font-mono)',
            }} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--hairline)', marginTop: 20, paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Notion · 프로젝트 마스터 DB에 생성</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setModal(null)} style={{
              padding: '8px 18px', borderRadius: 999,
              background: 'var(--surface-soft)', border: '1.5px solid var(--hairline-2)',
              color: 'var(--muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>취소</button>
            <button onClick={handleSubmit} style={{
              padding: '8px 18px', borderRadius: 999,
              background: 'var(--accent)', color: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: 'var(--shadow-accent)',
            }}>추가</button>
          </div>
        </div>
      </ModalBox>
    </Scrim>
  );
}
