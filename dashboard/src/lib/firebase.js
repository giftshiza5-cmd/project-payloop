import { initializeApp, getApps } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
const app = hasFirebaseConfig ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig)) : null;
const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;

export function isFirebaseConfigured() {
  return Boolean(app && db && auth);
}

function requireFirebase() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured. Add your NEXT_PUBLIC_FIREBASE_* values to .env.local and restart the dev server.");
  }

  return { auth, db };
}

function userProfile(uid, data) {
  return {
    uid,
    email: data.email,
    displayName: data.displayName || data.email?.split("@")[0] || "PayLoop User",
    role: data.role,
    idCard: data.idCard || "",
    phoneNumber: data.phoneNumber || "",
    country: data.country || "",
    updatedAt: serverTimestamp(),
  };
}

export async function registerPayLoopUser({ email, password, role, displayName, idCard, phoneNumber, country }) {
  const { auth, db } = requireFirebase();
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }

  await setDoc(
    doc(db, "users", credential.user.uid),
    {
      ...userProfile(credential.user.uid, {
        email: credential.user.email,
        displayName,
        role,
        idCard,
        phoneNumber,
        country,
      }),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );

  return { user: credential.user, role };
}

export async function loginPayLoopUser({ email, password, fallbackRole }) {
  const { auth, db } = requireFirebase();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const userRef = doc(db, "users", credential.user.uid);
  const snapshot = await getDoc(userRef);
  const role = snapshot.exists() ? snapshot.data().role : fallbackRole;

  if (!snapshot.exists()) {
    await setDoc(userRef, userProfile(credential.user.uid, { email: credential.user.email, role }), { merge: true });
  } else {
    await setDoc(userRef, { lastLoginAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
  }

  return { user: credential.user, role };
}

export async function upsertPayLoopUser({ walletAddress, displayName }) {
  if (!db) return;

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
