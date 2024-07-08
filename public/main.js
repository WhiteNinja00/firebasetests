import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, signInWithRedirect, setPersistence, inMemoryPersistence } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, setDoc, doc, getDoc, where, startAfter } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
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

// init firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
var loggedin = false;
var curuser = null;
auth.onAuthStateChanged(function(user) {
  loggedin = user;
  if(loggedin) {
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
    curuser = user;
    document.getElementById("name").innerHTML = displayName;
    document.getElementById("pfp").src = photoURL;
    document.getElementById("loginbutton").innerHTML = 'sign out';
    setDoc(doc(db, "users", uid), {
      name: displayName,
      uid: uid,
      photo: photoURL,
      type: 'user'
    });
  } else {
    document.getElementById("name").innerHTML = 'no user';
    document.getElementById("pfp").src = '';
    document.getElementById("loginbutton").innerHTML = 'login';
  }
});

const loginevent = document.getElementById("loginbutton");
loginevent.addEventListener("click", function(){
  if(!loggedin) {
    signInWithPopup(auth, provider)
    .then((result) => {
      //signed in
    }).catch((error) => {
      alert(error.message);
    });
  } else {
    signOut(auth, provider)
    .then((result) => {
      //signed out
    }).catch((error) => {
      alert(error.message);
    });
  }
});

const messagefield = document.getElementById('messagefield');
const postbutton = document.getElementById("postbutton");
postbutton.addEventListener("click", function() {
  if(curuser.uid !== null && messagefield.value !== '') {
    const d = new Date();
    addDoc(collection(db, "messages"), {
      uid: curuser.uid,
      message: messagefield.value,
      date: d,
      order: -d.getTime(),
      type: 'message'
    });
    addpost(messagefield.value, curuser.uid, d.getTime(), 0);
    document.getElementById('messagefield').value = '';
  }
});

const dataArea = document.getElementsByClassName("board")[0];
var loaded = 0;
var loadedid = [];

loadpost();

async function loadpost() {
  loaded += 10;
  var q = query(collection(db, "messages"), orderBy("order"), limit(loaded));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if(!loadedid.includes(doc.id)) {
      addpost(doc.data().message, doc.data().uid, doc.data().date.seconds, doc.id);
    }
  });
}

async function addpost(message, uid, date, id) {
  const lol = await getDoc(doc(db, "users", uid));
  var t = new Date(1970, 0, 1); // Epoch
  const d = new Date();
  let diff = d.getTimezoneOffset();
  t.setSeconds(date - (diff * 60));
  var coolthing = `
  <section id='messageblock'>
    <article>
      <div class="float-left">
        <img src="${lol.data().photo}"><h1>${lol.data().name}</h1></img>
      </div>
      <br><br><br>
      <div class="messagebox">
        <p>${message}</p>
      </div>
      <br>
      <div class="float-right">
        ${timeAgo(new Date(t))}
      </div>
      <br>
    </article>
  </section>
  `;
  if(id == 0) {
    dataArea.innerHTML = coolthing + dataArea.innerHTML;
  } else {
    dataArea.innerHTML += coolthing;
  }
  loadedid.push(id);
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  const interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
      return interval + " years ago";
  }
  if (interval === 1) {
      return interval + " year ago";
  }

  const months = Math.floor(seconds / 2628000);
  if (months > 1) {
      return months + " months ago";
  }
  if (months === 1) {
      return months + " month ago";
  }

  const days = Math.floor(seconds / 86400);
  if (days > 1) {
      return days + " days ago";
  }
  if (days === 1) {
      return days + " day ago";
  }

  const hours = Math.floor(seconds / 3600);
  if (hours > 1) {
      return hours + " hours ago";
  }
  if (hours === 1) {
      return hours + " hour ago";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes > 1) {
      return minutes + " minutes ago";
  }
  if (minutes === 1) {
      return minutes + " minute ago";
  }

  const sec = Math.floor(seconds);
  if (sec > 1) {
      return sec + " seconds ago";
  }
  if (sec === 1) {
      return sec + " second ago";
  }

  return "just now";
}

const handleScroll = () => {
  if(window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
    loadpost();
  }
};

var throttleWait;

const throttle = (callback, time) => {
  if (throttleWait) return;
  throttleWait = true;

  setTimeout(() => {
    callback();
    throttleWait = false;
  }, time);
};

window.addEventListener("scroll", () => {
  throttle(handleScroll, 250);
});
