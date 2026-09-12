import 'dotenv/config';
import http from 'node:http';
import OpenAI from 'openai';

const port = Number(process.env.CHAT_SERVER_PORT || 8787);
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:3000' });
  res.end(JSON.stringify(body));
};

http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method !== 'POST' || req.url !== '/api/chat') return send(res, 404, { error: 'Not found' });
  if (!client) return send(res, 503, { error: 'RPG Guide is in offline mode. Add OPENAI_API_KEY to enable live AI.' });

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      const { message, context, history = [] } = JSON.parse(body);
      if (typeof message !== 'string' || !message.trim()) return send(res, 400, { error: 'A message is required.' });
      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-5',
        store: false,
        max_output_tokens: 500,
        instructions: `You are RPG Guide, a concise, helpful companion for a real-life productivity RPG. Use supplied game data only; do not claim to have changed state. If proposing a quest, put a single machine-readable JSON object between <quest> and </quest> with title, description, category, difficulty, xpReward, goldReward, attributeType, attributeReward, deadline. Valid categories are Coding, Study, Fitness, Reading, Personal, Health. Keep XP 10-1000 and Gold 5-500.`,
        input: `Game context: ${JSON.stringify(context)}\nRecent conversation: ${JSON.stringify(history.slice(-6))}\nHero: ${message}`
      });
      send(res, 200, { content: response.output_text || 'Your guide could not form a response.' });
    } catch (error) {
      console.error('Chat request failed:', error instanceof Error ? error.message : error);
      send(res, 500, { error: 'RPG Guide could not reach the guild archives. Please retry.' });
    }
  });
}).listen(port, () => console.log(`Life RPG chat server listening on ${port}`));
