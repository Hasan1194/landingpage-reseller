// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA41Xf8DWKt0Er-i4ndkUKRdSJDKwScMCs",
    authDomain: "landingpage-reseller.firebaseapp.com",
    projectId: "landingpage-reseller",
    storageBucket: "landingpage-reseller.firebasestorage.app",
    messagingSenderId: "420656730276",
    appId: "1:420656730276:web:c7f0fbeffe4f66ddbed631"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
