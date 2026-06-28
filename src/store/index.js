import { create } from 'zustand';

const SAMPLE_TIMELINE = [
  { id: 't1', date: '2026-06-10', category: '프로젝트', title: 'Personal Wiki 개발 시작', desc: 'Notion 연동 커스텀 앱 개발을 시작했다.', tags: ['React', 'Notion API'] },
  { id: 't2', date: '2026-05-20', category: '공연', title: '프롬 콘서트 관람', desc: '오랜만에 콘서트 현장에서 느낀 감동.', tags: ['Fromm', '공연'] },
  { id: 't3', date: '2026-04-15', category: '경험', title: '사이드 프로젝트 첫 배포', desc: '포트폴리오 리뉴얼을 Vercel에 배포 완료.', tags: ['Vercel', '포트폴리오'] },
  { id: 't4', date: '2025-12-30', category: '리뷰', title: '2025년 연간 회고', desc: '올해 배운 것과 내년 목표를 정리했다.', tags: ['회고', '2025'] },
  { id: 't5', date: '2025-09-01', category: '관심사', title: '데이터 시각화 깊이 탐구 시작', desc: 'D3.js와 차트 라이브러리를 본격적으로 공부하기 시작.', tags: ['D3.js', '시각화'] },
  { id: 't6', date: '2025-06-15', category: '프로젝트', title: '회고 봇 완성', desc: 'Slack 기반 회고 자동화 봇을 완성했다.', tags: ['Slack', '자동화'] },
];

const SAMPLE_INTERESTS = [
  { id: 'i1', name: '데이터 시각화', category: '관심사', intensity: '높음', period: '2025.09 – 현재', desc: 'D3.js, Recharts 등을 활용한 인터랙티브 차트와 그래프 구현에 깊은 흥미를 느끼고 있다.', related: ['React', '프론트엔드'], projects: ['Personal Wiki', '관심사 그래프 뷰'], x: 300, y: 200 },
  { id: 'i2', name: 'React', category: '프로젝트', intensity: '높음', period: '2024.03 – 현재', desc: 'React 19의 새로운 기능들을 탐구하며 컴포넌트 아키텍처를 공부 중.', related: ['데이터 시각화', '프론트엔드'], projects: ['Personal Wiki', '포트폴리오 리뉴얼'], x: 150, y: 320 },
  { id: 'i3', name: '음악 / 공연', category: '공연', intensity: '높음', period: '2023.01 – 현재', desc: '인디 음악과 라이브 공연을 꾸준히 관람하며 감수성을 키우고 있다.', related: ['Fromm', '감성'], projects: ['공연 기록 시트', '공연 아카이브'], x: 450, y: 130 },
  { id: 'i4', name: '프론트엔드', category: '프로젝트', intensity: '중간', period: '2024.01 – 현재', desc: '현대적인 웹 개발 스택과 UX 패턴을 꾸준히 공부하고 있다.', related: ['React', '데이터 시각화'], projects: ['포트폴리오 리뉴얼'], x: 250, y: 380 },
  { id: 'i5', name: '자동화', category: '관심사', intensity: '중간', period: '2025.01 – 현재', desc: 'Notion API, Slack bot 등을 활용한 워크플로우 자동화.', related: ['Notion', 'API'], projects: ['회고 봇'], x: 400, y: 300 },
  { id: 'i6', name: 'Notion', category: '관심사', intensity: '낮음', period: '2023.06 – 현재', desc: '개인 지식 관리 도구로 Notion을 적극 활용하고 있다.', related: ['자동화', '기록'], projects: ['Personal Wiki'], x: 180, y: 160 },
];

const SAMPLE_PROJECTS = [
  { id: 'p1', name: 'Personal Wiki', status: '진행 중', period: '2026.06 – ', stack: ['React 19', 'Vite', 'Notion API', 'Zustand'], category: '프로젝트', relatedInterest: '데이터 시각화', prdUrl: '#' },
  { id: 'p2', name: '포트폴리오 리뉴얼', status: '진행 중', period: '2026.04 – ', stack: ['React', 'Vite', 'Vercel'], category: '프로젝트', relatedInterest: '프론트엔드', prdUrl: null },
  { id: 'p3', name: '회고 봇', status: '완료', period: '2025.10 – 2025.12', stack: ['Node.js', 'Slack API', 'Notion API'], category: '자동화', relatedInterest: '자동화', prdUrl: '#' },
  { id: 'p4', name: '공연 기록 시트', status: '완료', period: '2025.03 – 2025.05', stack: ['Google Sheets', 'Apps Script'], category: '공연', relatedInterest: '음악 / 공연', prdUrl: null },
  { id: 'p5', name: '공연 아카이브', status: '아이디어', period: '', stack: ['React', 'Notion API'], category: '공연', relatedInterest: '음악 / 공연', prdUrl: null },
  { id: 'p6', name: '관심사 그래프 뷰', status: '아이디어', period: '', stack: ['D3.js', 'React'], category: '관심사', relatedInterest: '데이터 시각화', prdUrl: null },
];

const SAMPLE_IDEAS = [
  { id: 'id1', title: 'Notion 일정 자동 파싱', memo: '캘린더 DB에서 이벤트 자동 추출해 타임라인에 연동', category: '자동화', capturedAt: '2026-06-25', status: '캡처됨', linkedProject: null },
  { id: 'id2', title: '관심사 변화 히스토그램', memo: '월별 관심사 강도 변화를 차트로 시각화', category: '관심사', capturedAt: '2026-06-20', status: '검토 중', linkedProject: null },
  { id: 'id3', title: '회고 봇 v2', memo: '주간 회고도 지원, 슬랙 블록킷 UI 개선', category: '자동화', capturedAt: '2026-05-30', status: '프로젝트 전환', linkedProject: '회고 봇 v2' },
  { id: 'id4', title: '공연 티켓 스캔 앱', memo: '티켓 사진으로 공연 기록 자동 추가', category: '공연', capturedAt: '2026-04-10', status: '보류·폐기', linkedProject: null },
];

const SAMPLE_REVIEWS = [
  { id: 'r1', period: '2026년 6월', type: '월간', activities: ['Personal Wiki 개발 착수', '포트폴리오 v3 디자인 완료', '프롬 콘서트 관람'], learned: ['Notion API 연동 방법 숙달', 'Zustand 상태 패턴 정리'], next: ['Personal Wiki 배포', '관심사 맵 구현'], isLatest: true },
  { id: 'r2', period: '2026 Q1', type: '분기', activities: ['포트폴리오 리뉴얼 시작', '사이드 프로젝트 2개 완성'], learned: ['빠른 프로토타이핑의 중요성'], next: ['Wiki 앱 PRD 작성', '배포 파이프라인 자동화'], isLatest: false },
  { id: 'r3', period: '2026년 5월', type: '월간', activities: ['회고 봇 운영 안정화', 'React 19 스터디'], learned: ['자동화로 절약한 시간 2시간/주'], next: ['Personal Wiki PRD 초안'], isLatest: false },
  { id: 'r4', period: '2025년 연간', type: '연간', activities: ['총 6개 사이드 프로젝트', '공연 8회 관람', '블로그 글 12편'], learned: ['꾸준함이 가장 중요', '기록의 힘'], next: ['Personal Wiki 구축', '포트폴리오 정리'], isLatest: false },
];

export const useStore = create((set, get) => ({
  // connection
  connected: true,

  // route
  route: 'dashboard',
  setRoute: (r) => set({ route: r }),

  // data
  timeline: SAMPLE_TIMELINE,
  interests: SAMPLE_INTERESTS,
  projects: SAMPLE_PROJECTS,
  ideas: SAMPLE_IDEAS,
  reviews: SAMPLE_REVIEWS,

  // filters
  timelinePeriod: '전체 기간',
  setTimelinePeriod: (p) => set({ timelinePeriod: p }),
  timelineCategory: '전체',
  setTimelineCategory: (c) => set({ timelineCategory: c }),

  reviewType: '전체',
  setReviewType: (t) => set({ reviewType: t }),

  interestView: '그래프',
  setInterestView: (v) => set({ interestView: v }),

  selectedInterest: null,
  setSelectedInterest: (id) => set({ selectedInterest: id }),

  // modals
  modal: null,
  setModal: (m) => set({ modal: m }),

  // actions
  addIdea: (idea) => set((s) => ({ ideas: [{ id: `id${Date.now()}`, ...idea, capturedAt: new Date().toISOString().slice(0,10), status: '캡처됨', linkedProject: null }, ...s.ideas] })),
  moveIdea: (id, status) => set((s) => ({ ideas: s.ideas.map(i => i.id === id ? { ...i, status } : i) })),

  addProject: (proj) => set((s) => ({ projects: [{ id: `p${Date.now()}`, ...proj }, ...s.projects] })),
  moveProject: (id, status) => set((s) => ({ projects: s.projects.map(p => p.id === id ? { ...p, status } : p) })),

  ideaDraft: { title: '', category: '관심사', relatedInterests: [] },
  setIdeaDraft: (d) => set((s) => ({ ideaDraft: { ...s.ideaDraft, ...d } })),

  projectDraft: { name: '', status: '아이디어', stack: [], category: '프로젝트', prdUrl: '' },
  setProjectDraft: (d) => set((s) => ({ projectDraft: { ...s.projectDraft, ...d } })),
}));
