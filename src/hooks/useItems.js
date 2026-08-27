import { useState, useEffect, useMemo, useCallback } from 'react';
import * as firestoreService from '../services/firestore.service';

const PAGE_SIZE = 50;
const PREFS_PREFIX = 'pantry_prefs_';

const loadPrefs = (userId) => {
  if (!userId) return { sortBy: 'date', searchTerm: '' };
  try {
    const stored = localStorage.getItem(`${PREFS_PREFIX}${userId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        sortBy: parsed.sortBy || 'date',
        searchTerm: parsed.searchTerm || ''
      };
    }
  } catch {
    // ignore invalid storage
  }
  return { sortBy: 'date', searchTerm: '' };
};

const savePrefs = (userId, sortBy, searchTerm) => {
  if (!userId) return;
  try {
    localStorage.setItem(`${PREFS_PREFIX}${userId}`, JSON.stringify({ sortBy, searchTerm }));
  } catch {
    // ignore quota errors
  }
};

/**
 * Custom hook for managing pantry items with real-time updates, search, sort, and pagination
 * @param {string} userId - Current user's ID
 * @param {string} userEmail - Current user's email
 * @returns {Object} Items state and methods
 */
export const useItems = (userId, userEmail) => {
  const initialPrefs = useMemo(() => loadPrefs(userId), [userId]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTermState] = useState(initialPrefs.searchTerm);
  const [sortBy, setSortByState] = useState(initialPrefs.sortBy);
  const [page, setPage] = useState(1);

  // Restore prefs when userId changes
  useEffect(() => {
    const prefs = loadPrefs(userId);
    setSearchTermState(prefs.searchTerm);
    setSortByState(prefs.sortBy);
    setPage(1);
  }, [userId]);

  const setSearchTerm = useCallback((term) => {
    setSearchTermState(term);
    setPage(1);
    if (userId) savePrefs(userId, sortBy, term);
  }, [userId, sortBy]);

  const setSortBy = useCallback((value) => {
    setSortByState(value);
    setPage(1);
    if (userId) savePrefs(userId, value, searchTerm);
  }, [userId, searchTerm]);

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

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(item =>
        item.itemName?.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.itemName || '').localeCompare(b.itemName || '');
        case 'quantity':
          return (b.quantity || 0) - (a.quantity || 0);
        case 'date':
        default: {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        }
      }
    });

    return result;
  }, [items, searchTerm, sortBy]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredAndSortedItems.length / PAGE_SIZE)),
    [filteredAndSortedItems.length]
  );

  // Clamp page when list shrinks
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAndSortedItems.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedItems, page]);

  const addItem = useCallback(async (itemName, quantity) => {
    if (!userId) {
      throw new Error('User must be authenticated to add items');
    }
    if (!userEmail) {
      throw new Error('User email is required to add items');
    }

    setError(null);
    try {
      const result = await firestoreService.addItem(userId, userEmail, itemName, quantity);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, userEmail]);

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
    items: paginatedItems,
    allItems: items,
    filteredItems: filteredAndSortedItems,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
    filteredCount: filteredAndSortedItems.length,
    addItem,
    updateItem,
    deleteItem,
    deleteItems
  };
};
