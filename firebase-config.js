// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-database.js";

const firebaseConfig = {
const firebaseConfig = {
  apiKey: "AIzaSyDNRsHeUNRQjDFCrd9PX3XIWq5DGZkkYJU",
  authDomain: "lambda-df556.firebaseapp.com",
  projectId: "lambda-df556",
  storageBucket: "lambda-df556.firebasestorage.app",
  messagingSenderId: "353626314721",
  appId: "1:353626314721:web:84ae36190386289b2364a0",
  measurementId: "G-RGF9WFSJE7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
