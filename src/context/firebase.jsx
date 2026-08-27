/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as authService from '../services/auth.service';

const AuthContext = createContext(null);

/**
 * Hook to access auth context
 * @returns {Object} Auth context value
 */
export const useFirebase = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

/**
 * Unified auth provider — single listener, all auth methods
 */
export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isLoggedIn = useMemo(() => !!user, [user]);

  const signUp = useCallback(async (email, password) => {
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
  }, []);

  const signIn = useCallback(async (email, password) => {
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
  }, []);

  const signInWithGoogle = useCallback(async () => {
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
  }, []);

  const signOut = useCallback(async () => {
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
  }, []);

  const contextValue = useMemo(() => ({
    user,
    loading,
    isLoggedIn,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut
  }), [user, loading, isLoggedIn, error, signUp, signIn, signInWithGoogle, signOut]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

FirebaseProvider.propTypes = {
  children: PropTypes.node.isRequired
};
