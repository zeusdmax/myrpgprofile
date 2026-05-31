export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { messages, systemPrompt } = req.body;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ]
      })
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Los vientos mágicos interfieren. Inténtalo de nuevo.';
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ error: 'Error interno', reply: 'Los vientos mágicos interfieren. Inténtalo de nuevo.' });
  }
}
