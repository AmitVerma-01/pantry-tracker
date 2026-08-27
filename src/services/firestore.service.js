import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc, 
  deleteDoc,
  writeBatch,
  onSnapshot,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { formatFirestoreError } from '../utils/errorHandler';

// Collection names
const ITEMS_COLLECTION = 'items';
const RECIPES_COLLECTION = 'recipes';

/**
 * Add a new item or update existing item quantity
 * @param {string} userId - User's unique ID
 * @param {string} email - User's email address
 * @param {string} itemName - Name of the item
 * @param {number} quantity - Item quantity
 * @returns {Promise<Object>} Success response with item data
 * @throws {Error} Formatted Firestore error
 */
export const addItem = async (userId, email, itemName, quantity) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!email?.trim()) throw new Error('User email is required');
    if (!itemName?.trim()) throw new Error('Item name is required');
    if (quantity <= 0) throw new Error('Quantity must be positive');

    const itemsCollection = collection(db, ITEMS_COLLECTION);
    const itemQuery = query(
      itemsCollection, 
      where('itemName', '==', itemName.trim()), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(itemQuery);

    if (!querySnapshot.empty) {
      // Update existing item
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { 
        quantity: Number(quantity),
        updatedAt: serverTimestamp()
      });
      return {
        success: true,
        message: 'Item quantity updated',
        itemId: docRef.id,
        isUpdate: true
      };
    } else {
      // Create new item
      const docRef = await addDoc(itemsCollection, { 
        itemName: itemName.trim(), 
        quantity: Number(quantity), 
        userId,
        email: email.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return {
        success: true,
        message: 'Item added successfully',
        itemId: docRef.id,
        isUpdate: false
      };
    }
  } catch (error) {
    throw new Error(formatFirestoreError(error));
  }
};

/**
 * Get all items for a user
 * @param {string} userId - User's unique ID
 * @returns {Promise<Array>} Array of item objects
 * @throws {Error} Formatted Firestore error
 */
export const getItems = async (userId) => {
  try {
    if (!userId) throw new Error('User ID is required');

    const itemsCollection = collection(db, ITEMS_COLLECTION);
    const itemsQuery = query(
      itemsCollection, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(itemsQuery);

    return querySnapshot.docs.map((doc) => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (error) {
    throw new Error(formatFirestoreError(error));
  }
};

/**
 * Subscribe to real-time updates for user's items
 * @param {string} userId - User's unique ID
 * @param {Function} callback - Callback function to handle item updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToItems = (userId, callback) => {
  if (!userId) {
    console.error('User ID is required for subscription');
    return () => {};
  }

  const itemsCollection = collection(db, ITEMS_COLLECTION);
  const itemsQuery = query(
    itemsCollection, 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    itemsQuery, 
    (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      callback(items, null);
    }, 
    (error) => {
      console.error('Error in items subscription:', error);
      callback([], formatFirestoreError(error));
    }
  );
};

/**
 * Update an item's fields
 * @param {string} itemId - Item document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Success response
 * @throws {Error} Formatted Firestore error
 */
export const updateItem = async (itemId, updates) => {
  try {
    if (!itemId) throw new Error('Item ID is required');
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('Updates object is required');
    }

    const itemRef = doc(db, ITEMS_COLLECTION, itemId);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      message: 'Item updated successfully'
    };
  } catch (error) {
    throw new Error(formatFirestoreError(error));
  }
};

/**
 * Delete a single item
 * @param {string} itemId - Item document ID
 * @returns {Promise<Object>} Success response
 * @throws {Error} Formatted Firestore error
 */
export const deleteItem = async (itemId) => {
  try {
    if (!itemId) throw new Error('Item ID is required');

    const itemRef = doc(db, ITEMS_COLLECTION, itemId);
    await deleteDoc(itemRef);

    return {
      success: true,
      message: 'Item deleted successfully'
    };
  } catch (error) {
    throw new Error(formatFirestoreError(error));
  }
};

/**
 * Delete multiple items using batch operation
 * @param {Array<string>} itemIds - Array of item document IDs
 * @returns {Promise<Object>} Success response
 * @throws {Error} Formatted Firestore error
 */
export const deleteItems = async (itemIds) => {
  try {
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      throw new Error('Item IDs array is required');
    }

    const batch = writeBatch(db);
    itemIds.forEach(itemId => {
      const itemRef = doc(db, ITEMS_COLLECTION, itemId);
      batch.delete(itemRef);
    });
    await batch.commit();

    return {
      success: true,
      message: `${itemIds.length} item(s) deleted successfully`
    };
  } catch (error) {
    throw new Error(formatFirestoreError(error));
  }
};

/**
 * Generate a hash for ingredient combination
 * @param {Array<string>} ingredients - Array of ingredient names
 * @returns {string} Hash string
 */
const generateIngredientsHash = (ingredients) => {
  return ingredients
    .map(i => i.toLowerCase().trim())
    .sort()
    .join('|');
};

/**
 * Save a generated recipe to Firestore
 * @param {string} userId - User's unique ID
 * @param {Array<string>} ingredients - Array of ingredient names
 * @param {string} recipeHtml - Generated recipe HTML
 * @returns {Promise<Object>} Success response with recipe ID
 * @throws {Error} Formatted Firestore error
 */
export const saveRecipe = async (userId, ingredients, recipeHtml) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error('Ingredients array is required');
    }
    if (!recipeHtml) throw new Error('Recipe HTML is required');

    const ingredientsHash = generateIngredientsHash(ingredients);
    const recipesCollection = collection(db, RECIPES_COLLECTION);

    const docRef = await addDoc(recipesCollection, {
      userId,
      ingredients: ingredients.map(i => i.trim()),
      ingredientsHash,
      recipeHtml,
      createdAt: serverTimestamp(),
      lastAccessedAt: serverTimestamp()
    });

    return {
      success: true,
      message: 'Recipe saved successfully',
      recipeId: docRef.id
    };
  } catch (error) {
    throw new Error(formatFirestoreError(error));
  }
};

/**
 * Get all recipes for a user
 * @param {string} userId - User's unique ID
 * @returns {Promise<Array>} Array of recipe objects
 * @throws {Error} Formatted Firestore error
 */
export const getRecipes = async (userId) => {
  try {
    if (!userId) throw new Error('User ID is required');

    const recipesCollection = collection(db, RECIPES_COLLECTION);
    const recipesQuery = query(
      recipesCollection, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(recipesQuery);

    return querySnapshot.docs.map((doc) => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  } catch (error) {
    throw new Error(formatFirestoreError(error));
  }
};

/**
 * Check if a recipe exists for the given ingredients
 * @param {string} userId - User's unique ID
 * @param {Array<string>} ingredients - Array of ingredient names
 * @returns {Promise<Object|null>} Cached recipe object or null
 * @throws {Error} Formatted Firestore error
 */
export const getCachedRecipe = async (userId, ingredients) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return null;
    }

    const ingredientsHash = generateIngredientsHash(ingredients);
    const recipesCollection = collection(db, RECIPES_COLLECTION);
    const recipeQuery = query(
      recipesCollection,
      where('userId', '==', userId),
      where('ingredientsHash', '==', ingredientsHash)
    );
    const querySnapshot = await getDocs(recipeQuery);

    if (!querySnapshot.empty) {
      const recipeDoc = querySnapshot.docs[0];
      
      // Update last accessed timestamp
      await updateDoc(recipeDoc.ref, {
        lastAccessedAt: serverTimestamp()
      });

      return {
        id: recipeDoc.id,
        ...recipeDoc.data(),
        isCached: true
      };
    }

    return null;
  } catch (error) {
    throw new Error(formatFirestoreError(error));
  }
};

/**
 * Delete a saved recipe
 * @param {string} recipeId - Recipe document ID
 * @returns {Promise<Object>} Success response
 * @throws {Error} Formatted Firestore error
 */
export const deleteRecipe = async (recipeId) => {
  try {
    if (!recipeId) throw new Error('Recipe ID is required');

    const recipeRef = doc(db, RECIPES_COLLECTION, recipeId);
    await deleteDoc(recipeRef);

    return {
      success: true,
      message: 'Recipe deleted successfully'
    };
  } catch (error) {
    throw new Error(formatFirestoreError(error));
  }
};
