// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFbLz0g5bYgACxz43FFM29KNnJhJzdYC8",
  authDomain: "apnabazar-1361c.firebaseapp.com",
  projectId: "apnabazar-1361c",
  storageBucket: "apnabazar-1361c.firebasestorage.app",
  messagingSenderId: "508224232775",
  appId: "1:508224232775:web:524f3347880b9a24ac8062",
  measurementId: "G-ZJM9R9482H",
  databaseURL: "https://apnabazar-1361c-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getDatabase(app);
