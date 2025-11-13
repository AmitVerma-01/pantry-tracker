import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import PropTypes from 'prop-types';

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
 * Simplified Firebase provider that only manages auth state
 * All business logic has been moved to services and hooks
 */
export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isLoggedIn = useMemo(() => !!user, [user]);

  const contextValue = useMemo(() => ({
    user,
    loading,
    isLoggedIn
  }), [user, loading, isLoggedIn]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

FirebaseProvider.propTypes = {
  children: PropTypes.node.isRequired
};
