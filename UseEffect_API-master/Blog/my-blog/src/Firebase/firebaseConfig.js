// Lấy từ Firebase console của bạn
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
     apiKey: "AIzaSyD6HIqF1F_gDU12fXUC4nLLMZxEce3YMEI",
  authDomain: "my-blog-v2-a7cc1.firebaseapp.com",
  projectId: "my-blog-v2-a7cc1",
  storageBucket: "my-blog-v2-a7cc1.firebasestorage.app",
  messagingSenderId: "766603129802",
  appId: "1:766603129802:web:6ce212a1a39f3cf4a95533"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);