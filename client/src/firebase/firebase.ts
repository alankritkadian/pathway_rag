// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARRHqHKGFfIap94vxJDFSBeEGO75krJEA",
  authDomain: "pathway-4d644.firebaseapp.com",
  projectId: "pathway-4d644",
  storageBucket: "pathway-4d644.firebasestorage.app",
  messagingSenderId: "1076438788796",
  appId: "1:1076438788796:web:f31538469d281c879f3eb9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };