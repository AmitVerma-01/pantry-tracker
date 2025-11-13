import { useState, useCallback } from 'react';
import * as firestoreService from '../services/firestore.service';
import * as aiService from '../services/ai.service';

/**
 * Custom hook for managing recipe generation and storage with caching
 * @param {string} userId - Current user's ID
 * @returns {Object} Recipe state and methods
 */
export const useRecipes = (userId) => {
  const [recipes, setRecipes] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load all saved recipes for the user
   * @returns {Promise<Array>} Array of recipes
   */
  const loadRecipes = useCallback(async () => {
    if (!userId) {
      setRecipes([]);
      return [];
    }

    setLoading(true);
    setError(null);
    try {
      const userRecipes = await firestoreService.getRecipes(userId);
      setRecipes(userRecipes);
      setLoading(false);
      return userRecipes;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [userId]);

  /**
   * Generate a recipe from ingredients (checks cache first)
   * @param {Array<string>} ingredients - Array of ingredient names
   * @returns {Promise<Object>} Recipe object with HTML and metadata
   */
  const generateRecipe = useCallback(async (ingredients) => {
    if (!userId) {
      throw new Error('User must be authenticated to generate recipes');
    }

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error('At least one ingredient is required');
    }

    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedRecipe = await firestoreService.getCachedRecipe(userId, ingredients);
      
      if (cachedRecipe) {
        setCurrentRecipe({
          html: cachedRecipe.recipeHtml,
          ingredients: cachedRecipe.ingredients,
          isCached: true,
          recipeId: cachedRecipe.id,
          createdAt: cachedRecipe.createdAt
        });
        setLoading(false);
        return {
          html: cachedRecipe.recipeHtml,
          ingredients: cachedRecipe.ingredients,
          isCached: true,
          recipeId: cachedRecipe.id,
          message: 'Recipe loaded from cache'
        };
      }

      // Generate new recipe if not cached
      const recipeHtml = await aiService.generateRecipe(ingredients);
      
      // Save to Firestore
      const saveResult = await firestoreService.saveRecipe(userId, ingredients, recipeHtml);
      
      const newRecipe = {
        html: recipeHtml,
        ingredients,
        isCached: false,
        recipeId: saveResult.recipeId
      };

      setCurrentRecipe(newRecipe);
      setLoading(false);
      
      return {
        ...newRecipe,
        message: 'Recipe generated successfully'
      };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [userId]);

  /**
   * Save the current recipe (if not already saved)
   * @param {Array<string>} ingredients - Array of ingredient names
   * @param {string} recipeHtml - Recipe HTML content
   * @returns {Promise<Object>} Result object
   */
  const saveRecipe = useCallback(async (ingredients, recipeHtml) => {
    if (!userId) {
      throw new Error('User must be authenticated to save recipes');
    }

    setError(null);
    try {
      const result = await firestoreService.saveRecipe(userId, ingredients, recipeHtml);
      
      // Reload recipes list
      await loadRecipes();
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, loadRecipes]);

  /**
   * Delete a saved recipe
   * @param {string} recipeId - Recipe document ID
   * @returns {Promise<void>}
   */
  const deleteRecipe = useCallback(async (recipeId) => {
    if (!recipeId) {
      throw new Error('Recipe ID is required');
    }

    setError(null);
    try {
      // Use the deleteItem method from firestore service (works for any document)
      await firestoreService.deleteItem(recipeId);
      
      // Update local state
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      
      // Clear current recipe if it was deleted
      if (currentRecipe?.recipeId === recipeId) {
        setCurrentRecipe(null);
      }
      
      return {
        success: true,
        message: 'Recipe deleted successfully'
      };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [currentRecipe]);

  /**
   * Clear the current recipe from state
   */
  const clearRecipe = useCallback(() => {
    setCurrentRecipe(null);
    setError(null);
  }, []);

  return {
    recipes,
    currentRecipe,
    loading,
    error,
    generateRecipe,
    saveRecipe,
    deleteRecipe,
    clearRecipe,
    loadRecipes
  };
};
