// auth.js
import { auth, database } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

import {
  ref,
  set
} from "https://www.gstatic.com/firebasejs/9.6.11/firebase-database.js";

// Sign Up Handler
const signupForm = document.querySelector('#signup-form form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const username = document.getElementById('username').value;
    const fullname = document.getElementById('fullname').value;
    const form = document.getElementById('form').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const zeraki = document.getElementById('zeraki-check').checked;
    const zUser = document.getElementById('zeraki-username')?.value || null;
    const zPass = document.getElementById('zeraki-password')?.value || null;

    if (password !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(database, 'users/' + user.uid), {
        username,
        fullname,
        form,
        gender,
        email,
        zeraki,
        zerakiCredentials: zeraki ? { zUser, zPass } : null
      });

      alert("Account created successfully!");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Error: " + error.message);
    }
  });
}

// Log In Handler
const loginForm = document.querySelector('#login-form form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailOrUser = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
      await signInWithEmailAndPassword(auth, emailOrUser, password);
      alert("Logged in!");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });
}

// Logout Handler
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
}
