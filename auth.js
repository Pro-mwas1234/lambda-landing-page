// Sign Up Function
function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validate passwords match
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Create user with Firebase Auth
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Account created successfully!");
      // Save additional user data to database (see database.js)
      saveUserData(user.uid);
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

// Login Function
function login() {
  const email = document.getElementById("login-username").value; // Can be email or username
  const password = document.getElementById("login-password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Logged in successfully!");
      window.location.href = "dashboard.html"; // Redirect after login
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

// Password Reset Function
function resetPassword() {
  const email = prompt("Enter your email to reset password:");
  if (email) {
    auth.sendPasswordResetEmail(email)
      .then(() => alert("Password reset email sent!"))
      .catch((error) => alert("Error: " + error.message));
  }
}

// Attach event listeners
document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  signUp();
});

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});
