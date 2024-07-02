import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-f30c2.firebaseapp.com",
  projectId: "mern-auth-f30c2",
  storageBucket: "mern-auth-f30c2.appspot.com",
  messagingSenderId: "254748026894",
  appId: "1:254748026894:web:69a1b36ebcbf7e3905745f"
};

export const app = initializeApp(firebaseConfig);