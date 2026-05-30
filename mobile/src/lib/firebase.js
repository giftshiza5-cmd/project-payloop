import { initializeApp, getApps } from "firebase/app";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function upsertPayLoopUser({ walletAddress, displayName }) {
  const normalizedAddress = walletAddress.toLowerCase();

  await setDoc(
    doc(db, "users", normalizedAddress),
    {
      displayName,
      walletAddress,
      payLoopUserId: walletAddress,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function savePushToken({ walletAddress, token }) {
  if (!walletAddress || !token) {
    return;
  }

  const normalizedAddress = walletAddress.toLowerCase();

  await setDoc(
    doc(db, "users", normalizedAddress),
    {
      pushToken: token,
      contributionReminderEnabled: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function listCircleMembers() {
  const snapshot = await getDocs(query(collection(db, "users"), limit(25)));

  return snapshot.docs.map((memberDoc) => ({
    id: memberDoc.id,
    ...memberDoc.data(),
  }));
}
