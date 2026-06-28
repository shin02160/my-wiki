// Notion dataSources API (v5 client)
// DB IDs
export const DB_IDS = {
  timeline:  '1c4fe5c6-d5b8-413f-8405-3eb42b1bb790',
  interests: 'cd584d6d-dcb9-48bb-9910-e086a0c75a32',
  projects:  '12f33737-1c37-4618-a70c-e7ce6240bb09',
  ideas:     '6c942e99-4cc9-4268-a781-730865a2c012',
  reviews:   '33e7a096-178b-475f-96f3-21f557618656',
};

const TOKEN = import.meta.env.VITE_NOTION_TOKEN;
// dev: Vite proxy /notion-api → https://api.notion.com/v1
// prod: Vercel rewrites /notion-api → https://api.notion.com/v1
const API_BASE = '/notion-api';
const HEADERS = {
  'Authorization': `Bearer ${TOKEN}`,
  'Notion-Version': '2025-09-03',
  'Content-Type': 'application/json',
};

async function queryDS(dbId, body = {}) {
  const res = await fetch(`${API_BASE}/data_sources/${dbId}/query`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ page_size: 100, ...body }),
  });
  if (!res.ok) throw new Error(`Notion API error ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

async function createPage(dbId, properties) {
  const res = await fetch(`${API_BASE}/pages`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ parent: { database_id: dbId }, properties }),
  });
  if (!res.ok) throw new Error(`Notion API error ${res.status}`);
  return res.json();
}

async function updatePage(pageId, properties) {
  const res = await fetch(`${API_BASE}/pages/${pageId}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({ properties }),
  });
  if (!res.ok) throw new Error(`Notion API error ${res.status}`);
  return res.json();
}

// ── helpers ──────────────────────────────────────
const rich = (p) => p?.rich_text?.map(t => t.plain_text).join('') || '';
const title = (p) => p?.title?.map(t => t.plain_text).join('') || '';
const sel = (p) => p?.select?.name || '';
const multiSel = (p) => p?.multi_select?.map(s => s.name) || [];
const date = (p) => p?.date?.start || null;

// ── Timeline ──────────────────────────────────────
export async function fetchTimeline() {
  const rows = await queryDS(DB_IDS.timeline, {
    sorts: [{ property: '날짜', direction: 'descending' }],
  });
  return rows.map(row => ({
    id: row.id,
    date: date(row.properties['날짜']),
    category: sel(row.properties['카테고리']),
    title: title(row.properties['이벤트명']),
    desc: rich(row.properties['설명']),
    tags: multiSel(row.properties['태그']),
    relatedInterest: rich(row.properties['관련 관심사']),
    relatedProject: rich(row.properties['관련 프로젝트']),
  }));
}

// ── Interests ──────────────────────────────────────
export async function fetchInterests() {
  const rows = await queryDS(DB_IDS.interests);
  return rows.map((row, idx) => ({
    id: row.id,
    name: title(row.properties['주제']),
    category: sel(row.properties['카테고리']) || '관심사',
    intensity: sel(row.properties['강도']) || '중간',
    periodStart: date(row.properties['date:기간 시작:start']),
    periodEnd: date(row.properties['date:기간 종료:start']),
    desc: rich(row.properties['메모']),
    related: [],
    projects: [],
    // 그래프 좌표: 순서 기반 기본값 (향후 수동 설정 가능)
    x: 100 + (idx % 4) * 130,
    y: 100 + Math.floor(idx / 4) * 130,
  }));
}

// ── Projects ──────────────────────────────────────
export async function fetchProjects() {
  const rows = await queryDS(DB_IDS.projects, {
    sorts: [{ property: 'date:시작일:start', direction: 'descending' }],
  });
  return rows.map(row => ({
    id: row.id,
    name: title(row.properties['프로젝트명']),
    status: sel(row.properties['상태']) || '아이디어',
    category: sel(row.properties['카테고리']),
    stack: rich(row.properties['스택']).split(',').map(s => s.trim()).filter(Boolean),
    prdUrl: row.properties['PRD URL']?.url || null,
    periodStart: date(row.properties['date:시작일:start']),
    periodEnd: date(row.properties['date:종료일:start']),
    relatedInterest: sel(row.properties['카테고리']),
    summary: rich(row.properties['요약']),
  }));
}

// ── Ideas ──────────────────────────────────────
export async function fetchIdeas() {
  const rows = await queryDS(DB_IDS.ideas, {
    sorts: [{ property: '캡처일', direction: 'descending' }],
  });
  return rows.map(row => ({
    id: row.id,
    title: title(row.properties['아이디어명']),
    status: sel(row.properties['상태']) || '캡처됨',
    category: sel(row.properties['카테고리']),
    capturedAt: date(row.properties['캡처일']),
    memo: rich(row.properties['메모']),
    relatedInterest: rich(row.properties['관련 관심사']),
    linkedProject: null,
  }));
}

// ── Reviews ──────────────────────────────────────
export async function fetchReviews() {
  const rows = await queryDS(DB_IDS.reviews, {
    sorts: [{ property: '기간', direction: 'descending' }],
  });
  return rows.map((row, idx) => ({
    id: row.id,
    period: title(row.properties['제목']),
    type: sel(row.properties['타입']),
    periodDate: date(row.properties['기간']),
    activities: rich(row.properties['주요 활동']).split('\n').filter(Boolean),
    learned: rich(row.properties['배운 점']).split('\n').filter(Boolean),
    next: rich(row.properties['다음 목표']).split('\n').filter(Boolean),
    isLatest: idx === 0,
  }));
}

// ── Mutations ──────────────────────────────────────
export async function createIdea({ title: t, category, memo }) {
  return createPage(DB_IDS.ideas, {
    '아이디어명': { title: [{ text: { content: t } }] },
    '카테고리': { select: { name: category } },
    '메모': { rich_text: [{ text: { content: memo || '' } }] },
    '상태': { select: { name: '캡처됨' } },
    '캡처일': { date: { start: new Date().toISOString().slice(0, 10) } },
  });
}

export async function updateIdeaStatus(pageId, status) {
  return updatePage(pageId, {
    '상태': { select: { name: status } },
  });
}

export async function createProject({ name, status, stack, category, prdUrl }) {
  return createPage(DB_IDS.projects, {
    '프로젝트명': { title: [{ text: { content: name } }] },
    '상태': { select: { name: status } },
    '스택': { rich_text: [{ text: { content: stack.join(', ') } }] },
    '카테고리': { select: { name: category } },
    ...(prdUrl ? { 'PRD URL': { url: prdUrl } } : {}),
    '시작일': { date: { start: new Date().toISOString().slice(0, 10) } },
  });
}

export async function updateProjectStatus(pageId, status) {
  return updatePage(pageId, {
    '상태': { select: { name: status } },
  });
}
