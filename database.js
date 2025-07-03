// Initialize Firebase Database
const database = firebase.database();

function saveUserData(userId) {
  // Validate required fields first
  const username = document.getElementById("username").value.trim();
  const fullName = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const form = document.getElementById("form").value;
  const genderRadio = document.querySelector("input[name='gender']:checked");
  
  // Validate required fields
  if (!username || !fullName || !email || !form || !genderRadio) {
    alert("Please fill all required fields");
    return Promise.reject("Missing required fields");
  }

  // Prepare user data with validation
  const userData = {
    username: username,
    fullName: fullName,
    email: email.toLowerCase(), // Normalize email
    form: form,
    gender: genderRadio.value,
    isZerakiUser: document.getElementById("zeraki-check").checked,
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    lastUpdated: firebase.database.ServerValue.TIMESTAMP
  };

  // Only include Zeraki credentials if the box is checked
  if (userData.isZerakiUser) {
    const zerakiUsername = document.getElementById("zeraki-username").value.trim();
    const zerakiPassword = document.getElementById("zeraki-password").value;
    
    if (!zerakiUsername || !zerakiPassword) {
      alert("Please enter your Zeraki credentials");
      return Promise.reject("Missing Zeraki credentials");
    }
    
    // Note: In production, NEVER store passwords in plain text
    userData.zerakiUsername = zerakiUsername;
    // This is just for demonstration - use proper auth in real apps
    userData.zerakiPassword = "[REDACTED]"; 
  } else {
    // Explicitly remove if unchecked
    userData.zerakiUsername = "";
    userData.zerakiPassword = "";
  }

  // Show loading state
  const signupBtn = document.getElementById("signup-btn");
  if (signupBtn) {
    signupBtn.disabled = true;
    signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving Data...';
  }

  // Save to Firebase with transaction for atomic updates
  return database.ref("users/" + userId).transaction((currentData) => {
    // Merge with existing data if any
    return currentData ? {...currentData, ...userData} : userData;
  })
  .then(() => {
    console.log("User data saved successfully");
    return true; // Indicate success
  })
  .catch((error) => {
    console.error("Error saving user data:", error);
    alert("Failed to save profile: " + error.message);
    throw error; // Re-throw for further handling
  })
  .finally(() => {
    if (signupBtn) {
      signupBtn.disabled = false;
      signupBtn.innerHTML = '<i class="fas fa-user-plus mr-2"></i> Create Account';
    }
  });
}

// Function to get user data (for dashboard)
function getUserData(userId) {
  return database.ref("users/" + userId).once('value')
    .then((snapshot) => {
      if (!snapshot.exists()) {
        throw new Error("User data not found");
      }
      return snapshot.val();
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      throw error;
    });
}

// Update auth.js to use the promise
// In your signUp() function, change:
// saveUserData(user.uid); → return saveUserData(user.uid);
