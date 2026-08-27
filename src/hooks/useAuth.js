import { useFirebase } from '../context/firebase';

/**
 * Thin wrapper around auth context — single source of truth for auth state
 * @returns {Object} Auth state and methods
 */
export const useAuth = () => {
  return useFirebase();
};
