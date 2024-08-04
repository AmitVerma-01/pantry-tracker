import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

const FirebaseContext = createContext(null);
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_DB_URL
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  const isLoggedIn = useMemo(() => !!user, [user]);

  const signupUserWithEmailPassword = useCallback((email, password) =>
    createUserWithEmailAndPassword(auth, email, password), []);

  const signInWithEmailPassword = useCallback((email, password) =>
    signInWithEmailAndPassword(auth, email, password), []);

  const logOut = useCallback(async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, []);

  const addItem = useCallback(async (itemName, quantity) => {
    if (!user) throw new Error("User not authenticated");

    const itemsCollection = collection(firestore, 'items');
    const itemQuery = query(itemsCollection, where('itemName', '==', itemName), where('email', '==', user.email));
    const querySnapshot = await getDocs(itemQuery);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { quantity });
    } else {
      await addDoc(itemsCollection, { itemName, quantity, email: user.email });
    }
    await getItems();
  }, [user]);

  const updateItemQuantity = useCallback(async (docId, quantity) => {
    if (!docId) throw new Error("Document ID is required");
    if (quantity <= 0) throw new Error("Quantity must be a positive number");

    const itemRef = doc(firestore, 'items', docId);
    await updateDoc(itemRef, { quantity });
  }, []);

  const getItems = useCallback(async () => {
    if (!user) throw new Error("User not authenticated");

    const itemsCollection = collection(firestore, 'items');
    const itemsQuery = query(itemsCollection, where('email', '==', user.email));
    const querySnapshot = await getDocs(itemsQuery);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }, [user]);

  const increaseQuantity = useCallback(async (docId) => {
    if (!docId) throw new Error("Document ID is required");

    const itemRef = doc(firestore, 'items', docId);
    const docSnap = await getDoc(itemRef);

    if (docSnap.exists()) {
      const currentQuantity = docSnap.data().quantity;
      await updateDoc(itemRef, { quantity: Number(currentQuantity) + 1 });
    } else {
      console.error('Document not found');
    }
  }, []);

  const decreaseQuantity = useCallback(async (docId) => {
    if (!docId) throw new Error("Document ID is required");

    const itemRef = doc(firestore, 'items', docId);
    const docSnap = await getDoc(itemRef);

    if (docSnap.exists()) {
      const currentQuantity = docSnap.data().quantity;
      if (currentQuantity > 0) {
        await updateDoc(itemRef, { quantity: Number(currentQuantity) - 1 });
      } else {
        console.error('Quantity cannot be negative');
      }
    } else {
      console.error('Document not found');
    }
  }, []);

  const removeItem = useCallback(async (docId) => {
    if (!docId) throw new Error("Document ID is required");

    const itemRef = doc(firestore, 'items', docId);
    await deleteDoc(itemRef);

  }, []);

  const fetchRecipeFromModel = async (items) => {
    const prompt = `
    
    I have ${items.join(', ')}. Could you provide 2 - 3 recipes using these ingredients in HTML format within a div,
    <div class="container">
    <h2 id="h2-heading">Recipes with Banana, Milk, and Rice</h2>

    <div class="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 id="h3-heading">Banana Rice Pudding</h3>
      <p class="text-gray-700">A creamy and comforting dessert.</p>
      <ul class="list-disc ml-4">
        <li>1 ripe banana, mashed</li>
        <li>1 cup cooked rice</li>
        <li>1 cup milk</li>
        <li>1/4 cup sugar (adjust to taste)</li>
        <li>1/4 teaspoon cinnamon (optional)</li>
      </ul>
      <p class="text-gray-700">Instructions:</p>
      <ol class="list-decimal ml-4">
        <li>In a saucepan, combine mashed banana, cooked rice, milk, sugar, and cinnamon (if using).</li>
        <li>Heat over medium heat, stirring constantly, until mixture is heated through and slightly thickened.</li>
        <li>Serve warm or chilled.</li>
      </ol>
    </div>

  </div>
   take reference from this html code and use same classes
     give only html code in text format
  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    
    return text;
  }

  const contextValue = useMemo(() => ({
    signupUserWithEmailPassword,
    isLoggedIn,
    signInWithEmailPassword,
    addItem,
    getItems,
    logOut,
    updateItemQuantity,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    fetchRecipeFromModel
  }), [signupUserWithEmailPassword, isLoggedIn, signInWithEmailPassword, addItem, getItems, logOut, updateItemQuantity, increaseQuantity, decreaseQuantity, removeItem]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      {children}
    </FirebaseContext.Provider>
  );
};
