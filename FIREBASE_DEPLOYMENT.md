# Firebase Security Rules Deployment Guide

This guide explains how to deploy the Firestore security rules to your Firebase project.

## Prerequisites

1. Firebase CLI installed globally
2. Firebase project initialized
3. Authenticated with Firebase

## Installation Steps

### 1. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication.

### 3. Initialize Firebase (if not already done)

If you haven't initialized Firebase in this project:

```bash
firebase init firestore
```

Select your Firebase project when prompted.

### 4. Deploy Security Rules

Deploy only the Firestore rules:

```bash
firebase deploy --only firestore:rules
```

Or deploy all Firebase resources:

```bash
firebase deploy
```

## Verify Deployment

After deployment, you can verify the rules in the Firebase Console:

1. Go to https://console.firebase.google.com/
2. Select your project
3. Navigate to Firestore Database > Rules
4. Verify the rules match the content in `firestore.rules`

## Security Rules Overview

The deployed rules enforce the following security measures:

### Items Collection
- **Read**: Users can only read their own items
- **Create**: Users can only create items with their own userId, with required fields validated
- **Update**: Users can only update their own items, with data validation
- **Delete**: Users can only delete their own items

### Recipes Collection
- **Read**: Users can only read their own recipes
- **Create**: Users can only create recipes with their own userId, with required fields validated
- **Update**: Users can update their own recipes (e.g., lastAccessedAt timestamp)
- **Delete**: Users can only delete their own recipes

### Validation Rules

**Items:**
- `userId` must be a string matching the authenticated user's ID
- `email` must be a string
- `itemName` must be a non-empty string
- `quantity` must be a positive number
- `createdAt` and `updatedAt` must be timestamps

**Recipes:**
- `userId` must be a string matching the authenticated user's ID
- `ingredients` must be a non-empty array
- `ingredientsHash` must be a non-empty string
- `recipeHtml` must be a non-empty string
- `createdAt` and `lastAccessedAt` must be timestamps

## Testing Rules

You can test the rules locally using the Firebase Emulator:

```bash
firebase emulators:start --only firestore
```

Or test in the Firebase Console using the Rules Playground:
1. Go to Firestore Database > Rules
2. Click on "Rules Playground"
3. Test different scenarios with various user IDs and data

## Troubleshooting

### Permission Denied Errors
If you see permission denied errors after deployment:
1. Verify the user is authenticated
2. Check that the userId in the document matches the authenticated user's ID
3. Ensure all required fields are present and valid

### Deployment Fails
If deployment fails:
1. Check that you're logged in: `firebase login`
2. Verify your project is selected: `firebase use --add`
3. Ensure you have proper permissions in the Firebase project

## Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
