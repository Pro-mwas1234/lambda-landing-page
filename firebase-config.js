const firebaseConfig = {
  apiKey: "AIzaSyDNRsHeUNRQjDFCrd9PX3XIWq5DGZkkYJU",
  authDomain: "lambda-df556.firebaseapp.com",
  projectId: "lambda-df556",
  storageBucket: "lambda-df556.firebasestorage.app",
  messagingSenderId: "353626314721",
  appId: "1:353626314721:web:84ae36190386289b2364a0",
  measurementId: "G-RGF9WFSJE7"
};


firebase.initializeApp(firebaseConfig);

// Example of saving user info:
function saveUserData(uid, data) {
  firebase.database().ref('users/' + uid).set(data);
}
