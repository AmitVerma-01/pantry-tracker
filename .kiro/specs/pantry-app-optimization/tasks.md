# Implementation Plan

- [x] 1. Set up environment variables and configuration
  - Create .env file with all Firebase and Gemini API keys
  - Create .env.example file with placeholder values for documentation
  - Update .gitignore to exclude .env files
  - Create src/config/firebase.config.js to initialize Firebase services using environment variables
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Create utility modules
  - Create src/utils/validation.js with email, password, and item validation functions
  - Create src/utils/errorHandler.js to format Firebase and API errors into user-friendly messages
  - Create src/utils/constants.js for app-wide constants (error messages, validation rules, etc.)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.1, 5.2, 5.3_

- [x] 3. Implement service layer
- [x] 3.1 Create authentication service
  - Create src/services/auth.service.js with signUp, signIn, signInWithGoogle, signOut, and onAuthStateChange methods
  - Implement proper error handling and return consistent response format
  - _Requirements: 2.2, 5.1_

- [x] 3.2 Create Firestore service
  - Create src/services/firestore.service.js with item CRUD operations (addItem, getItems, subscribeToItems, updateItem, deleteItem, deleteItems)
  - Implement recipe operations (saveRecipe, getRecipes, getCachedRecipe)
  - Add batch delete functionality for multiple items
  - _Requirements: 2.3, 5.2, 6.1, 6.3, 12.1, 12.2_

- [x] 3.3 Create AI service
  - Create src/services/ai.service.js with generateRecipe and formatRecipePrompt methods
  - Configure Gemini API client using environment variable
  - Implement error handling for API failures
  - _Requirements: 2.4, 5.3_

- [x] 4. Create custom React hooks
- [x] 4.1 Create useAuth hook
  - Create src/hooks/useAuth.js that wraps auth service methods
  - Manage authentication state (user, loading, error)
  - Provide signUp, signIn, signInWithGoogle, and signOut methods
  - _Requirements: 2.5, 4.1, 5.1_

- [x] 4.2 Create useItems hook
  - Create src/hooks/useItems.js that wraps Firestore item operations
  - Manage items state with real-time updates using subscribeToItems
  - Implement search and sort functionality with debouncing
  - Provide addItem, updateItem, deleteItem, and deleteItems methods
  - _Requirements: 2.5, 4.2, 4.3, 6.3, 6.4, 10.1, 10.2, 10.3_

- [x] 4.3 Create useRecipes hook
  - Create src/hooks/useRecipes.js that wraps AI and recipe storage operations
  - Check cache before generating new recipes
  - Manage recipe state (recipes, currentRecipe, loading, error)
  - Provide generateRecipe, saveRecipe, deleteRecipe, and clearRecipe methods
  - _Requirements: 2.5, 4.4, 6.5, 12.1, 12.2, 12.4, 12.5_

- [x] 5. Create common UI components
- [x] 5.1 Create ErrorBoundary component
  - Create src/components/common/ErrorBoundary.jsx to catch React errors
  - Display user-friendly error message with reload option
  - Log errors to console for debugging
  - _Requirements: 5.5_

- [x] 5.2 Create Toast notification system
  - Create src/components/common/Toast.jsx for displaying temporary notifications
  - Support success, error, info, and warning types
  - Implement auto-dismiss after configurable duration
  - Position at top-right with smooth animations
  - _Requirements: 7.1, 7.2_

- [x] 5.3 Create LoadingSpinner component
  - Create src/components/common/LoadingSpinner.jsx with multiple variants (full-page, inline, button)
  - Use consistent styling with app theme
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ]* 5.4 Create ConfirmDialog component
  - Create src/components/common/ConfirmDialog.jsx for confirming destructive actions
  - Support custom messages and action buttons
  - _Requirements: 7.3_

- [x] 6. Refactor authentication components
- [x] 6.1 Update SignUp component
  - Refactor src/pages/Signup.jsx to use useAuth hook
  - Add real-time validation for email and password fields
  - Display inline error messages using validation utilities
  - Show loading state on submit button during signup
  - Display toast notification on successful signup
  - _Requirements: 3.1, 3.2, 3.5, 4.1, 4.5_

- [x] 6.2 Update SignIn component
  - Refactor src/pages/SignIn.jsx to use useAuth hook
  - Add real-time validation for email and password fields
  - Display inline error messages using validation utilities
  - Show loading state on submit button during signin
  - Display toast notification on successful signin
  - _Requirements: 3.1, 3.2, 3.5, 4.1, 4.5_

- [ ]* 6.3 Update GoogleButton component
  - Refactor src/components/GoogleButton.jsx to use useAuth hook
  - Add loading state during Google authentication
  - Handle and display authentication errors
  - _Requirements: 4.1, 5.1_

- [x] 7. Refactor item management components
- [x] 7.1 Update AddItem component
  - Refactor src/components/AddItem.jsx to use useItems hook
  - Add validation for item name (required, non-empty) and quantity (positive number)
  - Display inline validation errors
  - Show loading state during item addition
  - Display toast notification on success
  - _Requirements: 3.3, 3.4, 3.5, 4.2_

- [x] 7.2 Create ItemFilters component
  - Create src/components/items/ItemFilters.jsx for search and sort controls
  - Implement debounced search input (300ms delay)
  - Add sort dropdown (by name, quantity, date added)
  - Display filtered item count
  - _Requirements: 6.4, 10.1, 10.2, 10.3, 10.5_

- [x] 7.3 Update ItemComponent
  - Refactor src/components/ItemComponent.jsx to use useItems hook
  - Add inline edit functionality for item name
  - Validate edited item name before saving
  - Show loading state during updates
  - Display toast notifications for actions
  - _Requirements: 4.2, 9.1, 9.2, 9.3, 9.4_

- [x] 7.4 Update Item (main) component
  - Refactor src/components/Item.jsx to use useItems and useRecipes hooks
  - Integrate ItemFilters component
  - Update to use Toast notifications instead of inline errors
  - Implement batch delete with confirmation dialog
  - Show skeleton loader while items are loading
  - _Requirements: 4.3, 5.2, 6.1, 10.4_

- [x] 8. Enhance Recipe component
- [x] 8.1 Update Recipe component
  - Refactor src/components/Recipe.jsx to use useRecipes hook
  - Add save recipe functionality
  - Display loading state during recipe generation
  - Show error message with retry option on failure
  - Add smooth animations for modal open/close
  - _Requirements: 4.4, 5.3, 7.2, 12.1_

- [ ]* 8.2 Create SavedRecipes component
  - Create src/components/recipes/SavedRecipes.jsx to display user's saved recipes
  - Show list of saved recipes with ingredients and date
  - Allow viewing and deleting saved recipes
  - Implement pagination if recipe count exceeds 20
  - _Requirements: 12.3, 12.5_

- [x] 9. Update context and app structure
- [x] 9.1 Simplify or remove Firebase context
  - Refactor src/context/firebase.jsx to only provide auth context (or remove if using useAuth hook directly)
  - Remove all business logic from context (moved to services and hooks)
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 9.2 Wrap app with ErrorBoundary
  - Update src/App.jsx to wrap routes with ErrorBoundary component
  - Add Toast container at app level
  - _Requirements: 5.5, 7.1_

- [ ]* 9.3 Add PropTypes to all components
  - Add PropTypes validation to all components
  - Create src/types/propTypes.js for shared type definitions
  - _Requirements: 11.1, 11.4_

- [x] 10. Implement Firebase security rules
  - Create firestore.rules file with security rules for items and recipes collections
  - Ensure users can only access their own data
  - Validate required fields and data types on write operations
  - Deploy rules to Firebase project using Firebase CLI
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 11. Add pagination for large item lists
  - Update useItems hook to implement pagination when item count exceeds 50
  - Add pagination controls to ItemList component
  - Update Firestore queries to use limit and startAfter
  - _Requirements: 6.2_

- [ ]* 12. Implement local storage for preferences
  - Save and restore filter/sort preferences in useItems hook
  - Persist user preferences across sessions
  - _Requirements: 10.4_

- [ ]* 13. Add JSDoc comments and documentation
  - Add JSDoc comments to all service functions
  - Document complex hooks and components
  - Create README section explaining environment setup
  - _Requirements: 11.5_

- [x] 14. Update styling and responsive design
  - Review and update Tailwind classes for consistent design system
  - Ensure all components are responsive (mobile, tablet, desktop)
  - Add hover and active states to interactive elements
  - Implement smooth transitions and animations
  - Test on different screen sizes
  - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [ ]* 15. Performance testing and optimization
  - Test app with large number of items (100+)
  - Verify real-time listeners clean up properly
  - Check for unnecessary re-renders using React DevTools
  - Optimize components with React.memo, useMemo, useCallback where needed
  - _Requirements: 6.3, 6.4_
