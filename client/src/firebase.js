// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "aavaas-estate.firebaseapp.com",
  projectId: "aavaas-estate",
  storageBucket: "aavaas-estate.appspot.com",
  messagingSenderId: "522857957287",
  appId: "1:522857957287:web:e63f7bb00f6415c97dd882"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);