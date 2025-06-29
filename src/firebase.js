import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPM3OYcuN5jkmE3MoG2wjGK-c4NqkqDzM",
  authDomain: "shareable-todos.firebaseapp.com",
  projectId: "shareable-todos",
  storageBucket: "shareable-todos.firebasestorage.app",
  messagingSenderId: "162221679091",
  appId: "1:162221679091:web:f4a1b9b9bdc37871553286",
  measurementId: "G-FDGDK6VX03"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };