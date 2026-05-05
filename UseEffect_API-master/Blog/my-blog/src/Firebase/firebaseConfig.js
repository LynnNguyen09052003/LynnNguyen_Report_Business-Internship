// Lấy từ Firebase console của bạn
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB_WG6PBrVzitcxOxCdGZ6TO2UkyP9BnNg",
    authDomain: "my-blog-51a23.firebaseapp.com",
    projectId: "my-blog-51a23",
    storageBucket: "my-blog-51a23.firebasestorage.app",
    messagingSenderId: "150087234146",
    appId: "1:150087234146:web:34a3e7d74a3dbe572c573b",
    measurementId: "G-XJT9N0B0CP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);