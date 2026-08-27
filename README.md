# Pantry Tracker and Recipe Generator

[Demo](https://pantryapp-amitverma-01-amitverma-01s-projects.vercel.app/)

A React-based web application for managing pantry inventory and generating AI-powered recipes using Google's Gemini API.

## Features

- User authentication (Email/Password and Google OAuth)
- Pantry item management (Add, Edit, Delete)
- Real-time item updates
- AI-powered recipe generation
- Recipe caching for faster access
- Search and filter pantry items
- Responsive design for mobile, tablet, and desktop

## Tech Stack

- React + Vite
- Firebase (Authentication & Firestore)
- Google Gemini AI
- Tailwind CSS

## Setup

### Prerequisites

- Node.js (v16 or higher)
- Firebase account and project
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from `.env.example`:
   - `VITE_*` variables are for the browser (Firebase client config).
   - `GEMINI_API_KEY` and `FIREBASE_API_KEY` are **server-only** — never use the `VITE_` prefix for Gemini.

4. Deploy Firebase security rules:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules
   ```
   
   See [FIREBASE_DEPLOYMENT.md](./FIREBASE_DEPLOYMENT.md) for detailed deployment instructions.

5. Start the development server:
   ```bash
   npm run dev
   ```

## Firebase Security Rules

The application uses comprehensive Firestore security rules to protect user data:

- Users can only access their own pantry items and recipes
- All write operations validate required fields and data types
- Authentication is required for all database operations

See [firestore.rules](./firestore.rules) for the complete security rules implementation.

## Environment & Security

- **Firebase `VITE_*` keys** are public by design in web apps; protect data with [Firestore rules](./firestore.rules).
- **Gemini API key** lives in `GEMINI_API_KEY` (server-only). Recipe generation calls `/api/generate-recipe`, which verifies the user's Firebase login before calling Gemini.
- On **Vercel**, set `GEMINI_API_KEY` and `FIREBASE_API_KEY` in the project Environment Variables dashboard (not in git).

## Development

This project uses:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) with [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) with [SWC](https://swc.rs/) for Fast Refresh
