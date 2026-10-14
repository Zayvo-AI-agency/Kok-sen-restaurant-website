import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import {
  getCanonicalDishes,
  generatePromptCatalog,
  resolveCanonicalDish,
  validateAndDeduplicateRecommendations,
  detectDishesInTextSafely,
  normalizeDishIdentity,
  CanonicalDishInfo,
} from './src/utils/menuIdentity';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use('/menu-photos', express.static(path.join(process.cwd(), 'public', 'menu-photos')));

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

const MENU_PROMPT_CATALOG = generatePromptCatalog();

const KOK_SEN_SYSTEM_INSTRUCTION = `
### ROLE & PERSONALITY
You are a warm, highly capable, and culinary-knowledgeable AI Dining Assistant for Kok Sen Restaurant (國成餐室), an iconic third-generation Cantonese Zi Char restaurant founded in 1968 at 4 Keong Saik Road, Singapore. You act like an experienced local restaurant concierge whose reputation depends on every single recommendation.

* Speak like a knowledgeable, friendly culinary host. Use natural formatting, short punchy sentences, and functional emojis sparingly as visual anchors (e.g. 🦐, 🍲, 🥢, 📍, ⏱️).
* Match the energy of the customer. If they are brief, be concise. If they are celebrating a special occasion, show authentic excitement.
* Never say "As an AI language model." Do not feign human physical sensations, but use conversational phrases like "Personally, I'd highly recommend..." or "Our regulars love..."

### STRICTEST GUARDRAIL: ZERO FOOD PRICES
* **PRICE POLICY:** Food prices are strictly hidden across the Kok Sen website. You must NEVER display, quote, estimate, or format food prices (do NOT write dollar signs like "$28" or "SGD" anywhere in your reply).
* If a diner asks about prices or ordering online, direct them politely to our official ordering page:
  "For current prices and online orders, visit our ordering page: [View Prices & Order Online](https://koksen.oddle.me/en_SG)"

### RECOMMEND ONLY REAL MENU ITEMS
* Recommend dishes ONLY from Kok Sen's authoritative menu catalog provided below.
* NEVER invent dish names, ingredients, preparations, or availability.
* The exact same dish may appear under both SIGNATURE and another category (e.g. Big Prawns Hor Fun is both a signature and a noodle). You must treat each distinct culinary dish as ONE item and recommend each dish at most once per response.

### CONVERSATION STATE & DEDUPLICATION
* The user may provide a list of \`excludedDishKeys\` (dishes already recommended in earlier turns of this conversation).
* If the diner asks for "more dishes", "other options", or "alternatives", you MUST EXCLUDE dishes already recommended in this conversation, unless they explicitly ask to revisit or re-examine one.
* If suitable options run out in a requested category, explain that warmly and honestly (e.g. "We've explored all of our signature items! Would you like to check out our seafood favorites or claypot braises?"), rather than repeating previous dishes or inventing fake items.

### DIETARY & ALLERGEN CARE
* Treat allergy constraints with extreme care.
* NEVER label a dish as 100% allergen-free based solely on its name, ingredients, or photo.
* Kok Sen operates high-heat woks and shared oil fryers. State clearly when a dish contains common allergens (such as crustaceans, molluscs, soy, wheat/gluten, egg, pork, or nuts).
* Emphasize that while certain vegetable or noodle dishes can be requested with garlic and soy instead of oyster sauce or belacan, cross-contact is always possible. Diners must inform service staff upon seating for kitchen confirmation and dedicated wok handling.

### MATCHING THE CUSTOMER'S REQUEST
* Respect the diner's party size, preferred ingredients (prawns, beef, fish, tofu, greens), spice tolerance, and occasion.
* If a customer's party size or preference is ambiguous, recommend a solid starting pairing and ask a single brief, polite clarifying question.

### DYNAMIC WEBSITE NAVIGATION TAGS
You can reference site sections using these Markdown anchor tags:
- [#full-menu]: "Explore all categories in our Parchment Menu."
- [#wok-favourites]: "See our top heritage wok dishes."
- [#table-spreads]: "Check our Table Spread presets for 2, 4, or 8+ diners."
- [#gallery]: "Preview the atmosphere and kitchen photos."
- [#book-table]: "Reserve a table or message our mainline WhatsApp."
- [#location]: "View MRT walking directions for Keong Saik and City Square Mall."

### OUTLETS & OPERATING HOURS
- **1) Keong Saik Outlet (Flagship):** 4 Keong Saik Road, Singapore 089110 · Mainline WhatsApp: 9727 2533 ([Chat with Keong Saik](https://wa.me/6597272533))
  - Tuesday – Sunday: Lunch: 12:00pm – 2:15pm (last order 2:00pm) · Dinner: 5:00pm – 9:15pm (last order 8:45pm)
  - Monday: Closed (Weekly Kitchen Rest)
- **2) City Square Mall Outlet:** 180 Kitchener Road, #02-K1/K2, Singapore 208539 · Mainline WhatsApp: 9624 4244 ([Chat with City Square Mall](https://wa.me/6596244244))
  - Open Daily · Monday–Sunday: Lunch: 11:30am–2:30pm · Dinner: 4:30pm–9:00pm
  - No Monday closure. Afternoon kitchen break between 2:30pm and 4:30pm.

### MICHELIN RECOGNITION
- Michelin Bib Gourmand awarded continuously spanning 2016 through 2026.

### AUTHORITATIVE KOK SEN MENU CATALOG:
${MENU_PROMPT_CATALOG}
`;

/**
 * Intelligent fallback generator when Gemini API is offline or returns an error.
 * Strictly respects menu catalog, zero prices, excludedDishKeys, and allergy disclaimers.
 */
function generateFallbackResponse(
  userPrompt: string,
  excludedKeys: string[] = []
): { reply: string; recommendedDishes: CanonicalDishInfo[] } {
  const p = userPrompt.toLowerCase();
  const canonical = getCanonicalDishes();
  const excludedSet = new Set(excludedKeys.map((k) => k.trim().toLowerCase()));

  // 1. Pricing enquiry
  if (p.includes('price') || p.includes('cost') || p.includes('how much') || p.includes('menu price') || p.includes('bill')) {
    return {
      reply: `### Kok Sen Online Pricing & Ordering

For current dish prices and online takeaway orders, please visit our official ordering page:

👉 **[View Prices & Order Online](https://koksen.oddle.me/en_SG)**

You can also browse our complete 125-dish repertoire with Chinese names and portion size options directly in our [#full-menu]!`,
      recommendedDishes: [],
    };
  }

  // 2. Allergy & Dietary Enquiry
  if (
    p.includes('allergy') ||
    p.includes('allergies') ||
    p.includes('allergic') ||
    p.includes('vegetarian') ||
    p.includes('vegan') ||
    p.includes('gluten') ||
    p.includes('halal') ||
    p.includes('celiac')
  ) {
    const safeCandidates = canonical.filter((d) => {
      const isEx = excludedSet.has(d.identityKey.toLowerCase());
      if (isEx) return false;
      const desc = d.description.toLowerCase();
      const name = d.nameEn.toLowerCase();
      return (
        name.includes('kai lan') ||
        name.includes('lettuce') ||
        name.includes('kang kong') ||
        desc.includes('garlic') ||
        desc.includes('vegetable')
      );
    });

    return {
      reply: `### Dietary & Allergen Advisory

At Kok Sen, we take diner safety very seriously. Please keep these important guidelines in mind:

- **Shellfish / Crustaceans:** Many iconic gravies and seasonings (including our Big Prawns Hor Fun, Har Cheong Gai, and Sambal Kang Kong with belacan) contain shrimp or squid.
- **Vegetarian / Greens Preparation:** Certain vegetable dishes like our **Stir Fried Kai Lan With Garlic** can be stir-fried strictly with garlic and light soy upon request, omitting oyster sauce or dried shrimp.
- **Cross-Contact Notice:** Please note that our kitchen uses shared woks, utensils, and high-heat fryers. Therefore, **no dish can be guaranteed 100% allergen-free** based solely on its menu description.
- **Important:** Always inform your service captain upon seating so our kitchen can confirm ingredients and perform dedicated wok handling for severe sensitivities.

Would you like recommendations tailored to specific ingredients, or shall we explore our vegetable and tofu options in [#full-menu]?`,
      recommendedDishes: safeCandidates.slice(0, 2),
    };
  }

  // 3. Signature & Recommendation Requests (including "suggest three more", "signatures", "recommend")
  const isSignatureReq =
    p.includes('signature') ||
    p.includes('recommend') ||
    p.includes('must order') ||
    p.includes('popular') ||
    p.includes('suggest') ||
    p.includes('more') ||
    p.includes('first time') ||
    p.includes('three');

  if (isSignatureReq) {
    // Filter available dishes that have not been recommended yet
    const availableSignatures = canonical.filter(
      (d) => d.isSignature && !excludedSet.has(d.identityKey.toLowerCase())
    );

    if (availableSignatures.length >= 3) {
      const top3 = availableSignatures.slice(0, 3);
      const isFollowUp = excludedKeys.length > 0;
      return {
        reply: isFollowUp
          ? `### Three More Exceptional Kok Sen Dishes

Here are three more authentic heritage favorites from our kitchen that you haven't explored yet:

- **${top3[0].nameEn} (${top3[0].nameZh})**: ${top3[0].description}
- **${top3[1].nameEn} (${top3[1].nameZh})**: ${top3[1].description}
- **${top3[2].nameEn} (${top3[2].nameZh})**: ${top3[2].description}

💡 *Dining Tip:* These pair wonderfully with steamed jasmine rice or fresh seasonal greens from our [#full-menu]!`
          : `### What Locals Order: Kok Sen Heritage Signatures

Welcome to Kok Sen! Here are three iconic dishes that have anchored our kitchen's Michelin Bib Gourmand reputation:

- **${top3[0].nameEn} (${top3[0].nameZh})**: ${top3[0].description}
- **${top3[1].nameEn} (${top3[1].nameZh})**: ${top3[1].description}
- **${top3[2].nameEn} (${top3[2].nameZh})**: ${top3[2].description}

💡 *Dining Tip:* For first-time visitors, balancing a rich seafood hor fun with a sizzling claypot and crisp poultry creates an unforgettable spread.`,
        recommendedDishes: top3,
      };
    }

    if (availableSignatures.length > 0) {
      const remaining = availableSignatures;
      return {
        reply: `### Remaining Kok Sen Signatures

We have shared most of our main signature items! Here are the remaining standout signature dishes:

${remaining.map((d) => `- **${d.nameEn} (${d.nameZh})**: ${d.description}`).join('\n')}

Would you like to explore our other categories, such as our fresh seafood, wok-fried rice, or double-boiled soups in [#full-menu]?`,
        recommendedDishes: remaining,
      };
    }

    // If all signatures are exhausted
    const otherDishes = canonical.filter(
      (d) => !excludedSet.has(d.identityKey.toLowerCase())
    );

    if (otherDishes.length > 0) {
      const next3 = otherDishes.slice(0, 3);
      return {
        reply: `### Additional Kitchen Specialties

We have covered all our top signature dishes! Here are three wonderful specialties from our regular menu:

- **${next3[0].nameEn} (${next3[0].nameZh})**: ${next3[0].description}
- **${next3[1].nameEn} (${next3[1].nameZh})**: ${next3[1].description}
- **${next3[2].nameEn} (${next3[2].nameZh})**: ${next3[2].description}

Feel free to browse all 125 items by category in our [#full-menu]!`,
        recommendedDishes: next3,
      };
    }

    return {
      reply: `### All Options Shared

We have explored all suitable menu options across our conversation! Would you like to revisit any of our earlier favorites, or proceed to book a table via [#book-table]?`,
      recommendedDishes: [],
    };
  }

  // 4. Hours & Timing
  if (p.includes('hour') || p.includes('open') || p.includes('close') || p.includes('time') || p.includes('lunch') || p.includes('dinner')) {
    return {
      reply: `### Operating Hours

We welcome you across two distinct dining locations:

**1) Keong Saik Outlet (Flagship):**
- **Tuesday – Sunday:**
  - Lunch: 12:00pm – 2:15pm *(Kitchen last order 2:00pm)*
  - Dinner: 5:00pm – 9:15pm *(Kitchen last order 8:45pm)*
- **Monday: Closed** (Weekly Kitchen Rest)

**2) City Square Mall Outlet:**
- **Open Daily · Monday–Sunday:**
  - Lunch: 11:30am–2:30pm
  - Dinner: 4:30pm–9:00pm
*(Afternoon break: 2:30pm–4:30pm)*

🚶 *Concierge Tip:* Weekday lunch is ideal for spontaneous walk-ins. For weekend dinners, reserving in advance via [#book-table] is strongly advised!`,
      recommendedDishes: [],
    };
  }

  // 5. Reservations
  if (p.includes('reserv') || p.includes('book') || p.includes('table') || p.includes('whatsapp')) {
    return {
      reply: `### Table Reservations & Direct WhatsApp

Reservations are managed separately for each outlet via direct WhatsApp:

- **1) Keong Saik Outlet (Flagship):** WhatsApp **9727 2533** ([Chat with Keong Saik](https://wa.me/6597272533))
- **2) City Square Mall Outlet:** WhatsApp **9624 4244** ([Chat with City Square Mall](https://wa.me/6596244244))

💡 *Concierge Tip:* You can also open our reservation page via [#book-table] to pre-fill your party details, or chat with either outlet directly!`,
      recommendedDishes: [],
    };
  }

  // 6. Location & Directions
  if (p.includes('where') || p.includes('address') || p.includes('location') || p.includes('mrt') || p.includes('get here')) {
    return {
      reply: `### Finding Kok Sen

We welcome you at two distinct dining locations:

📍 **Flagship:** 4 Keong Saik Road, Singapore 089110
- **Maxwell MRT (TE18):** 5-min walk via Exit 2
- **Outram Park MRT (EW16/NE3/TE17):** 4-min walk via Exit 4
- **Chinatown MRT (NE4/DT19):** 6-min walk via Exit H

📍 **City Square Mall:** 180 Kitchener Road, #02-K1/K2, Singapore 208539 (Farrer Park MRT Exit I)

Find full interactive maps and parking tips in our [#location] guide!`,
      recommendedDishes: [],
    };
  }

  // Default welcome / general assistance
  const defaultPicks = canonical.filter(
    (d) => d.isSignature && !excludedSet.has(d.identityKey.toLowerCase())
  ).slice(0, 3);

  return {
    reply: `### At Your Service at Kok Sen

Welcome to 國成餐室 (Kok Sen Restaurant)! I'm your dedicated Dining Concierge.

Whether you're planning a balanced table spread, curious about specific ingredients, or ready to reserve a table:
- **Heritage Favorites:** Let me recommend dishes tailored to your party size and preferences.
- **Dietary Guidance:** We provide careful ingredient context for allergies and sensitivities.
- **Reservations:** Connect directly with our mainline WhatsApp for Keong Saik or City Square Mall in [#book-table].

What are you craving today, or how many guests will be dining with you?`,
    recommendedDishes: defaultPicks,
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Kok Sen AI Dining Assistant' });
});

// AI Concierge Endpoint with Authoritative Menu Grounding
app.post('/api/concierge', async (req, res) => {
  try {
    const { message, history, excludedDishKeys } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message string is required' });
      return;
    }

    const cleanExcludedKeys: string[] = Array.isArray(excludedDishKeys)
      ? excludedDishKeys.filter((k) => typeof k === 'string')
      : [];

    const ai = getGeminiClient();

    // If Gemini client not available, run high-precision fallback
    if (!ai) {
      console.warn('GEMINI_API_KEY not configured. Using authoritative local concierge engine.');
      const fallback = generateFallbackResponse(message, cleanExcludedKeys);
      const validatedDishes = validateAndDeduplicateRecommendations(
        fallback.recommendedDishes,
        cleanExcludedKeys,
        false
      );

      res.json({
        reply: fallback.reply,
        recommendedDishes: validatedDishes,
        recommendedKeys: validatedDishes.map((d) => normalizeDishIdentity(d.nameEn, d.nameZh)),
        grounded: true,
      });
      return;
    }

    // Build context-aware prompt instruction incorporating excludedDishKeys
    let sessionConstraintNote = '';
    if (cleanExcludedKeys.length > 0) {
      sessionConstraintNote = `\n\n### ACTIVE CONVERSATION CONTEXT:\nThe diner has ALREADY been recommended the following dishes in this chat session:\n${cleanExcludedKeys.map((k) => `- ${k}`).join('\n')}\nUnless the diner explicitly asks to revisit one of these dishes, DO NOT recommend them again. If options in the requested category are exhausted, explain that clearly instead of repeating or inventing dishes.`;
    }

    // Build contents array with conversation history
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-8);
      for (const turn of recentHistory) {
        if (turn.role && turn.text) {
          contents.push({
            role: turn.role === 'assistant' ? 'model' : turn.role,
            parts: [{ text: turn.text }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: `${message}${sessionConstraintNote}` }],
    });

    // Call Gemini 3.8 Flash with structured JSON output schema
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: KOK_SEN_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'Helpful, warm markdown response to the customer. Strictly NO food prices, dollar signs, or bill totals.',
            },
            recommendedDishes: {
              type: Type.ARRAY,
              description: 'Array of dishes recommended in this response. Each must match a real Kok Sen menu item.',
              items: {
                type: Type.OBJECT,
                properties: {
                  nameEn: { type: Type.STRING, description: 'Exact English dish name from the Kok Sen menu' },
                  nameZh: { type: Type.STRING, description: 'Chinese dish name from the Kok Sen menu' },
                },
                required: ['nameEn'],
              },
            },
            revisitingRequested: {
              type: Type.BOOLEAN,
              description: 'True if the diner explicitly requested to revisit a previously recommended dish.',
            },
          },
          required: ['reply'],
        },
      },
    });

    const responseText = response.text;
    let parsedReply = '';
    let candidateDishes: Array<{ nameEn?: string; nameZh?: string }> = [];
    let allowRevisit = false;

    if (responseText) {
      try {
        const parsed = JSON.parse(responseText);
        parsedReply = parsed.reply || '';
        candidateDishes = Array.isArray(parsed.recommendedDishes) ? parsed.recommendedDishes : [];
        allowRevisit = Boolean(parsed.revisitingRequested);
      } catch (parseErr) {
        console.warn('Failed to parse JSON response from Gemini, treating as markdown text:', parseErr);
        parsedReply = responseText;
      }
    }

    if (!parsedReply) {
      const fallback = generateFallbackResponse(message, cleanExcludedKeys);
      parsedReply = fallback.reply;
      candidateDishes = fallback.recommendedDishes;
    }

    // Validate structured recommendations against authoritative menu
    let validatedDishes = validateAndDeduplicateRecommendations(
      candidateDishes,
      cleanExcludedKeys,
      allowRevisit
    );

    // If structured output didn't provide dishes, safely extract authentic dishes referenced in reply text
    if (validatedDishes.length === 0) {
      validatedDishes = detectDishesInTextSafely(
        parsedReply,
        cleanExcludedKeys,
        allowRevisit
      );
    }

    // Safety scrub: Ensure no price numbers slipped into the reply text
    const cleanReply = parsedReply
      .replace(/\$\s*\d+(\.\d{1,2})?/g, '')
      .replace(/\b\d+(\.\d{1,2})?\s*SGD\b/gi, '')
      .replace(/\(\s*\)/g, '');

    const recommendedKeys = validatedDishes.map((d) => normalizeDishIdentity(d.nameEn, d.nameZh));

    res.json({
      reply: cleanReply,
      recommendedDishes: validatedDishes,
      recommendedKeys,
      grounded: true,
    });
  } catch (error: any) {
    console.error('Error in /api/concierge:', error);
    const fallback = generateFallbackResponse(req.body?.message || '', req.body?.excludedDishKeys || []);
    const validatedDishes = validateAndDeduplicateRecommendations(
      fallback.recommendedDishes,
      req.body?.excludedDishKeys || [],
      false
    );

    res.json({
      reply: fallback.reply,
      recommendedDishes: validatedDishes,
      recommendedKeys: validatedDishes.map((d) => normalizeDishIdentity(d.nameEn, d.nameZh)),
      grounded: true,
      error: error?.message || 'Server error',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kok Sen Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
