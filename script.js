import { Application } from './node_modules/@splinetool/runtime/build/runtime.js';
import { getFirestore, doc, updateDoc, arrayUnion } from "https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.2/firebase-firestore.min.js";
import { getAuth, onAuthStateChanged } from "https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.2/firebase-auth.min.js";

let currentCardIndex = 0;
let isAnimating = false;

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
            currentCardIndex++;
            console.log("went right");
            updateCards();
        }
    }

    function movePrev() {
        if (currentCardIndex < cards.length - 1) {
            cards[currentCardIndex].classList.add('exit-left');
            currentCardIndex++;
            console.log("went left");
            updateCards();
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
        }, 400); // Match the transition duration
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
