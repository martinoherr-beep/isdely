import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAw--27M7kzbLRnjzKBBO77o-Kd_sDu3po",
  authDomain: "isdely-app.firebaseapp.com",
  projectId: "isdely-app",
  storageBucket: "isdely-app.firebasestorage.app",
  messagingSenderId: "503087335568",
  appId: "1:503087335568:web:1f2e39e4f8911e43b4b015",
  measurementId: "G-WWGXNGV60Q"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Exportamos la base de datos para usarla en App.js y el Panel
export const db = getFirestore(app);