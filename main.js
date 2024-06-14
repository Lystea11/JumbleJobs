

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase auth service
const auth = firebase.auth();

// DOM elements
const btnLogin = document.getElementById('btn-login');

// Sign in with Google popup
btnLogin.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      // User signed in successfully
      console.log(result.user);
      alert('Signed in successfully!');
    })
    .catch((error) => {
      // Handle errors here
      console.error(error.message);
      alert(`Sign in failed: ${error.message}`);
    });
});
