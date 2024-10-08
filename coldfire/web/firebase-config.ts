// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHmX9pl-Nw1sAffPmN1gR_S-f_uNv1UUw",
  authDomain: "coldfire-98ddb.firebaseapp.com",
  projectId: "coldfire-98ddb",
  storageBucket: "coldfire-98ddb.appspot.com",
  messagingSenderId: "541317042585",
  appId: "1:541317042585:web:60f74b71c98f56a4df8308",
  measurementId: "G-DC7W7H9Z59"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };