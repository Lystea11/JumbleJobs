javascript
import { Application } from './node_modules/@splinetool/runtime/build/runtime.js';
import { getFirestore, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js"; 
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.card'));
    let currentCardIndex = 0;
    let isAnimating = false;
    let scrollTimeout;

    function setCardPosition(card, position) {
        card.style.transform = `translateY(${position}%)`;
        card.style.opacity = position === 0 ? '1' : '0';
        card.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
    }

    function updateCards() {
        cards.forEach((card, index) => {
            const offset = index - currentCardIndex;
            const position = offset * 100;
            setCardPosition(card, position);
        });
    }

    function onScroll(event) {
        if (isAnimating) return;
        isAnimating = true;

        currentCardIndex = (currentCardIndex + 1) % cards.length;
        updateCards();

        setTimeout(() => {
            isAnimating = false;
        }, 1000); // Match the transition duration

        // Clear the timeout to prevent multiple triggers
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isAnimating = false;
        }, 1000); // Match the transition duration
    }

    function handleScroll(event) {
        event.preventDefault();
        if (!isAnimating) {
            onScroll(event);
        }
    }

    window.addEventListener('wheel', handleScroll, { passive: false });

    // Prevent default scrolling behavior
    window.addEventListener('scroll', (event) => {
        event.preventDefault();
        window.scrollTo(0, 0);
    });

    updateCards();

    // Spline runtime integration
});


const canvas = document.getElementById('canvas1');
const spline = new Application(canvas);
spline.load('https://prod.spline.design/1K5Q-tNaVrfPjwqg/scene.splinecode').then(() => {
    spline.addEventListener('mouseup', async (e) => {
        const LinkPress = spline.getVariable('didlinkpress');
        const WWWPress = spline.getVariable('didwwwpress');
        const likedJob = spline.getVariable('DidLike');

        if (WWWPress) {
            // Do something if the boolean variable is true
            window.location.href = "http://www.w3schools.com";
        } else if (LinkPress) {
            // Do something if the boolean variable is false
            window.location.href = "http://www.apple.com";
        } else if (likedJob) {
            // Get the authenticated user
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
});