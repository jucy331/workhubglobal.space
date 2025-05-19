import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, connectStorageEmulator } from "firebase/storage"

// Check if we're running on the client side
const isBrowser = typeof window !== "undefined"

// Check if we're in a preview environment (v0, Vercel preview, etc.)
const isPreviewEnvironment =
  process.env.NODE_ENV !== "production" ||
  process.env.VERCEL_ENV === "preview" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"

// Initialize Firebase only on the client side
let app, auth, db, storage

// Mock Firebase for preview environments
const createMockFirebase = () => {
  console.warn("Using mock Firebase implementation for preview environment")

  // Create a minimal mock implementation
  const mockAuth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(null)
      return () => {}
    },
    signInWithEmailAndPassword: async () => {
      throw new Error("Mock auth: Not implemented in preview")
    },
    createUserWithEmailAndPassword: async () => {
      throw new Error("Mock auth: Not implemented in preview")
    },
    signOut: async () => {},
  }

  const mockFirestore = {
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
  }

  const mockStorage = {
    ref: () => ({
      put: async () => {},
      getDownloadURL: async () => "https://placeholder.com/image.jpg",
    }),
  }

  return {
    app: {},
    auth: mockAuth,
    db: mockFirestore,
    storage: mockStorage,
  }
}

// Safe initialization function
function initializeFirebase() {
  // Only initialize if we're in the browser
  if (!isBrowser) {
    console.warn("Firebase services not initialized on server side")
    return { app: null, auth: null, db: null, storage: null }
  }

  try {
    // Check if Firebase app is already initialized
    if (getApps().length > 0) {
      console.log("Firebase app already initialized, reusing existing app")
      app = getApp()
      auth = getAuth(app)
      db = getFirestore(app)
      storage = getStorage(app)
      return { app, auth, db, storage }
    }

    // Get Firebase config from environment variables
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    // Log the config for debugging (without sensitive values)
    console.log("Firebase config:", {
      apiKey: firebaseConfig.apiKey ? "Present (hidden)" : "Missing",
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId ? "Present (hidden)" : "Missing",
      appId: firebaseConfig.appId ? "Present (hidden)" : "Missing",
    })

    // Check for missing configuration keys
    const missingKeys = Object.entries(firebaseConfig)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingKeys.length > 0) {
      console.warn(`Missing Firebase configuration keys: ${missingKeys.join(", ")}`)

      // For preview environments, use mock Firebase implementation
      if (isPreviewEnvironment) {
        console.info("Running in preview environment, using mock Firebase implementation")
        return createMockFirebase()
      } else {
        // For production, we should still throw an error
        throw new Error(`Missing required Firebase configuration: ${missingKeys.join(", ")}`)
      }
    }

    // Initialize Firebase with the config
    console.log("Initializing Firebase app...")
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
    console.log("Firebase services initialized successfully")

    // Set up emulators for local development if needed
    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true") {
      connectAuthEmulator(auth, "http://localhost:9099")
      connectFirestoreEmulator(db, "localhost", 8080)
      connectStorageEmulator(storage, "localhost", 9199)
    }

    return { app, auth, db, storage }
  } catch (error) {
    console.error("Error initializing Firebase:", error)

    // For preview environments, use mock Firebase implementation
    if (isPreviewEnvironment) {
      console.info("Running in preview environment, using mock Firebase implementation")
      return createMockFirebase()
    }

    return { app: null, auth: null, db: null, storage: null }
  }
}

// Initialize Firebase
const firebaseServices = initializeFirebase()
auth = firebaseServices.auth
db = firebaseServices.db
storage = firebaseServices.storage
app = firebaseServices.app

export { app, auth, db, storage }
