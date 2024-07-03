// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, getRedirectResult  } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";
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
const provider = new GoogleAuthProvider();
const user = auth.currentUser;
updateuser();

const loginevent = document.getElementById("loginbutton");
loginevent.addEventListener("click", function(){
  if (user !== null) {
    signOut(auth, provider)
    .then((result) => {
      const user = result.user;
      updateuser();
    }).catch((error) => {
      // Handle Errors here.
    });
  } else {
    signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      alert(result.user.displayName);
      updateuser();
    }).catch((error) => {
      // Handle Errors here.
    });
  }
});

function updateuser() {
  if(user !== null) {
    console.log("Sign-in provider: " + user.providerId);
    console.log("  Provider-specific UID: " + user.uid);
    console.log("  Name: " + user.displayName);
    console.log("  Email: " + user.email);
    console.log("  Photo URL: " + user.photoURL);
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;
    const uid = user.uid;
    document.getElementById("name").innerHTML = displayName;
    document.getElementById("pfp").src = photoURL;
    document.getElementById("loginbutton").innerHTML = 'sign out';
  } else {
    document.getElementById("name").innerHTML = 'no user';
    document.getElementById("loginbutton").innerHTML = 'login';
  }
}
