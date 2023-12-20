// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaqz5vetws890CJT285yQGsLcMfK-plR4",
  authDomain: "worldwise-1cea4.firebaseapp.com",
  projectId: "worldwise-1cea4",
  storageBucket: "worldwise-1cea4.appspot.com",
  messagingSenderId: "272081217930",
  appId: "1:272081217930:web:fa0157f78930fa77cc0073",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
