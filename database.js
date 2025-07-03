function saveUserData(userId) {
  const userData = {
    username: document.getElementById("username").value,
    fullName: document.getElementById("fullname").value,
    email: document.getElementById("email").value,
    form: document.getElementById("form").value,
    gender: document.querySelector("input[name='gender']:checked").value,
    isZerakiUser: document.getElementById("zeraki-check").checked,
    zerakiUsername: document.getElementById("zeraki-username").value || "",
    zerakiPassword: document.getElementById("zeraki-password").value || "",
    createdAt: firebase.database.ServerValue.TIMESTAMP,
  };

  // Save to Firebase Realtime Database
  database.ref("users/" + userId).set(userData)
    .then(() => console.log("User data saved!"))
    .catch((error) => alert("Error saving data: " + error.message));
}
