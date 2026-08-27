import { GoogleGenerativeAI } from '@google/generative-ai';
import { formatAIError } from '../utils/errorHandler';

/**
 * Free-tier Gemini models, lite/cheapest first, then more capable fallbacks.
 * Tried in order until one succeeds.
 */
export const GEMINI_FREE_TIER_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
];

const getGenAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file');
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Whether we should try the next model in the fallback chain.
 * @param {Error} error
 * @returns {boolean}
 */
const shouldTryNextModel = (error) => {
  const message = (error?.message || '').toLowerCase();
  const status = error?.status ?? error?.response?.status;

  if (status === 404) return true;
  if (status === 429) return true;
  if (status === 503) return true;

  return (
    message.includes('not found') ||
    message.includes('is not supported') ||
    message.includes('unsupported') ||
    message.includes('does not exist') ||
    message.includes('invalid model') ||
    message.includes('quota') ||
    message.includes('rate limit') ||
    message.includes('resource exhausted') ||
    message.includes('unavailable') ||
    message.includes('overloaded') ||
    message.includes('too many requests')
  );
};

/**
 * Clean model HTML output from markdown fences.
 * @param {string} text
 * @returns {string}
 */
const cleanRecipeHtml = (text) => {
  return text.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
};

/**
 * Format a prompt for recipe generation
 * @param {Array<string>} ingredients - Array of ingredient names
 * @returns {string} Formatted prompt for AI
 */
export const formatRecipePrompt = (ingredients) => {
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    throw new Error('Ingredients array is required');
  }

  const ingredientList = ingredients.join(', ');

  return `I have the following ingredients: ${ingredientList}.

Please provide 2-3 creative recipes using these ingredients. Format the response in clean HTML using these Tailwind CSS classes:

<div class="space-y-6">
  <h2 class="text-3xl font-bold text-slate-900 mb-6">Recipes with ${ingredientList}</h2>
  
  <div class="bg-white rounded-lg shadow-md p-6 border border-slate-200">
    <h3 class="text-2xl font-semibold text-teal-800 mb-3">[Recipe Name]</h3>
    <p class="text-slate-600 mb-4 italic">[Brief description]</p>
    
    <div class="mb-4">
      <h4 class="font-semibold text-lg text-slate-900 mb-2">Ingredients:</h4>
      <ul class="list-disc ml-6 space-y-1 text-slate-700">
        <li>[ingredient]</li>
      </ul>
    </div>
    
    <div>
      <h4 class="font-semibold text-lg text-slate-900 mb-2">Instructions:</h4>
      <ol class="list-decimal ml-6 space-y-2 text-slate-700">
        <li>[step]</li>
      </ol>
    </div>
  </div>
</div>

Return ONLY the HTML code without markdown code blocks or explanations.`;
};

/**
 * Generate content with a specific Gemini model.
 * @param {string} modelName
 * @param {string} prompt
 * @returns {Promise<string>}
 */
const generateWithModel = async (modelName, prompt) => {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = cleanRecipeHtml(response.text());

  if (!text) {
    throw new Error('No recipe content was generated');
  }

  return text;
};

/**
 * Generate recipes using Gemini AI with free-tier model fallback.
 * @param {Array<string>} ingredients - Array of ingredient names
 * @returns {Promise<string>} Generated recipe HTML
 * @throws {Error} Formatted AI error
 */
export const generateRecipe = async (ingredients) => {
  try {
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error('At least one ingredient is required');
    }

    const prompt = formatRecipePrompt(ingredients);
    const preferredModel = import.meta.env.VITE_GEMINI_MODEL?.trim();
    const modelsToTry = preferredModel
      ? [preferredModel, ...GEMINI_FREE_TIER_MODELS.filter((m) => m !== preferredModel)]
      : GEMINI_FREE_TIER_MODELS;

    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const html = await generateWithModel(modelName, prompt);
        console.info(`[AI] Recipe generated with ${modelName}`);
        return html;
      } catch (error) {
        lastError = error;
        const hasMoreModels = modelsToTry.indexOf(modelName) < modelsToTry.length - 1;

        if (hasMoreModels && shouldTryNextModel(error)) {
          console.warn(`[AI] ${modelName} unavailable, trying next model:`, error.message);
          continue;
        }

        break;
      }
    }

    if (lastError?.message?.includes('API key')) {
      throw lastError;
    }

    throw lastError || new Error('All Gemini models failed');
  } catch (error) {
    if (error.message?.includes('API key')) {
      throw error;
    }
    throw new Error(formatAIError(error));
  }
};
