import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "./common/Toast";
import ConfirmDialog from "./common/ConfirmDialog";
import AddItem from "./AddItem";
import ItemComponent from "./ItemComponent";
import ItemFilters from "./items/ItemFilters";
import Recipe from "./Recipe";
import SavedRecipes from "./recipes/SavedRecipes";
import { useItems } from "../hooks/useItems";
import { useRecipes } from "../hooks/useRecipes";

const EmptyPantry = ({ hasSearch }) => (
  <div className="empty-state">
    <svg className="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
    <p className="text-lg font-semibold text-ink">{hasSearch ? 'No items found' : 'Your pantry is empty'}</p>
    <p className="text-sm text-ink-muted mt-1.5 max-w-xs">
      {hasSearch ? 'Try a different search term or clear filters.' : 'Add your first item above to get started.'}
    </p>
  </div>
);

EmptyPantry.propTypes = {
  hasSearch: PropTypes.bool
};

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-2 p-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <div className="h-4 w-4 bg-gray-300 rounded"></div>
        <div className="h-8 bg-gray-300 rounded flex-1"></div>
        <div className="h-8 w-24 bg-gray-300 rounded"></div>
        <div className="h-8 w-16 bg-gray-300 rounded"></div>
      </div>
    ))}
  </div>
);

const Item = () => {
  const { user } = useAuth();
  const {
    items,
    allItems,
    loading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalPages,
    pageSize,
    filteredCount,
    addItem,
    updateItem,
    deleteItem,
    deleteItems
  } = useItems(user?.uid, user?.email);

  const {
    generateRecipe,
    currentRecipe,
    loading: recipeLoading,
    error: recipeError,
    clearRecipe
  } = useRecipes(user?.uid);

  const toast = useToast();

  const [checkedItems, setCheckedItems] = useState(new Set());
  const [activeTab, setActiveTab] = useState("pantry");
  const [confirmDialog, setConfirmDialog] = useState(null);

  const handleAddItem = useCallback(async (itemName, quantity) => {
    await addItem(itemName, quantity);
  }, [addItem]);

  const handleUpdateItem = useCallback(async (itemId, updates) => {
    await updateItem(itemId, updates);
  }, [updateItem]);

  const handleDeleteItem = useCallback(async (itemId) => {
    await deleteItem(itemId);
    setCheckedItems(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  }, [deleteItem]);

  const executeBatchDelete = useCallback(async () => {
    try {
      const idsToRemove = Array.from(checkedItems);
      if (idsToRemove.length > 0) {
        await deleteItems(idsToRemove);
        toast.success(`${idsToRemove.length} item${idsToRemove.length > 1 ? 's' : ''} deleted successfully`);
        setCheckedItems(new Set());
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete items");
    }
  }, [checkedItems, deleteItems, toast]);

  const handleBatchDelete = useCallback(() => {
    if (checkedItems.size === 0) {
      toast.warning("No items selected");
      return;
    }
    setConfirmDialog({
      title: "Delete selected items?",
      message: `Are you sure you want to delete ${checkedItems.size} item${checkedItems.size > 1 ? 's' : ''}? This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        setConfirmDialog(null);
        executeBatchDelete();
      }
    });
  }, [checkedItems.size, executeBatchDelete, toast]);

  const handleCheckboxChange = useCallback((itemId, checked) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (checked) {
        next.add(itemId);
      } else {
        next.delete(itemId);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (checkedItems.size === items.length && items.length > 0) {
      setCheckedItems(new Set());
    } else {
      setCheckedItems(new Set(items.map(item => item.id)));
    }
  }, [checkedItems.size, items]);

  const getSelectedIngredientNames = useCallback(() => {
    return allItems
      .filter(item => checkedItems.has(item.id))
      .map(item => item.itemName);
  }, [allItems, checkedItems]);

  const handleGetRecipe = useCallback(async () => {
    const ingredients = getSelectedIngredientNames();
    if (ingredients.length === 0) {
      toast.warning("Please select at least one item");
      return;
    }

    try {
      const result = await generateRecipe(ingredients);
      if (result.isCached) {
        toast.info("Recipe loaded from cache");
      } else {
        toast.success("Recipe generated successfully!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to generate recipe");
    }
  }, [generateRecipe, getSelectedIngredientNames, toast]);

  const handleCloseRecipe = useCallback(() => {
    clearRecipe();
  }, [clearRecipe]);

  const handleRetryRecipe = useCallback(async () => {
    const ingredients = getSelectedIngredientNames();
    if (ingredients.length === 0) {
      toast.warning("Please select at least one item");
      return;
    }

    try {
      const result = await generateRecipe(ingredients);
      if (result.isCached) {
        toast.info("Recipe loaded from cache");
      } else {
        toast.success("Recipe generated successfully!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to generate recipe");
    }
  }, [generateRecipe, getSelectedIngredientNames, toast]);

  const handleRequestDelete = useCallback((itemId, itemName) => {
    setConfirmDialog({
      title: "Delete item?",
      message: `Are you sure you want to delete "${itemName}"? This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await handleDeleteItem(itemId);
          toast.success(`${itemName} deleted successfully`);
        } catch (err) {
          toast.error(err.message || "Failed to delete item");
        }
      }
    });
  }, [handleDeleteItem, toast]);

  return (
    <div className="page-bg flex w-full">
      {(currentRecipe || recipeLoading || recipeError) && (
        <Recipe
          recipe={currentRecipe?.html}
          isCached={currentRecipe?.isCached}
          onClose={handleCloseRecipe}
          onRetry={handleRetryRecipe}
          loading={recipeLoading}
          error={recipeError}
        />
      )}

      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmLabel={confirmDialog.confirmLabel}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Page header */}
        <div className="mb-6 animate-slide-up">
          <h1 className="section-title">My Pantry</h1>
          <p className="section-subtitle mt-1">
            {allItems.length} item{allItems.length !== 1 ? 's' : ''} tracked
            {checkedItems.size > 0 && ` · ${checkedItems.size} selected`}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-white rounded-2xl border border-c3/70 shadow-soft w-fit animate-slide-up">
          <button
            type="button"
            onClick={() => setActiveTab("pantry")}
            className={`tab-pill ${activeTab === "pantry" ? "tab-pill-active" : "tab-pill-inactive"}`}
          >
            📦 Pantry
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("recipes")}
            className={`tab-pill ${activeTab === "recipes" ? "tab-pill-active" : "tab-pill-inactive"}`}
          >
            🍳 Saved Recipes
          </button>
        </div>

        {activeTab === "recipes" ? (
          <SavedRecipes userId={user?.uid} />
        ) : (
          <>
            <AddItem onAddItem={handleAddItem} loading={loading} />

            <ItemFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filteredCount={filteredCount}
              totalCount={allItems.length}
            />

            {checkedItems.size > 0 && (
              <div className="mb-4 flex justify-end animate-slide-down">
                <button onClick={handleBatchDelete} className="btn-danger">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete {checkedItems.size} selected
                </button>
              </div>
            )}

            <div className="card-elevated overflow-hidden animate-fade-in">
              {!loading && items.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-3 border-b border-c3/60 bg-c1 text-xs font-semibold text-ink-muted uppercase tracking-wide">
                  <input
                    type="checkbox"
                    checked={items.length > 0 && checkedItems.size === items.length}
                    onChange={handleSelectAll}
                    disabled={loading || items.length === 0}
                    className="w-4 h-4 cursor-pointer accent-c4"
                    aria-label="Select all items on this page"
                  />
                  <span className="flex-1">Item</span>
                  <span className="w-28 text-center hidden sm:block">Quantity</span>
                  <span className="w-8" />
                </div>
              )}

              <div className="max-h-[calc(100vh-420px)] overflow-y-auto py-1">
                {loading ? (
                  <SkeletonLoader />
                ) : items.length === 0 ? (
                  <EmptyPantry hasSearch={!!searchTerm} />
                ) : (
                  items.map((item) => (
                    <ItemComponent
                      key={item.id}
                      docId={item.id}
                      itemName={item.itemName}
                      quantity={item.quantity}
                      checked={checkedItems.has(item.id)}
                      onUpdate={handleUpdateItem}
                      onDelete={handleRequestDelete}
                      onCheckboxChange={handleCheckboxChange}
                    />
                  ))
                )}
              </div>

              {filteredCount > pageSize && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-c2 bg-c1/40">
                  <span className="text-sm text-ink-muted">
                    {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredCount)} of {filteredCount}
                  </span>
                  <div className="flex gap-1.5">
                    <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="btn-ghost !text-sm disabled:opacity-40">← Prev</button>
                    <span className="px-3 py-1.5 text-sm font-semibold text-ink">{page}/{totalPages}</span>
                    <button type="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn-ghost !text-sm disabled:opacity-40">Next →</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {activeTab === "pantry" && checkedItems.size > 0 && (
        <div className="fixed bottom-6 right-6 z-40 animate-scale-in">
          <button
            onClick={handleGetRecipe}
            disabled={recipeLoading}
            className="btn-primary !rounded-full !py-4 !px-6 shadow-float hover:shadow-float text-base disabled:opacity-60"
            aria-label="Generate recipe from selected items"
          >
            {recipeLoading ? 'Generating...' : `🍳 Get Recipe (${checkedItems.size})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default Item;
