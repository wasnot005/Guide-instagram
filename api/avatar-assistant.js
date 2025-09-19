export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
  }

  let body = req.body;
  if (!body) {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const raw = Buffer.concat(buffers).toString();
      body = raw ? JSON.parse(raw) : {};
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return res.status(400).json({ error: 'Invalid request body.' });
    }
  }

  const question = typeof body?.question === 'string' ? body.question.trim() : '';
  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  const systemPrompt = `You are a helpful onboarding assistant for an AI avatar creation service. Your purpose is to answer user questions about the content of this specific onboarding page, such as file formats, recording tips, or folder structure. Be concise and supportive. Do not mention API keys or technical terms not found on the page. Do not act as a traditional chatbot; simply answer questions based on the provided guide.`;

  const prompt = `Based on the provided guide, answer the user's question. The question is: "${question}"`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40
    }
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return res.status(502).json({ error: 'Gemini API request failed.' });
    }

    const result = await response.json();
    const parts = result?.candidates?.[0]?.content?.parts;
    const reply = Array.isArray(parts)
      ? parts.map((part) => part?.text ?? '').join('').trim()
      : '';

    if (!reply) {
      console.error('Gemini API returned no usable reply:', JSON.stringify(result));
      return res.status(502).json({ error: 'Gemini API returned an empty response.' });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Failed to reach Gemini API:', error);
    return res.status(500).json({ error: 'Unable to reach Gemini API. Please try again later.' });
  }
}
