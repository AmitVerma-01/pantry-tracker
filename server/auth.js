/**
 * Verify a Firebase ID token using the Identity Toolkit REST API.
 * @param {string} idToken
 * @param {string} firebaseApiKey
 * @returns {Promise<object>} Firebase user record
 */
export const verifyFirebaseIdToken = async (idToken, firebaseApiKey) => {
  if (!idToken || !firebaseApiKey) {
    throw new Error('Unauthorized');
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseApiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!response.ok) {
    throw new Error('Unauthorized');
  }

  const data = await response.json();
  if (!data.users?.length) {
    throw new Error('Unauthorized');
  }

  return data.users[0];
};
