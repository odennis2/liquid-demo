// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMDqlSgu0wf6ERJTtnJgRIiT8veHCNd6M",
  authDomain: "liquid-sim.firebaseapp.com",
  projectId: "liquid-sim",
  storageBucket: "liquid-sim.firebasestorage.app",
  messagingSenderId: "366520142680",
  appId: "1:366520142680:web:db15c4e41fb8ab7257732d",
  measurementId: "G-8FGDXRNXZE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
