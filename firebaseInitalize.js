import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

setPersistence(auth, browserLocalPersistence).then(() => {
const likedJobs = document.getElementById('likedJobs');
const accountInfoMenu = document.getElementById('accountInfoMenu');
const authAction = document.getElementById('authAction');
const overlay = document.getElementById('overlay1');
const segueToLogin = document.getElementById('segueToLogin');

document.getElementById('accountInfo').addEventListener('click', () => {
    const accountMenu = document.getElementById('accountMenu');
    accountMenu.classList.toggle('fade-in');
  });

  document.getElementById('notificationButton').addEventListener('click', () => {
    const notificationMenu = document.getElementById('notificationMenu');
    notificationMenu.classList.toggle('fade-in');
  });

  document.getElementById('chatButton').addEventListener('click', () => {
    const chatSidebar = document.getElementById('chatSidebar');
    chatSidebar.classList.toggle('slide-in');
  });

likedJobs.addEventListener('click', () => {
    window.location.href = 'liked-jobs.html';
});

accountInfoMenu.addEventListener('click', () => {
    window.location.href = 'account-info.html';
});

authAction.addEventListener('click', () => {
    if (auth.currentUser) {
    signOut(auth).then(() => {
        alert('Signed out successfully!');
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error signing out: ', error);
        alert('Sign-out failed. Please try again.');
    });
    } else {
    window.location.href = 'login.html';
    }
});

auth.onAuthStateChanged((user) => {
    if (user) {
    const userRef = doc(firestore, 'users', user.uid);
    getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
        const userData = docSnap.data();
        accountInfo.style.backgroundImage = `url(${userData.photoURL})`;
        accountInfo.textContent = '';
        authAction.textContent = 'Log Out';
        overlay.style.display = 'none';
        } else {
        console.log('No such document!');
        }
    }).catch((error) => {
        console.log('Error getting document:', error);
    });
    } else {
    accountInfo.style.backgroundImage = '';
    accountInfo.textContent = 'AI';
    authAction.textContent = 'Log In';
    overlay.style.display = 'flex';
    }
});

window.addEventListener('click', (event) => {
    if (!accountInfo.contains(event.target) && !accountMenu.contains(event.target)) {
    accountMenu.style.display = 'none';
    }
});

segueToLogin.addEventListener('click', () => {
    window.location.href = 'login.html';
});
}).catch((error) => {
    console.error('Error setting persistence: ', error);
});