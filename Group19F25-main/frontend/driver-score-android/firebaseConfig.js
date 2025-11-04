// ✅ Import the Firebase modules you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2pPuiwGbctoYNBk_fG5ncQp1ATdOS-40",
  authDomain: "driveranalyticsapp.firebaseapp.com",
  projectId: "driveranalyticsapp",
  storageBucket: "driveranalyticsapp.firebasestorage.app",
  messagingSenderId: "494399956675",
  appId: "1:494399956675:web:06b335a9174039786a2476",
  measurementId: "G-CE9WJSQ1Q9"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Authentication and export it
export const auth = getAuth(app);
