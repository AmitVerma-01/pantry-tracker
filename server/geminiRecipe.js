import { GoogleGenerativeAI } from '@google/generative-ai';

export const GEMINI_FREE_TIER_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
];

const shouldTryNextModel = (error) => {
  const message = (error?.message || '').toLowerCase();
  const status = error?.status ?? error?.response?.status;

  if (status === 404 || status === 429 || status === 503) return true;

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

const cleanRecipeHtml = (text) => {
  return text.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
};

export const formatRecipePrompt = (ingredients) => {
  if (!ingredients?.length) {
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

const generateWithModel = async (apiKey, modelName, prompt) => {
  const genAI = new GoogleGenerativeAI(apiKey);
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
 * Generate recipe HTML server-side using Gemini with model fallback.
 * @param {string[]} ingredients
 * @param {{ geminiApiKey: string, preferredModel?: string }} config
 * @returns {Promise<string>}
 */
export const generateRecipeHtml = async (ingredients, { geminiApiKey, preferredModel }) => {
  if (!geminiApiKey) {
    throw new Error('Gemini API key is not configured on the server');
  }

  if (!ingredients?.length) {
    throw new Error('At least one ingredient is required');
  }

  const prompt = formatRecipePrompt(ingredients);
  const modelsToTry = preferredModel
    ? [preferredModel, ...GEMINI_FREE_TIER_MODELS.filter((m) => m !== preferredModel)]
    : GEMINI_FREE_TIER_MODELS;

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const html = await generateWithModel(geminiApiKey, modelName, prompt);
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

  throw lastError || new Error('All Gemini models failed');
};
