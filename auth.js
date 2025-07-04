// Initialize Firebase (make sure this matches your config)
const firebaseConfig = {
  apiKey: "AIzaSyDNRsHeUNRQjDFCrd9PX3XIWq5DGZkkYJU",
  authDomain: "lambda-df556.firebaseapp.com",
  databaseURL: "https://lambda-df556-default-rtdb.firebaseio.com",
  projectId: "lambda-df556",
  storageBucket: "lambda-df556.firebasestorage.app",
  messagingSenderId: "353626314721",
  appId: "1:353626314721:web:84ae36190386289b2364a0",
  measurementId: "G-RGF9WFSJE7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Auth state persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Login Function
function login() {
  const loginInput = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const rememberMe = document.getElementById("remember-me").checked;

  // Show loading state
  const loginBtn = document.querySelector("#login-form button[type='submit']");
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Logging in...';

  // Set persistence based on "Remember Me"
  const persistence = rememberMe ? 
    firebase.auth.Auth.Persistence.LOCAL : 
    firebase.auth.Auth.Persistence.SESSION;

  auth.setPersistence(persistence)
    .then(() => {
      // Determine if input is email or username
      const isEmail = loginInput.includes('@');
      
      if (isEmail) {
        // Login with email
        return auth.signInWithEmailAndPassword(loginInput, password);
      } else {
        // Lookup username first
        return database.ref('usernames/' + loginInput).once('value')
          .then((snapshot) => {
            if (!snapshot.exists()) {
              throw new Error('Username not found');
            }
            const userId = snapshot.val();
            return database.ref('users/' + userId + '/email').once('value');
          })
          .then((emailSnapshot) => {
            const email = emailSnapshot.val();
            if (!email) {
              throw new Error('No email associated with this username');
            }
            return auth.signInWithEmailAndPassword(email, password);
          });
      }
    })
    .then(() => {
      // Success - redirect to dashboard
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      handleLoginError(error, loginBtn);
    });
}

// Sign Up Function
function signUp() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validate passwords match
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Validate password strength
  if (password.length < 6) {
    alert("Password should be at least 6 characters");
    return;
  }

  // Show loading state
  const signupBtn = document.querySelector("#signup-form button[type='submit']");
  signupBtn.disabled = true;
  signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Creating account...';

  // Create user with Firebase Auth
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Save additional user data to database
      return saveUserData(userCredential.user.uid)
        .then(() => {
          // Send email verification
          return userCredential.user.sendEmailVerification();
        });
    })
    .then(() => {
      alert("Account created successfully! Please verify your email.");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      handleSignupError(error, signupBtn);
    });
}

// Password Reset Function
function resetPassword() {
  const email = document.getElementById("login-email")?.value || 
               prompt("Enter your email to reset password:");
  
  if (email) {
    auth.sendPasswordResetEmail(email)
      .then(() => {
        alert("Password reset email sent! Check your inbox.");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  }
}

// Helper Functions
function handleLoginError(error, buttonElement) {
  let errorMessage = error.message;
  
  // Friendly error messages
  const errorMap = {
    'auth/user-not-found': "Account not found. Please check your credentials.",
    'auth/wrong-password': "Incorrect password. Please try again.",
    'auth/too-many-requests': "Account temporarily disabled due to too many attempts. Try again later or reset your password."
  };
  
  alert("Error: " + (errorMap[error.code] || errorMessage));
  
  // Reset button state
  buttonElement.disabled = false;
  buttonElement.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i> Log In';
}

function handleSignupError(error, buttonElement) {
  let errorMessage = error.message;
  
  const errorMap = {
    'auth/email-already-in-use': "Email already in use. Try logging in instead.",
    'auth/invalid-email': "Please enter a valid email address.",
    'auth/weak-password': "Password should be at least 6 characters."
  };
  
  alert("Error: " + (errorMap[error.code] || errorMessage));
  
  // Reset button state
  buttonElement.disabled = false;
  buttonElement.innerHTML = '<i class="fas fa-user-plus mr-2"></i> Create Account';
}

// Attach event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Login form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      login();
    });
  }

  // Signup form
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      signUp();
    });
  }

  // Password reset links
  document.querySelectorAll(".reset-password").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      resetPassword();
    });
  });
});
