import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export async function saveTokensToFirebase(
  userId: string,
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
) {
  try {
    const userRef = ref(database, `users/${userId}`);
    await set(userRef, {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      last_updated: Date.now(),
    });
    return true;
  } catch (error) {
    console.error("Error saving tokens to Firebase:", error);
    return false;
  }
}

export async function getTokensFromFirebase(userId: string) {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }

    return null;
  } catch (error) {
    console.error("Error getting tokens from Firebase:", error);
    return null;
  }
}
