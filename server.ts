import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize GoogleGenAI securely on the server
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function generateServerFallback(tone: string, takeaways: string, eventConfig: any) {
  const primaryTag = eventConfig?.hashtags?.[0] || '#TechConnect2025';
  const orgMention = eventConfig?.twitterHandle || '@ApexCloudTech';
  const orgName = eventConfig?.hostOrg || 'Apex Cloud Innovations Inc.';
  const eventName = eventConfig?.name || 'TechConnect Global Summit 2025';
  const cleanedTakeaway = (takeaways || '').trim();

  switch (tone) {
    case 'grateful':
      return {
        intro: `Feeling deeply energized and grateful after attending ${primaryTag}! ❤️`,
        bulletPoints: [
          `So many meaningful conversations today at ${eventConfig?.location || 'Moscone Center'}:`,
          `✨ Massive thanks to the hosts at ${orgMention} (${orgName}) for curating such an inclusive, future-focused space.`,
          cleanedTakeaway
            ? `✨ Highlight: "${cleanedTakeaway}"`
            : `✨ Inspiring to reconnect with long-time peers and meet passionate engineers leading next-gen cloud platforms.`,
          `✨ Grateful for every honest hallway chat about developer experience and AI scaling.`,
        ],
        closing: `Conferences like this remind me why I love building developer communities and shaping tech ecosystems together.`,
        cta: `Drop a comment if you are on-site—would love to grab a coffee before the closing session! ☕`,
        hashtags: (eventConfig?.hashtags || []).slice(0, 5),
      };

    case 'takeaways':
      return {
        intro: `Quick field notes & executive debrief from ${eventName} ${primaryTag}: 📊`,
        bulletPoints: [
          `Core Themes from the Main Stage & Technical Breakouts:`,
          `• Vector & LLM Scaling: 40% reduction in query round-trips via edge caching and distributed pipelines.`,
          `• Self-Healing Microservices: Zero-downtime cluster rebalances under massive enterprise workloads.`,
          cleanedTakeaway
            ? `• Practitioner Note: ${cleanedTakeaway}`
            : `• Developer Velocity: AI-driven agentic pipelines are cutting deployment cycles from days to minutes.`,
        ],
        closing: `Clear proof that cloud infrastructure architectures are evolving significantly faster than expected in 2025.`,
        cta: `Which of these shifts aligns closest with your 2026 tech roadmap? Let's discuss in the comments 👇`,
        hashtags: (eventConfig?.hashtags || []).slice(0, 5),
      };

    case 'casual':
      return {
        intro: `What a wild and inspiring day at ${primaryTag}! ⚡️`,
        bulletPoints: [
          `Mind blown by the live serverless demo on stage with ${orgMention}.`,
          cleanedTakeaway
            ? `Key moment for me: ${cleanedTakeaway}`
            : `The VIP lounge discussions went way past scheduled time in the best way possible.`,
          `So much energy, so many ambitious ideas, and endless iced espresso on tap.`,
        ],
        closing: `The tech community here is fully back and firing on all cylinders. Huge kudos to ${orgName}!`,
        cta: `See everyone on the expo floor tomorrow morning! 👋`,
        hashtags: (eventConfig?.hashtags || []).slice(0, 5),
      };

    case 'professional':
    default:
      return {
        intro: `Still processing all the breakthrough insights from day 2 of ${primaryTag}! 🚀`,
        bulletPoints: [
          `A few major takeaways from the keynote by ${orgMention}:`,
          cleanedTakeaway
            ? `1️⃣ ${cleanedTakeaway}`
            : `1️⃣ Autonomous AI systems are fundamentally shifting enterprise infrastructure from reactive monitoring to proactive self-healing clusters.`,
          `2️⃣ Latency reduction in distributed vector pipelines is unlocking real-time inference at scale.`,
          `3️⃣ The engineering community here in SF is more collaborative than ever.`,
        ],
        closing: `Huge congratulations to the ${orgName} team for putting together a stellar summit. Honored to connect with so many brilliant minds in cloud engineering!`,
        cta: `Who else is attending tomorrow's breakout tracks? Let's connect! 👇`,
        hashtags: (eventConfig?.hashtags || []).slice(0, 5),
      };
  }
}

// Server endpoint to check Gemini API status (never exposes the key)
app.get('/api/ai/status', (_req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '');
  res.json({
    configured: isConfigured,
    model: 'gemini-3.8-flash',
  });
});

// Server endpoint to generate structured LinkedIn post content
app.post('/api/generate-post', async (req, res) => {
  const { tone, takeaways, eventConfig } = req.body;
  const ai = getGenAI();

  if (!ai) {
    const fallback = generateServerFallback(tone, takeaways, eventConfig);
    return res.json({
      success: true,
      data: fallback,
      isLiveAI: false,
      message: 'GEMINI_API_KEY is not configured in .env or Settings > Secrets. Used smart template synthesis.',
    });
  }

  const eventName = eventConfig?.name || 'TechConnect Global Summit 2025';
  const hostOrg = eventConfig?.hostOrg || 'Apex Cloud Innovations Inc.';
  const location = eventConfig?.location || 'Moscone Center, SF';
  const hashtags = (eventConfig?.hashtags && eventConfig.hashtags.length > 0)
    ? eventConfig.hashtags.slice(0, 5)
    : ['#TechConnect2025', '#CloudInnovation', '#FutureOfTech', '#ApexSummit'];
  const twitterHandle = eventConfig?.twitterHandle || '@ApexCloudTech';

  const toneGuide: Record<string, string> = {
    professional: 'Polished, authoritative executive voice. Highlights architectural and business impact.',
    grateful: 'Warm, appreciative, community-oriented tone. Expresses gratitude to the hosts, organizers, and peers.',
    takeaways: 'Bullet-driven, high-signal field debrief. Focuses on concrete technical insights, benchmarks, and takeaways.',
    casual: 'Energetic, enthusiastic, conversational tone with summit excitement, coffee chats, and booth energy.',
  };

  const selectedTonePrompt = toneGuide[tone] || toneGuide.professional;

  const prompt = `You are an elite LinkedIn copywriter and tech community growth strategist.
Draft a high-engagement, authentic LinkedIn post for an attendee at the following event:
- Event: ${eventName}
- Host Organization: ${hostOrg}
- Location: ${location}
- Speaker/Host Handle: ${twitterHandle}
- Required Hashtags: ${hashtags.join(' ')}
- Desired Tone: ${selectedTonePrompt}
- Attendee's Raw Notes & Takeaways: "${takeaways || 'Incredible keynote announcements on AI systems and cloud infrastructure.'}"

Formatting Guidelines:
1. Hook / Intro: 1-2 punchy sentences that immediately grab attention in the LinkedIn feed, with an appropriate emoji.
2. Bullet Points: 3 clear, distinct bullet points synthesizing the key highlights. Use numbers or neat emojis. Keep lines spaced and readable.
3. Closing: A thoughtful closing acknowledging the hosts (${hostOrg}) or reflecting on developer experience.
4. CTA: A natural engagement question or invite to connect for colleagues and other attendees.
5. Hashtags: Include 3-5 relevant summit hashtags (must include ${hashtags[0]}).`;

  // Try gemini-3.8-flash first, and if unavailable try gemini-3.1-flash-lite
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: 'You craft professional, viral-ready LinkedIn posts with excellent line spacing and no corporate fluff.',
          temperature: 0.7,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intro: {
                type: Type.STRING,
                description: 'Hook / opening sentence setting the summit context.',
              },
              bulletPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3-4 concise takeaway points.',
              },
              closing: {
                type: Type.STRING,
                description: 'Closing sentence thanking organizers or praising the summit.',
              },
              cta: {
                type: Type.STRING,
                description: 'Call to action asking fellow attendees to connect or comment.',
              },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Array of 3 to 5 targeted hashtags.',
              },
            },
            required: ['intro', 'bulletPoints', 'closing', 'cta', 'hashtags'],
          },
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      if (parsed.intro && parsed.bulletPoints) {
        return res.json({
          success: true,
          data: parsed,
          isLiveAI: true,
          model,
        });
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed, attempting next option:`, err?.message);
    }
  }

  // Graceful fallback if both live model calls encountered a temporary spike
  const fallback = generateServerFallback(tone, takeaways, eventConfig);
  return res.json({
    success: true,
    data: fallback,
    isLiveAI: false,
    warning: 'Temporary upstream AI load, synthesized high-quality draft.',
  });
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EventPulse PRO server running on port ${PORT}`);
  });
}

startServer();
