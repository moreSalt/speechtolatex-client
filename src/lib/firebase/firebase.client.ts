// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiougIJfKbMIsuhgBne972WgGPqiZ4ip8",
  authDomain: "speech-to-tex-cf210.firebaseapp.com",
  projectId: "speech-to-tex-cf210",
  storageBucket: "speech-to-tex-cf210.appspot.com",
  messagingSenderId: "55370336638",
  appId: "1:55370336638:web:1296a101ed104a9cc04b2f",
  measurementId: "G-GPDD8FLKLQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
