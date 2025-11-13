import { useState, useEffect } from 'react';
import * as authService from '../services/auth.service';

/**
 * Custom hook for managing authentication state and operations
 * @returns {Object} Auth state and methods
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Sign up a new user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Result object
   */
  const signUp = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signUp(email, password);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Sign in an existing user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Result object
   */
  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signIn(email, password);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Sign in with Google OAuth
   * @returns {Promise<Object>} Result object
   */
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signInWithGoogle();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Sign out the current user
   * @returns {Promise<Object>} Result object
   */
  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signOut();
      setUser(null);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut
  };
};
