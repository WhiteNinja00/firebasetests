// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFS3sqPN2sf8E627e03KmE-A7tXsoAPuY",
  authDomain: "testground-861a7.firebaseapp.com",
  databaseURL: "https://testground-861a7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "testground-861a7",
  storageBucket: "testground-861a7.appspot.com",
  messagingSenderId: "1000059092401",
  appId: "1:1000059092401:web:04f9439b4a5592877fd190",
  measurementId: "G-1FZJWV9WMB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const loginevent = document.getElementById("loginbutton");
loginevent.addEventListener("click", function(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
});