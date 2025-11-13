/**
 * Validation utilities for user inputs
 */

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, error: null };
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }

  return { isValid: true, error: null };
};

/**
 * Validates item name
 * @param {string} itemName - Item name to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const validateItemName = (itemName) => {
  if (!itemName || itemName.trim() === '') {
    return { isValid: false, error: 'Item name is required' };
  }

  if (itemName.trim().length < 2) {
    return { isValid: false, error: 'Item name must be at least 2 characters' };
  }

  return { isValid: true, error: null };
};

/**
 * Validates item quantity
 * @param {number|string} quantity - Quantity to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const validateQuantity = (quantity) => {
  const numQuantity = Number(quantity);

  if (isNaN(numQuantity)) {
    return { isValid: false, error: 'Quantity must be a number' };
  }

  if (numQuantity < 1) {
    return { isValid: false, error: 'Quantity must be a positive number' };
  }

  if (!Number.isInteger(numQuantity)) {
    return { isValid: false, error: 'Quantity must be a whole number' };
  }

  return { isValid: true, error: null };
};

/**
 * Validates an item object
 * @param {Object} item - Item object with itemName and quantity
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateItem = (item) => {
  const nameValidation = validateItemName(item.itemName);
  const quantityValidation = validateQuantity(item.quantity);

  return {
    isValid: nameValidation.isValid && quantityValidation.isValid,
    errors: {
      itemName: nameValidation.error,
      quantity: quantityValidation.error
    }
  };
};
