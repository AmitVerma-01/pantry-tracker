import { auth } from '../config/firebase.config';
import { formatAIError } from '../utils/errorHandler';

/**
 * Generate recipes via the server-side API (Gemini key stays off the client).
 * @param {Array<string>} ingredients - Array of ingredient names
 * @returns {Promise<string>} Generated recipe HTML
 * @throws {Error} Formatted AI error
 */
export const generateRecipe = async (ingredients) => {
  try {
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error('At least one ingredient is required');
    }

    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to generate recipes');
    }

    const idToken = await user.getIdToken();
    const response = await fetch('/api/generate-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ ingredients }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    if (!data.html) {
      throw new Error('No recipe content was generated');
    }

    return data.html;
  } catch (error) {
    throw new Error(formatAIError(error));
  }
};
