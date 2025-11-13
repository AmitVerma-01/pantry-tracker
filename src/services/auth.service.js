import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { formatAuthError } from '../utils/errorHandler';

// Initialize Google provider
const googleProvider = new GoogleAuthProvider();

// Set persistence to local storage
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting auth persistence:', error);
});

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} User credential object
 * @throws {Error} Formatted authentication error
 */
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
      message: 'Account created successfully'
    };
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
};

/**
 * Sign in an existing user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} User credential object
 * @throws {Error} Formatted authentication error
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
      message: 'Signed in successfully'
    };
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
};

/**
 * Sign in with Google OAuth
 * @returns {Promise<Object>} User credential object
 * @throws {Error} Formatted authentication error
 */
export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: userCredential.user,
      message: 'Signed in with Google successfully'
    };
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
};

/**
 * Sign out the current user
 * @returns {Promise<Object>} Success response
 * @throws {Error} Formatted authentication error
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return {
      success: true,
      message: 'Signed out successfully'
    };
  } catch (error) {
    throw new Error(formatAuthError(error));
  }
};

/**
 * Subscribe to authentication state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  }, (error) => {
    console.error('Auth state change error:', error);
    callback(null);
  });
};
