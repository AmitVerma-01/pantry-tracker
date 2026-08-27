import { useState, useCallback } from "react";
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
    <div className="flex w-full min-h-[calc(100vh-64px)] bg-gradient-to-br from-c1 to-c2">
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

      <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("pantry")}
            className={`px-4 py-2 rounded-lg font-semibold transition-smooth ${
              activeTab === "pantry"
                ? "bg-c4 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-c2"
            }`}
          >
            Pantry
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("recipes")}
            className={`px-4 py-2 rounded-lg font-semibold transition-smooth ${
              activeTab === "recipes"
                ? "bg-c4 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-c2"
            }`}
          >
            Saved Recipes
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
                <button
                  onClick={handleBatchDelete}
                  className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:shadow-lg transition-smooth flex items-center gap-2 font-semibold active:scale-95"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Delete Selected ({checkedItems.size})
                </button>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-xl overflow-hidden animate-fade-in">
              <div className="border-b-2 border-c4 flex w-full h-14 items-center text-sm md:text-base font-bold bg-gradient-to-r from-c3 to-c2">
                <div className="border-r border-c4 w-3/5 text-center p-2 flex items-center justify-center gap-2">
                  <input
                    type="checkbox"
                    checked={items.length > 0 && checkedItems.size === items.length}
                    onChange={handleSelectAll}
                    disabled={loading || items.length === 0}
                    className="w-4 h-4 cursor-pointer disabled:opacity-50 accent-c4 transition-transform hover:scale-110"
                    aria-label="Select all items on this page"
                  />
                  <span className="text-gray-800">Item Name</span>
                </div>
                <div className="border-r border-c4 w-1/5 text-center p-2 text-gray-800">Quantity</div>
                <div className="w-1/5 text-center p-2 text-gray-800">Actions</div>
              </div>

              <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                {loading ? (
                  <SkeletonLoader />
                ) : items.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    {searchTerm ? (
                      <div>
                        <p className="text-lg font-medium">No items found</p>
                        <p className="text-sm mt-2">Try adjusting your search or filters</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-medium">No items yet</p>
                        <p className="text-sm mt-2">Add your first item above to get started!</p>
                      </div>
                    )}
                  </div>
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
                <div className="flex items-center justify-between px-4 py-3 border-t border-c2 bg-c1">
                  <span className="text-sm text-gray-600">
                    Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredCount)} of {filteredCount}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-3 py-1 rounded-lg bg-c2 hover:bg-c3 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth text-sm font-semibold"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm font-medium text-gray-700">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="px-3 py-1 rounded-lg bg-c2 hover:bg-c3 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth text-sm font-semibold"
                    >
                      Next
                    </button>
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
            className="bg-gradient-to-r from-c4 to-c3 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-smooth transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center gap-2 text-lg active:scale-95"
            aria-label="Generate recipe from selected items"
          >
            {recipeLoading ? (
              <>
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <span className="text-2xl">🍳</span>
                Get Recipe ({checkedItems.size})
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Item;
