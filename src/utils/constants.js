/**
 * Application-wide constants
 */

// Error messages
export const ERROR_MESSAGES = {
  // Generic errors
  GENERIC: 'An unexpected error occurred. Please try again.',

  // Authentication errors
  AUTH: {
    EMAIL_IN_USE: 'This email is already registered',
    INVALID_EMAIL: 'Please enter a valid email address',
    WEAK_PASSWORD: 'Password must be at least 6 characters',
    USER_NOT_FOUND: 'No account found with this email',
    WRONG_PASSWORD: 'Incorrect password',
    TOO_MANY_REQUESTS: 'Too many failed attempts. Please try again later',
    USER_DISABLED: 'This account has been disabled',
    OPERATION_NOT_ALLOWED: 'This operation is not allowed',
    POPUP_CLOSED: 'Sign-in popup was closed before completing',
    GENERIC: 'Authentication failed. Please try again'
  },

  // Firestore errors
  FIRESTORE: {
    PERMISSION_DENIED: "You don't have permission to perform this action",
    NOT_FOUND: 'The requested item was not found',
    UNAVAILABLE: 'Service temporarily unavailable. Please try again',
    ALREADY_EXISTS: 'This item already exists',
    RESOURCE_EXHAUSTED: 'Too many requests. Please try again later',
    FAILED_PRECONDITION: 'Operation failed. Please refresh and try again',
    ABORTED: 'Operation was aborted. Please try again',
    OUT_OF_RANGE: 'Invalid data range provided',
    UNAUTHENTICATED: 'Please sign in to continue',
    DEADLINE_EXCEEDED: 'Request timed out. Please try again',
    GENERIC: 'Database operation failed. Please try again'
  },

  // AI/Recipe generation errors
  AI: {
    RATE_LIMIT: 'Recipe generation limit reached. Please try again later',
    INVALID_API_KEY: 'Recipe service configuration error. Please contact support',
    INVALID_REQUEST: 'Invalid recipe request. Please check your ingredients',
    SERVICE_UNAVAILABLE: 'Recipe service is temporarily unavailable. Please try again',
    NETWORK_ERROR: 'Network error. Please check your connection and try again',
    GENERIC: 'Failed to generate recipe. Please try again'
  },

  // Validation errors
  VALIDATION: {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
    ITEM_NAME_REQUIRED: 'Item name is required',
    ITEM_NAME_TOO_SHORT: 'Item name must be at least 2 characters',
    QUANTITY_REQUIRED: 'Quantity is required',
    QUANTITY_INVALID: 'Quantity must be a positive number',
    QUANTITY_NOT_INTEGER: 'Quantity must be a whole number',
    DUPLICATE_ITEM: 'This item already exists in your pantry'
  }
};

// Success messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    SIGNUP: 'Account created successfully!',
    SIGNIN: 'Signed in successfully!',
    SIGNOUT: 'Signed out successfully!',
    GOOGLE_SIGNIN: 'Signed in with Google successfully!'
  },
  ITEMS: {
    ADDED: 'Item added successfully!',
    UPDATED: 'Item updated successfully!',
    DELETED: 'Item deleted successfully!',
    BATCH_DELETED: 'Items deleted successfully!'
  },
  RECIPES: {
    GENERATED: 'Recipe generated successfully!',
    SAVED: 'Recipe saved successfully!',
    DELETED: 'Recipe deleted successfully!'
  }
};

// Validation rules
export const VALIDATION_RULES = {
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 254
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128
  },
  ITEM_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  QUANTITY: {
    MIN: 1,
    MAX: 9999
  }
};

// UI constants
export const UI_CONSTANTS = {
  TOAST: {
    DURATION: 3000, // 3 seconds
    POSITION: 'top-right',
    TYPES: {
      SUCCESS: 'success',
      ERROR: 'error',
      INFO: 'info',
      WARNING: 'warning'
    }
  },
  DEBOUNCE: {
    SEARCH: 300, // 300ms
    INPUT: 500 // 500ms
  },
  PAGINATION: {
    ITEMS_PER_PAGE: 50,
    RECIPES_PER_PAGE: 20
  },
  LOADING: {
    MIN_DISPLAY_TIME: 500 // Minimum time to show loader (prevents flashing)
  }
};

// Firestore collection names
export const COLLECTIONS = {
  ITEMS: 'items',
  RECIPES: 'recipes',
  USERS: 'users'
};

// Sort options
export const SORT_OPTIONS = {
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
  QUANTITY_ASC: 'quantity-asc',
  QUANTITY_DESC: 'quantity-desc',
  DATE_ASC: 'date-asc',
  DATE_DESC: 'date-desc'
};

// Local storage keys
export const STORAGE_KEYS = {
  SORT_PREFERENCE: 'pantry_sort_preference',
  FILTER_PREFERENCE: 'pantry_filter_preference',
  THEME_PREFERENCE: 'pantry_theme_preference'
};
