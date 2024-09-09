// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhJ7qiIlAHZJAysr6fUZTgartN07Q3Pyk",
  authDomain: "twitter-clone-783b5.firebaseapp.com",
  projectId: "twitter-clone-783b5",
  storageBucket: "twitter-clone-783b5.appspot.com",
  messagingSenderId: "396421586490",
  appId: "1:396421586490:web:c7a6699fea48d4b2c81f03",
  measurementId: "G-60TTS4XHMH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
