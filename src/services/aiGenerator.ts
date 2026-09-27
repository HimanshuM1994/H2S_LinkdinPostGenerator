import { EventConfig, ToneType } from '../types';

export interface GeneratedPostContent {
  intro: string;
  bulletPoints: string[];
  closing: string;
  cta: string;
  hashtags: string[];
}

export function generatePostCopy(
  tone: ToneType,
  takeaways: string,
  eventConfig: EventConfig
): GeneratedPostContent {
  const primaryTag = eventConfig.hashtags[0] || '#TechConnect2025';
  const orgMention = eventConfig.twitterHandle || '@ApexCloudTech';
  const orgName = eventConfig.hostOrg || 'Apex Cloud Innovations';
  const eventName = eventConfig.name || 'TechConnect Global Summit 2025';

  const cleanedTakeaway = takeaways.trim();

  switch (tone) {
    case 'grateful':
      return {
        intro: `Feeling deeply energized and grateful after attending ${primaryTag}! ❤️`,
        bulletPoints: [
          `So many meaningful conversations today at ${eventConfig.location || 'Moscone Center'}:`,
          `✨ Massive thanks to the hosts at ${orgMention} (${orgName}) for curating such an inclusive, future-focused space.`,
          cleanedTakeaway
            ? `✨ Highlight: "${cleanedTakeaway}"`
            : `✨ Inspiring to reconnect with long-time peers and meet passionate engineers leading next-gen cloud platforms.`,
          `✨ Grateful for every honest hallway chat about developer experience and AI scaling.`
        ],
        closing: `Conferences like this remind me why I love building developer communities and shaping tech ecosystems together.`,
        cta: `Drop a comment if you are on-site—would love to grab a coffee before the closing session! ☕`,
        hashtags: eventConfig.hashtags.slice(0, 5),
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
            : `• Developer Velocity: AI-driven agentic pipelines are cutting deployment cycles from days to minutes.`
        ],
        closing: `Clear proof that cloud infrastructure architectures are evolving significantly faster than expected in 2025.`,
        cta: `Which of these shifts aligns closest with your 2026 tech roadmap? Let's discuss in the comments 👇`,
        hashtags: eventConfig.hashtags.slice(0, 5),
      };

    case 'casual':
      return {
        intro: `What a wild and inspiring day at ${primaryTag}! ⚡️`,
        bulletPoints: [
          `Mind blown by the live serverless demo on stage with ${orgMention}.`,
          cleanedTakeaway
            ? `Key moment for me: ${cleanedTakeaway}`
            : `The VIP lounge discussions went way past scheduled time in the best way possible.`,
          `So much energy, so many ambitious ideas, and endless iced espresso on tap.`
        ],
        closing: `The tech community here is fully back and firing on all cylinders. Huge kudos to ${orgName}!`,
        cta: `See everyone on the expo floor tomorrow morning! 👋`,
        hashtags: eventConfig.hashtags.slice(0, 5),
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
          `3️⃣ The engineering community here in SF is more collaborative than ever.`
        ],
        closing: `Huge congratulations to the ${orgName} team for putting together a stellar summit. Honored to connect with so many brilliant minds in cloud engineering!`,
        cta: `Who else is attending tomorrow's breakout tracks? Let's connect! 👇`,
        hashtags: eventConfig.hashtags.slice(0, 5),
      };
  }
}
