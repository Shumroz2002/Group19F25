// ✅ Import required Firebase modules
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2pPuiwGbctoYNBk_fG5ncQp1ATdOS-40",
  authDomain: "driveranalyticsapp.firebaseapp.com",
  projectId: "driveranalyticsapp",
  storageBucket: "driveranalyticsapp.firebasestorage.app",
  messagingSenderId: "494399956675",
  appId: "1:494399956675:web:06b335a9174039786a2476",
  measurementId: "G-CE9WJSQ1Q9",
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize persistent Firebase Auth for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// ✅ Export Firebase modules
export { app, auth };
