import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64, mediaType } = req.body;

  if (!imageBase64 || !mediaType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const client = new Anthropic({
      apiKey,
    });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `You are a gym exercise identification assistant. The user has taken a photo of gym equipment or their exercise setup.

Analyze the image and respond with ONLY a JSON object (no markdown, no backticks):
{
  "exercise_name": "the most likely exercise being performed or set up",
  "equipment": "the equipment visible",
  "muscle_group": "primary muscle group targeted",
  "confidence": "high" | "medium" | "low",
  "alternatives": ["other possible exercises with this equipment"]
}

If you cannot identify the exercise or equipment, respond with:
{
  "exercise_name": "Unknown",
  "equipment": "Unknown",
  "muscle_group": "Unknown",
  "confidence": "low",
  "alternatives": []
}`,
            },
          ],
        },
      ],
    });

    const textContent = response.content[0];
    if (textContent.type !== 'text') {
      throw new Error('Unexpected response format from Claude');
    }

    const text = textContent.text;

    // Parse the JSON response from Claude
    const result = JSON.parse(text);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error identifying exercise:', error);
    return res.status(500).json({
      error: 'Failed to identify exercise',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
