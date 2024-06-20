import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export async function whenJobLiked(numb) {
    if (user) {
        // User is signed in, fetch user data from Firestore
        const userRef = doc(firestore, 'users', user.uid);
        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            accountInfo.style.backgroundImage = `url(${userData.photoURL})`;
            accountInfo.textContent = '';
            authAction.textContent = 'Log Out';
            overlay.style.display = 'none'; // Hide overlay if logged in
          } else {
            console.log('No such document!');
          }
        }).catch((error) => {
          console.log('Error getting document:', error);
        });
      } else {
        // User is signed out, show overlay
        accountInfo.style.backgroundImage = '';
        accountInfo.textContent = 'AI';
        authAction.textContent = 'Log In';
        overlay.style.display = 'flex'; // Show overlay if logged out
      }
}