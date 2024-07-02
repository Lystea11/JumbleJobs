import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { Application } from 'https://cdn.jsdelivr.net/npm/@splinetool/runtime@1.7.6/build/runtime.min.js';

function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

export const mainList = [{"id":1,"code":"https://prod.spline.design/1K5Q-tNaVrfPjwqg/scene.splinecode"}, 
    {"id":2,"code":"https://prod.spline.design/1K5Q-tNaVrfPjwqg/scene.splinecode"}, 
    {"id":3,"code":"https://prod.spline.design/1K5Q-tNaVrfPjwqg/scene.splinecode"}, 
    {"id":4,"code":"https://prod.spline.design/1K5Q-tNaVrfPjwqg/scene.splinecode"}, 
    {"id":5,"code":"https://prod.spline.design/1K5Q-tNaVrfPjwqg/scene.splinecode"}, 
    {"id":6,"code":"https://prod.spline.design/1K5Q-tNaVrfPjwqg/scene.splinecode"}, 
    {"id":7,"code":"https://prod.spline.design/1K5Q-tNaVrfPjwqg/scene.splinecode"}, 
    {"id":8,"code":"https://prod.spline.design/1K5Q-tNaVrfPjwqg/scene.splinecode"}, 
    {"id":9,"code":"https://prod.spline.design/1K5Q-tNaVrfPjwqg/scene.splinecode"}, 
    {"id":10,"code":"https://prod.spline.design/1K5Q-tNaVrfPjwqg/scene.splinecode"}];
let sortedList = mainList;
shuffle(sortedList);
console.log(sortedList);
let currentCardIndex = 0;
let isAnimating = false;

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Ensure that Firebase Auth and Firestore are registered
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const semiCircleLeft = document.querySelector('.semi-circle.left');
const semiCircleRight = document.querySelector('.semi-circle.right');

let currentUser = null;

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    } else {
        currentUser = null;
    }
});

const codeMap = new Map(sortedList.map(item => [item.id, item.code]));

async function updateUserIndexLiked(operation, index) {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    const code = codeMap.get(index);

    if (!code) {
        console.error("ID not found in the array");
        return;
    }

    try {
        if (operation === 'add') {
            await updateDoc(userRef, {
                indexLiked: arrayUnion(code)
            });
        } else if (operation === 'remove') {
            await updateDoc(userRef, {
                indexLiked: arrayRemove(code)
            });
        }
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.card'));
    const semiCircleLeft = document.querySelector('.semi-circle.left');
    const semiCircleRight = document.querySelector('.semi-circle.right');
    const bufferPercentage = 0.25;
    let isAnimating = false;
    let currentCardIndex = 0;

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
                updateCards();
            }, 600); // Match the transition duration
        }
    }

    function movePrev() {
        if (currentCardIndex > 0) {
            cards[currentCardIndex].classList.add('exit-left');
            setTimeout(() => {
                currentCardIndex--;
                updateCards();
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

    document.addEventListener('mousemove', (event) => {
        const middleX = window.innerWidth / 2;
        const mouseX = event.clientX;
        const maxPercentage = 25; // Maximum percentage of the screen width

        if (mouseX < middleX) {
            const percentage = (1 - (mouseX / window.innerWidth)) * maxPercentage;
            semiCircleLeft.style.clipPath = `ellipse(${percentage}% 50% at 0% 50%)`;
            semiCircleRight.style.clipPath = `ellipse(0% 50% at 100% 50%)`;
        } else {
            const percentage = ((mouseX / window.innerWidth) - 0.5) * 2 * maxPercentage;
            semiCircleRight.style.clipPath = `ellipse(${percentage}% 50% at 100% 50%)`;
            semiCircleLeft.style.clipPath = `ellipse(0% 50% at 0% 50%)`;
        }
    });

    document.addEventListener('mousedown', (event) => {
        const middleX = window.innerWidth / 2;
        const mouseX = event.clientX;
        const bufferLeft = middleX * (1 - bufferPercentage);
        const bufferRight = middleX * (1 + bufferPercentage);

        if (mouseX < bufferLeft) {
            semiCircleLeft.classList.add('animate-left');
            setTimeout(() => semiCircleLeft.classList.remove('animate-left'), 400);
            movePrev();
        } else if (mouseX > bufferRight) {
            semiCircleRight.classList.add('animate-right');
            setTimeout(() => semiCircleRight.classList.remove('animate-right'), 400);
            moveNext();
        }
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
visualViewport.addEventListener("resize", () => {
    location.reload();
  });

const LogOverlay = document.getElementById("overlay1");
document.addEventListener("mousedown", handler, true);
    
function handler(e) { // DISABLE CLICKS IF OVERLAY
    if(LogOverlay.style.display != "none") {
        e.stopPropagation();
        e.preventDefault();
    }
}

sortedList.forEach((element, index) => {
    console.log(index);
    loadSplineScene("canvas" + index,element.code);
});
