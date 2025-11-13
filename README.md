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

3. Create a `.env` file in the root directory with your Firebase and Gemini API credentials:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   VITE_FIREBASE_DATABASE_URL=your_database_url
   VITE_GEMINI_API_KEY=your_gemini_key
   ```

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

## Development

This project uses:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) with [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) with [SWC](https://swc.rs/) for Fast Refresh
