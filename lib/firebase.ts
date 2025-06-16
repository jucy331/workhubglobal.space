import { initializeApp, getApps } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC5n1Bc2bLmZpKmjweMYu9w6mbRTl-66Qs",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "workhub-website-1ef15.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "workhub-website-1ef15",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "workhub-website-1ef15.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "211672989117",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:211672989117:web:b94832bfb8f841fdcde6d4",
}

// Initialize Firebase only if it hasn't been initialized already
let app
try {
  const apps = getApps()
  app = apps.length ? apps[0] : initializeApp(firebaseConfig)
} catch (error) {
  console.error("Firebase initialization error:", error)
  // Create a fallback for preview environments
  app = null
}

// Initialize Firebase services with error handling
let auth = null
let db = null
let storage = null

try {
  if (app) {
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)

    // Connect to Firebase emulators if enabled
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true") {
      console.log("Using Firebase emulators")

      try {
        connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
        connectFirestoreEmulator(db, "localhost", 8080)
      } catch (emulatorError) {
        console.warn("Emulator connection failed:", emulatorError)
      }
    }
  }
} catch (error) {
  console.error("Firebase services initialization error:", error)
}

// Export services with fallbacks
export { auth, db, storage }
export default app
