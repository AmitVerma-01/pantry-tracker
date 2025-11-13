import { GoogleGenerativeAI } from '@google/generative-ai';
import { formatAIError } from '../utils/errorHandler';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
  <h2 class="text-3xl font-bold text-gray-800 mb-6">Recipes with ${ingredientList}</h2>
  
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <h3 class="text-2xl font-semibold text-c4 mb-3">[Recipe Name]</h3>
    <p class="text-gray-600 mb-4 italic">[Brief description]</p>
    
    <div class="mb-4">
      <h4 class="font-semibold text-lg mb-2">Ingredients:</h4>
      <ul class="list-disc ml-6 space-y-1 text-gray-700">
        <li>[ingredient]</li>
      </ul>
    </div>
    
    <div>
      <h4 class="font-semibold text-lg mb-2">Instructions:</h4>
      <ol class="list-decimal ml-6 space-y-2 text-gray-700">
        <li>[step]</li>
      </ol>
    </div>
  </div>
</div>

Return ONLY the HTML code without markdown code blocks or explanations.`;
};

/**
 * Generate recipes using Gemini AI
 * @param {Array<string>} ingredients - Array of ingredient names
 * @returns {Promise<string>} Generated recipe HTML
 * @throws {Error} Formatted AI error
 */
export const generateRecipe = async (ingredients) => {
  try {
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error('At least one ingredient is required');
    }

    // Check if API key is configured
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file');
    }

    const prompt = formatRecipePrompt(ingredients);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up response - remove markdown code blocks if present
    text = text.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
    
    if (!text) {
      throw new Error('No recipe content was generated');
    }

    return text;
  } catch (error) {
    // Handle specific Gemini API errors
    if (error.message?.includes('API key')) {
      throw error; // Pass through API key errors as-is
    }
    throw new Error(formatAIError(error));
  }
};
