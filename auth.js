// Initialize Firebase Auth
const auth = firebase.auth();

// Sign Up Function (Enhanced)
function signUp() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const passwordError = document.getElementById("password-error");

  // Clear previous errors
  passwordError.textContent = "";

  // Validate passwords match
  if (password !== confirmPassword) {
    passwordError.textContent = "Passwords do not match!";
    return;
  }

  // Password strength validation (minimum 8 chars, 1 number, 1 special char)
  if (!/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}/.test(password)) {
    passwordError.textContent = "Password must be at least 8 characters with 1 number and 1 special character";
    return;
  }

  // Show loading state
  const signupBtn = document.getElementById("signup-btn");
  signupBtn.disabled = true;
  signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

  // Create user with Firebase Auth
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Send email verification
      return user.sendEmailVerification()
        .then(() => {
          // Save additional user data to database
          saveUserData(user.uid);
          
          // Show success message with verification reminder
          alert(`Account created successfully! Please verify your email at ${email}`);
          
          // Optional: Auto-redirect to login after delay
          setTimeout(() => {
            document.getElementById("login-tab").click();
          }, 2000);
        });
    })
    .catch((error) => {
      // Handle specific error cases
      let errorMessage = "Signup failed: ";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage += "This email is already registered";
          break;
        case "auth/invalid-email":
          errorMessage += "Please enter a valid email address";
          break;
        case "auth/weak-password":
          errorMessage += "Password is too weak";
          break;
        default:
          errorMessage += error.message;
      }
      alert(errorMessage);
    })
    .finally(() => {
      // Reset button state
      signupBtn.disabled = false;
      signupBtn.innerHTML = '<i class="fas fa-user-plus mr-2"></i> Create Account';
    });
}

// Login Function (Enhanced)
function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const rememberMe = document.getElementById("remember-me").checked;
  const loginError = document.getElementById("login-error");

  // Clear previous errors
  loginError.textContent = "";

  // Show loading state
  const loginBtn = document.getElementById("login-btn");
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging In...';

  // Set persistence based on "Remember Me" selection
  const persistence = rememberMe ? 
    firebase.auth.Auth.Persistence.LOCAL : 
    firebase.auth.Auth.Persistence.SESSION;

  auth.setPersistence(persistence)
    .then(() => auth.signInWithEmailAndPassword(email, password))
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Check if email is verified
      if (!user.emailVerified) {
        auth.signOut();
        throw new Error("Please verify your email first. Check your inbox.");
      }
      
      // Redirect to dashboard
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      let errorMessage = "Login failed: ";
      switch (error.code || error.message) {
        case "auth/user-not-found":
          errorMessage += "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage += "Incorrect password";
          break;
        case "auth/too-many-requests":
          errorMessage += "Too many attempts. Try again later or reset password";
          break;
        default:
          errorMessage += error.message;
      }
      loginError.textContent = errorMessage;
    })
    .finally(() => {
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i> Log In';
    });
}

// Password Reset Function (Enhanced)
function resetPassword() {
  const email = document.getElementById("login-email").value.trim() || 
               prompt("Enter your registered email to reset password:");
  
  if (!email) return;

  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert(`Password reset link sent to ${email}. Check your inbox (and spam folder).`);
    })
    .catch((error) => {
      let errorMessage = "Error: ";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage += "No account found with this email";
          break;
        case "auth/invalid-email":
          errorMessage += "Invalid email address";
          break;
        default:
          errorMessage += error.message;
      }
      alert(errorMessage);
    });
}

// Auth State Listener (Auto-redirect)
auth.onAuthStateChanged((user) => {
  const currentPage = window.location.pathname.split("/").pop();
  
  if (user) {
    // User is logged in
    if (currentPage === "index.html") {
      window.location.href = "dashboard.html";
    }
    
    // Update UI for logged-in state if needed
  } else {
    // User is logged out
    if (currentPage === "dashboard.html") {
      window.location.href = "index.html";
    }
  }
});

// Attach event listeners
document.getElementById("signup-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  signUp();
});

document.getElementById("login-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});

// Optional: Add click handler for password reset link
document.querySelector(".forgot-password")?.addEventListener("click", (e) => {
  e.preventDefault();
  resetPassword();
});
