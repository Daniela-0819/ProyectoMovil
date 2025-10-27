import { initializeApp } from "firebase/app";
import { getFirestore , initializeFirestore, persistentLocalCache} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBh_mQME9iZCIvOpHzAtzhGKctbagh6b3w",
  authDomain: "clon-b2ff0.firebaseapp.com",
  projectId: "clon-b2ff0",
  storageBucket: "clon-b2ff0.firebasestorage.app",
  messagingSenderId: "492576382583",
  appId: "1:492576382583:web:a4428f5b90e7f409773072"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)
export const auth = getAuth(app);
export const db = getFirestore(app);