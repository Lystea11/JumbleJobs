import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

let currentCardIndex = 0;
let isAnimating = false;

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Ensure that Firebase Auth and Firestore are registered
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

let currentUser = null;

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    } else {
        currentUser = null;
    }
});

async function updateUserIndexLiked(operation, index) {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);

    try {
        if (operation === 'add') {
            await updateDoc(userRef, {
                indexLiked: arrayUnion(index)
            });
        } else if (operation === 'remove') {
            await updateDoc(userRef, {
                indexLiked: arrayRemove(index)
            });
        }
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}


document.addEventListener('DOMContentLoaded', () => {

    const cards = Array.from(document.querySelectorAll('.card'));

    function updateCards() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'exit-left', 'exit-right');
            if (index === currentCardIndex) {
                card.classList.add('active');
            }
        });
    }

    function moveNext() {
        if (currentCardIndex < cards.length - 1) {
            cards[currentCardIndex].classList.add('exit-right');
            setTimeout(() => {
                currentCardIndex++;
                console.log("went right");
                updateCards();
                updateUserIndexLiked('add', currentCardIndex);
            }, 600); // Match the transition duration
        }
    }

    function movePrev() {
        if (currentCardIndex < cards.length - 1) {
            cards[currentCardIndex].classList.add('exit-left');
            setTimeout(() => {
                currentCardIndex++;
                console.log("went left");
                updateCards();
                updateUserIndexLiked('remove', currentCardIndex);
            }, 600); // Match the transition duration
        }
    }

    document.addEventListener('keydown', (event) => {
        if (isAnimating) return;
        if (event.key === 'ArrowRight') {
            moveNext();
        } else if (event.key === 'ArrowLeft') {
            movePrev();
        }
        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
        }, 600); // Match the transition duration
    });

    updateCards();
});

const loadSplineScene = async (canvasId, url) => {
    const canvas = document.getElementById(canvasId);
    const spline = new Application(canvas);
    await spline.load(url);
    spline.addEventListener('mouseup', async (e) => {
        const LinkPress = spline.getVariable('didlinkpress');
        const WWWPress = spline.getVariable('didwwwpress');
        if (WWWPress) {
            window.location.href = "http://www.w3schools.com";
        } else if (LinkPress) {
            window.location.href = "http://www.apple.com";
        } 
    });
};
// const auth = getAuth();
// onAuthStateChanged(auth, async (user) => {
//     if (user) {
//         const db = getFirestore();
//         const userDocRef = doc(db, 'users', user.uid);
//         try {
//             await updateDoc(userDocRef, {
//                 indexLiked: arrayUnion(currentCardIndex + 1)
//             });
//             console.log('Liked job index added to Firestore');
//         } catch (error) {
//             console.error('Error updating document: ', error);
//         }
//     } else {
//         console.log('No user is signed in');
//     }
// });

const sceneUrl = 'https://prod.spline.design/1K5Q-tNaVrfPjwqg/scene.splinecode';
loadSplineScene('canvas1', sceneUrl);
loadSplineScene('canvas2', sceneUrl);
loadSplineScene('canvas3', sceneUrl);
loadSplineScene('canvas4', sceneUrl);
