// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3H3xaRd67ojqvY9jtAVDLB1xxT43WmZM",
  authDomain: "boring-chat-app-8a194.firebaseapp.com",
  projectId: "boring-chat-app-8a194",
  storageBucket: "boring-chat-app-8a194.appspot.com",
  messagingSenderId: "839068027215",
  appId: "1:839068027215:web:dac07d31a1aaa4e398dd3a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//db
export const db = getFirestore(app);
