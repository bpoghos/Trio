import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-u-zTRF3vaqsmojOUV9I88o3OXYLWNCU",
  authDomain: "trio-data.firebaseapp.com",
  projectId: "trio-data",
  storageBucket: "trio-data.firebasestorage.app",
  messagingSenderId: "751503694660",
  appId: "1:751503694660:web:6025330fcb2be9ee9a5511"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app); // Firestore instance
const storage = getStorage(app);
const auth = getAuth(app);
export { db , storage, auth};

