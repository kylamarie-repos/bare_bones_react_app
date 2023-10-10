// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuq1VQI2l9pJqsNGKEJ-q3vQRJLh0_97g",
  authDomain: "simple-react-crud-app-5036b.firebaseapp.com",
  projectId: "simple-react-crud-app-5036b",
  storageBucket: "simple-react-crud-app-5036b.appspot.com",
  messagingSenderId: "337736203035",
  appId: "1:337736203035:web:d40d2abe6546ebfc99f1be"
};

// Initializing firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);