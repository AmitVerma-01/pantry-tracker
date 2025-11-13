/**
 * Error handling utilities for Firebase and API errors
 */

import { ERROR_MESSAGES } from './constants';

/**
 * Formats Firebase authentication errors into user-friendly messages
 * @param {Error} error - Firebase error object
 * @returns {string} User-friendly error message
 */
export const formatAuthError = (error) => {
  const errorCode = error?.code || '';

  switch (errorCode) {
    case 'auth/email-already-in-use':
      return ERROR_MESSAGES.AUTH.EMAIL_IN_USE;
    case 'auth/invalid-email':
      return ERROR_MESSAGES.AUTH.INVALID_EMAIL;
    case 'auth/weak-password':
      return ERROR_MESSAGES.AUTH.WEAK_PASSWORD;
    case 'auth/user-not-found':
      return ERROR_MESSAGES.AUTH.USER_NOT_FOUND;
    case 'auth/wrong-password':
      return ERROR_MESSAGES.AUTH.WRONG_PASSWORD;
    case 'auth/too-many-requests':
      return ERROR_MESSAGES.AUTH.TOO_MANY_REQUESTS;
    case 'auth/user-disabled':
      return ERROR_MESSAGES.AUTH.USER_DISABLED;
    case 'auth/operation-not-allowed':
      return ERROR_MESSAGES.AUTH.OPERATION_NOT_ALLOWED;
    case 'auth/popup-closed-by-user':
      return ERROR_MESSAGES.AUTH.POPUP_CLOSED;
    case 'auth/cancelled-popup-request':
      return ERROR_MESSAGES.AUTH.POPUP_CLOSED;
    default:
      return ERROR_MESSAGES.AUTH.GENERIC;
  }
};

/**
 * Formats Firestore errors into user-friendly messages
 * @param {Error} error - Firestore error object
 * @returns {string} User-friendly error message
 */
export const formatFirestoreError = (error) => {
  const errorCode = error?.code || '';

  switch (errorCode) {
    case 'permission-denied':
      return ERROR_MESSAGES.FIRESTORE.PERMISSION_DENIED;
    case 'not-found':
      return ERROR_MESSAGES.FIRESTORE.NOT_FOUND;
    case 'unavailable':
      return ERROR_MESSAGES.FIRESTORE.UNAVAILABLE;
    case 'already-exists':
      return ERROR_MESSAGES.FIRESTORE.ALREADY_EXISTS;
    case 'resource-exhausted':
      return ERROR_MESSAGES.FIRESTORE.RESOURCE_EXHAUSTED;
    case 'failed-precondition':
      return ERROR_MESSAGES.FIRESTORE.FAILED_PRECONDITION;
    case 'aborted':
      return ERROR_MESSAGES.FIRESTORE.ABORTED;
    case 'out-of-range':
      return ERROR_MESSAGES.FIRESTORE.OUT_OF_RANGE;
    case 'unauthenticated':
      return ERROR_MESSAGES.FIRESTORE.UNAUTHENTICATED;
    case 'deadline-exceeded':
      return ERROR_MESSAGES.FIRESTORE.DEADLINE_EXCEEDED;
    default:
      return ERROR_MESSAGES.FIRESTORE.GENERIC;
  }
};

/**
 * Formats AI/API errors into user-friendly messages
 * @param {Error} error - API error object
 * @returns {string} User-friendly error message
 */
export const formatAIError = (error) => {
  const errorMessage = error?.message?.toLowerCase() || '';
  const status = error?.status || error?.response?.status;

  if (status === 429 || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
    return ERROR_MESSAGES.AI.RATE_LIMIT;
  }

  if (status === 401 || errorMessage.includes('unauthorized') || errorMessage.includes('api key')) {
    return ERROR_MESSAGES.AI.INVALID_API_KEY;
  }

  if (status === 400 || errorMessage.includes('invalid')) {
    return ERROR_MESSAGES.AI.INVALID_REQUEST;
  }

  if (status >= 500 || errorMessage.includes('server') || errorMessage.includes('unavailable')) {
    return ERROR_MESSAGES.AI.SERVICE_UNAVAILABLE;
  }

  if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
    return ERROR_MESSAGES.AI.NETWORK_ERROR;
  }

  return ERROR_MESSAGES.AI.GENERIC;
};

/**
 * Generic error formatter that determines error type and formats accordingly
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred ('auth', 'firestore', 'ai')
 * @returns {string} User-friendly error message
 */
export const formatError = (error, context = 'generic') => {
  // Log error for debugging
  console.error(`[${context}] Error:`, error);

  switch (context) {
    case 'auth':
      return formatAuthError(error);
    case 'firestore':
      return formatFirestoreError(error);
    case 'ai':
      return formatAIError(error);
    default:
      return error?.message || ERROR_MESSAGES.GENERIC;
  }
};

/**
 * Creates a standardized error response object
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @returns {Object} { success: false, error: string, originalError: Error }
 */
export const createErrorResponse = (error, context = 'generic') => {
  return {
    success: false,
    error: formatError(error, context),
    originalError: error
  };
};

/**
 * Creates a standardized success response object
 * @param {*} data - Response data
 * @returns {Object} { success: true, data: * }
 */
export const createSuccessResponse = (data) => {
  return {
    success: true,
    data
  };
};
