// Vercel 서버리스 함수: Notion API 프록시
// 토큰은 서버 환경변수에서만 사용 (브라우저 노출 없음)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { path } = req.query;
  if (!path?.length) {
    return res.status(400).json({ error: 'Missing path' });
  }

  const notionPath = Array.isArray(path) ? path.join('/') : path;
  const url = `https://api.notion.com/v1/${notionPath}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': '2025-09-03',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
