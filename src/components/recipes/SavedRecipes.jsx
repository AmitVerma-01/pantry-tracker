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
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
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
      if (viewingRecipe?.id === recipeId) setViewingRecipe(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete recipe');
    } finally {
      setDeleting(false);
    }
  }, [deleteRecipe, toast, viewingRecipe]);

  if (loading && recipes.length === 0) {
    return (
      <div className="card-elevated flex justify-center py-16">
        <LoadingSpinner variant="inline" size="lg" text="Loading saved recipes..." />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {recipes.length === 0 ? (
        <div className="card-elevated empty-state">
          <span className="text-5xl mb-4">🍳</span>
          <p className="text-lg font-semibold text-ink">No saved recipes yet</p>
          <p className="text-sm text-ink-muted mt-1.5 max-w-sm">
            Select pantry items and tap &ldquo;Get Recipe&rdquo; to generate and save your first one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="card p-5 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {recipe.ingredients?.slice(0, 4).map((ing) => (
                  <span key={ing} className="badge !normal-case !tracking-normal !text-xs !py-0.5">
                    {ing}
                  </span>
                ))}
                {(recipe.ingredients?.length ?? 0) > 4 && (
                  <span className="badge !normal-case !tracking-normal !text-xs !py-0.5">
                    +{recipe.ingredients.length - 4} more
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-faint mb-4">Saved {formatDate(recipe.createdAt)}</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setViewingRecipe(recipe)} className="btn-primary flex-1 !py-2 text-sm">
                  View recipe
                </button>
                <button type="button" onClick={() => setConfirmDelete(recipe)} className="btn-ghost !text-red-500 hover:!bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewingRecipe && (
        <Recipe recipe={viewingRecipe.recipeHtml} isCached={true} onClose={() => setViewingRecipe(null)} loading={false} error={null} />
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
