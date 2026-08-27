import { verifyFirebaseIdToken } from './auth.js';
import { generateRecipeHtml } from './geminiRecipe.js';

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

const readJsonBody = async (req) => {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString();
  return raw ? JSON.parse(raw) : {};
};

const getBearerToken = (req) => {
  const header = req.headers?.authorization || req.headers?.Authorization;
  if (!header?.startsWith('Bearer ')) {
    return null;
  }
  return header.slice(7).trim();
};

/**
 * Shared handler for POST /api/generate-recipe (Vite dev + Vercel).
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @param {Record<string, string>} env
 */
export const handleRecipeRequest = async (req, res, env) => {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const idToken = getBearerToken(req);
    const firebaseApiKey = env.FIREBASE_API_KEY || env.VITE_FIREBASE_API_KEY;
    await verifyFirebaseIdToken(idToken, firebaseApiKey);

    const body = await readJsonBody(req);
    const ingredients = body.ingredients;

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      sendJson(res, 400, { error: 'At least one ingredient is required' });
      return;
    }

    const html = await generateRecipeHtml(ingredients, {
      geminiApiKey: env.GEMINI_API_KEY,
      preferredModel: env.GEMINI_MODEL?.trim(),
    });

    sendJson(res, 200, { html });
  } catch (error) {
    const message = error?.message || 'Failed to generate recipe';

    if (message === 'Unauthorized') {
      sendJson(res, 401, { error: 'Authentication required' });
      return;
    }

    if (message.includes('Gemini API key')) {
      sendJson(res, 500, { error: 'Recipe service is not configured' });
      return;
    }

    console.error('[API] generate-recipe error:', error);
    sendJson(res, 500, { error: message });
  }
};
