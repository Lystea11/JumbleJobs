import { Application } from './node_modules/@splinetool/runtime/build/runtime.js';
import { getFirestore, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

let currentCardIndex = 0;
let isAnimating = false;

document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.card'));

    function updateCards() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'exit-left', 'enter-right');
            if (index === currentCardIndex) {
                card.classList.add('active');
            } else if (index < currentCardIndex) {
                card.classList.add('exit-left');
            } else {
                card.classList.add('enter-right');
            }
        });
    }

    function moveNext() {
        if (currentCardIndex < cards.length - 1) {
            currentCardIndex++;
            updateCards();
        }
    }

    function movePrev() {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            updateCards();
        }
    }

    document.addEventListener('keydown', (event) => {
        if (isAnimating) return;
        isAnimating = true;
        if (event.key === 'ArrowRight') {
            moveNext();
        } else if (event.key === 'ArrowLeft') {
            movePrev();
        }
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
        const likedJob = spline.getVariable('DidLike');

        if (WWWPress) {
            window.location.href = "http://www.w3schools.com";
        } else if (LinkPress) {
            window.location.href = "http://www.apple.com";
        } else if (likedJob) {
            const auth = getAuth();
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const db = getFirestore();
                    const userDocRef = doc(db, 'users', user.uid);
                    try {
                        await updateDoc(userDocRef, {
                            indexLiked: arrayUnion(currentCardIndex + 1)
                        });
                        console.log('Liked job index added to Firestore');
                    } catch (error) {
                        console.error('Error updating document: ', error);
                    }
                } else {
                    console.log('No user is signed in');
                }
            });
        }
    });
};

const sceneUrl = 'https://prod.spline.design/1K5Q-tNaVrfPjwqg/scene.splinecode';
loadSplineScene('canvas1', sceneUrl);
loadSplineScene('canvas2', sceneUrl);
loadSplineScene('canvas3', sceneUrl);
