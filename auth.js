// auth.js

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.querySelector("#signup-form form");
    const loginForm = document.querySelector("#login-form form");

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const fullname = document.getElementById("fullname").value;
        const email = document.getElementById("email").value;
        const form = document.getElementById("form").value;
        const gender = document.querySelector('input[name="gender"]:checked')?.value;
        const zeraki = document.getElementById("zeraki-check").checked;
        const zerakiUsername = document.getElementById("zeraki-username").value;
        const zerakiPassword = document.getElementById("zeraki-password").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Save to Firebase Realtime Database
        const userRef = firebase.database().ref("users/" + username);
        userRef.set({
            username,
            fullname,
            email,
            form,
            gender,
            zerakiUsername: zeraki ? zerakiUsername : null,
            zerakiPassword: zeraki ? zerakiPassword : null,
            password // 👈 optionally hash this!
        }).then(() => {
            alert("Account created successfully!");
            signupForm.reset();
        }).catch((error) => {
            alert("Error: " + error.message);
        });
    });

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const loginUsername = document.getElementById("login-username").value;
        const loginPassword = document.getElementById("login-password").value;

        const userRef = firebase.database().ref("users/" + loginUsername);
        userRef.get().then((snapshot) => {
            if (snapshot.exists()) {
                const user = snapshot.val();
                if (user.password === loginPassword) {
                    alert("Login successful!");
                } else {
                    alert("Incorrect password");
                }
            } else {
                alert("User not found");
            }
        }).catch((error) => {
            alert("Login error: " + error.message);
        });
    });
});
