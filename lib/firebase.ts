import { initializeApp, getApps } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

// Update the Firebase configuration with the provided values
const firebaseConfig = {
  apiKey: "AIzaSyC5n1Bc2bLmZpKmjweMYu9w6mbRTl-66Qs",
  authDomain: "workhub-website-1ef15.firebaseapp.com",
  projectId: "workhub-website-1ef15",
  storageBucket: "workhub-website-1ef15.firebasestorage.app",
  messagingSenderId: "211672989117",
  appId: "1:211672989117:web:b94832bfb8f841fdcde6d4",
}

// Initialize Firebase only if it hasn't been initialized already
const apps = getApps()
const app = apps.length ? apps[0] : initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

// Connect to Firebase emulators if enabled
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true") {
  console.log("Using Firebase emulators")

  // Connect to Auth emulator
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })

  // Connect to Firestore emulator
  connectFirestoreEmulator(db, "localhost", 8080)
}
