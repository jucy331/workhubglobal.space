import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Check if we're running on the client side
const isBrowser = typeof window !== "undefined";

// Check if we're in a preview environment (v0, Vercel preview, etc.)
const isPreviewEnvironment =
  process.env.NODE_ENV !== "production" ||
  process.env.VERCEL_ENV === "preview" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

// Mock Firebase for preview environments
const createMockFirebase = () => {
  // ...your mock implementation unchanged...
  // (keep your mockAuth, mockFirestore, mockStorage as in your code)
  // ...existing code...
  return {
    app: {},
    auth: {
      currentUser: null,
      onAuthStateChanged: (callback: any) => {
        callback(null);
        return () => {};
      },
      signInWithEmailAndPassword: async () => {
        throw new Error("Mock auth: Not implemented in preview");
      },
      createUserWithEmailAndPassword: async () => {
        throw new Error("Mock auth: Not implemented in preview");
      },
      signOut: async () => {},
    },
    db: {
      collection: () => ({
        doc: () => ({
          get: async () => ({
            exists: () => false,
            data: () => ({}),
          }),
          set: async () => {},
          update: async () => {},
        }),
      }),
    },
    storage: {
      ref: () => ({
        put: async () => {},
        getDownloadURL: async () => "https://placeholder.com/image.jpg",
      }),
    },
  };
};

// Safe initialization function
function initializeFirebase() {
  if (!isBrowser) {
    // Don't initialize on server
    return { app: null, auth: null, db: null, storage: null };
  }

  try {
    // Use existing app if already initialized
    const app =
      getApps().length > 0
        ? getApp()
        : initializeApp({
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          });

    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);

    // Set up emulators for local development if needed
    if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true"
    ) {
      connectAuthEmulator(auth, "http://localhost:9099");
      connectFirestoreEmulator(db, "localhost", 8080);
      connectStorageEmulator(storage, "localhost", 9199);
    }

    return { app, auth, db, storage };
  } catch (error) {
    // For preview environments, use mock Firebase implementation
    if (isPreviewEnvironment) {
      return createMockFirebase();
    }
    return { app: null, auth: null, db: null, storage: null };
  }
}

// Initialize Firebase
const { app, auth, db, storage } = initializeFirebase();

export { app, auth, db, storage };
