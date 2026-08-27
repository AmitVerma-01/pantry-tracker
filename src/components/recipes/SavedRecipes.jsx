import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useRecipes } from '../../hooks/useRecipes';
import { useToast } from '../common/Toast';
import ConfirmDialog from '../common/ConfirmDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import Recipe from '../Recipe';

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const SavedRecipes = ({ userId }) => {
  const { recipes, loading, loadRecipes, deleteRecipe } = useRecipes(userId);
  const toast = useToast();
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (userId) {
      loadRecipes().catch((err) => {
        toast.error(err.message || 'Failed to load saved recipes');
      });
    }
  }, [userId, loadRecipes, toast]);

  const handleDelete = useCallback(async (recipeId) => {
    setDeleting(true);
    try {
      await deleteRecipe(recipeId);
      toast.success('Recipe deleted');
      setConfirmDelete(null);
      if (viewingRecipe?.id === recipeId) {
        setViewingRecipe(null);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete recipe');
    } finally {
      setDeleting(false);
    }
  }, [deleteRecipe, toast, viewingRecipe]);

  if (loading && recipes.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner variant="inline" size="lg" text="Loading saved recipes..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Saved Recipes</h2>

      {recipes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No saved recipes yet. Select pantry items and generate a recipe to get started!
        </p>
      ) : (
        <ul className="space-y-3">
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-c2 rounded-lg hover:bg-c1 transition-smooth"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {recipe.ingredients?.join(', ') || 'Unknown ingredients'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Saved {formatDate(recipe.createdAt)}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewingRecipe(recipe)}
                  className="px-4 py-2 bg-c4 text-white rounded-lg font-semibold hover:bg-c3 transition-smooth active:scale-95"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(recipe)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-smooth active:scale-95"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {viewingRecipe && (
        <Recipe
          recipe={viewingRecipe.recipeHtml}
          isCached={true}
          onClose={() => setViewingRecipe(null)}
          loading={false}
          error={null}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete recipe?"
          message={`Delete the recipe for "${confirmDelete.ingredients?.join(', ')}"?`}
          confirmLabel={deleting ? 'Deleting...' : 'Delete'}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => !deleting && setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

SavedRecipes.propTypes = {
  userId: PropTypes.string
};

export default SavedRecipes;
