export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing GROQ_API_KEY' });

  try {
    const messages = req.body?.messages ?? [];
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 2000,
        messages,
      }),
    });
    const d = await r.json();
    const text = d.choices?.[0]?.message?.content ?? '';
    return res.status(200).json({ content: [{ type: 'text', text }] });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
