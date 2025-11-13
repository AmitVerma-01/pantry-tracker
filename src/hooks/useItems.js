import { useState, useEffect, useMemo, useCallback } from 'react';
import * as firestoreService from '../services/firestore.service';

/**
 * Custom hook for managing pantry items with real-time updates, search, and sort
 * @param {string} userId - Current user's ID
 * @returns {Object} Items state and methods
 */
export const useItems = (userId) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'name', 'quantity'
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Subscribe to real-time item updates
  useEffect(() => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = firestoreService.subscribeToItems(
      userId,
      (updatedItems, subscriptionError) => {
        if (subscriptionError) {
          setError(subscriptionError);
        } else {
          setItems(updatedItems);
          setError(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Apply search filter
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      result = result.filter(item =>
        item.itemName?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.itemName || '').localeCompare(b.itemName || '');
        case 'quantity':
          return (b.quantity || 0) - (a.quantity || 0);
        case 'date':
        default:
          // Sort by createdAt descending (newest first)
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
      }
    });

    return result;
  }, [items, debouncedSearchTerm, sortBy]);

  /**
   * Add a new item or update existing item quantity
   * @param {string} itemName - Name of the item
   * @param {number} quantity - Item quantity
   * @returns {Promise<Object>} Result object
   */
  const addItem = useCallback(async (itemName, quantity) => {
    if (!userId) {
      throw new Error('User must be authenticated to add items');
    }

    setError(null);
    try {
      const result = await firestoreService.addItem(userId, itemName, quantity);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId]);

  /**
   * Update an item's fields
   * @param {string} itemId - Item document ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Result object
   */
  const updateItem = useCallback(async (itemId, updates) => {
    setError(null);
    try {
      const result = await firestoreService.updateItem(itemId, updates);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Delete a single item
   * @param {string} itemId - Item document ID
   * @returns {Promise<Object>} Result object
   */
  const deleteItem = useCallback(async (itemId) => {
    setError(null);
    try {
      const result = await firestoreService.deleteItem(itemId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Delete multiple items using batch operation
   * @param {Array<string>} itemIds - Array of item document IDs
   * @returns {Promise<Object>} Result object
   */
  const deleteItems = useCallback(async (itemIds) => {
    setError(null);
    try {
      const result = await firestoreService.deleteItems(itemIds);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    items: filteredAndSortedItems,
    allItems: items,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    addItem,
    updateItem,
    deleteItem,
    deleteItems
  };
};
