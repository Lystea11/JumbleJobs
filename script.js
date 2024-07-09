import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { Application } from 'https://cdn.jsdelivr.net/npm/@splinetool/runtime@1.8.8/build/runtime.min.js';
import { mainList } from "./data.js";
var HasUserLoaded = false;

function shuffle(array) { // shuffling 
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


let sortedList = mainList;
shuffle(sortedList);
console.log(sortedList);
let currentCardIndex = 0;
var isHoveringOnProf = false;
let prof = document.getElementById("allMenu");

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Ensure that Firebase Auth and Firestore are registered
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const semiCircleLeft = document.querySelector('.semi-circle.left');
const semiCircleRight = document.querySelector('.semi-circle.right');

let currentUser = null;

prof.addEventListener("mouseover", (event) => {
    isHoveringOnProf = true;
});
prof.addEventListener("mouseout", (event) => {
    isHoveringOnProf = false;
})

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        HasUserLoaded = true;
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
        console.error("ID not found in the array, id = " + index);
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
    const checkLoginStatus = setInterval(() => {
        if (HasUserLoaded) {
            clearInterval(checkLoginStatus);


    const cards = Array.from(document.querySelectorAll('.card'));
    const semiCircleLeft = document.querySelector('.semi-circle.left');
    const semiCircleRight = document.querySelector('.semi-circle.right');
    const bufferPercentage = 0.45;
    let isAnimating = false;
    let currentCardIndex = 0;
    let inLeftBuffer = false;
    let inRightBuffer = false;

    function updateCards() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'exit-left', 'exit-right', 'magictime', 'tinRightOut', 'tinLeftOut', 'spaceInUp');
            if (index === currentCardIndex) {
                card.classList.add('active');
            }
        });
    }

    function moveNext() {
        if (currentCardIndex < cards.length - 1) {
            updateUserIndexLiked("add", currentCardIndex + 1);
            cards[currentCardIndex].classList.add('magictime', 'tinRightOut');
            setTimeout(() => {
                currentCardIndex++;
                updateCards();
            }, 900); // Match the animation duration of Magic CSS Animations
        }
    }
    
    function movePrev() {
        if (currentCardIndex >= 0) {
            updateUserIndexLiked("remove", currentCardIndex + 1);
            cards[currentCardIndex].classList.add('magictime', 'tinLeftOut');
            setTimeout(() => {
                currentCardIndex++;
                updateCards();
            }, 900); // Match the animation duration of Magic CSS Animations
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
    document.addEventListener('mouseup', (event) => {
        const middleX = window.innerWidth / 2;
        const mouseX = event.clientX;
        const bufferLeft = middleX * (1 - bufferPercentage);
        const bufferRight = middleX * (1 + bufferPercentage);

        if (mouseX < bufferLeft && isHoveringOnProf == false) {
            movePrev();
        } else if (mouseX > bufferRight && isHoveringOnProf == false) {
            moveNext();
        }
    });

    updateCards();
    }
    }, 500); // Check every 500 milliseconds (1/2 second)
});

const loadSplineScene = async (canvasId, url) => {
    const canvas = document.getElementById(canvasId);
    const spline = new Application(canvas);
    await spline.load(url);
    spline.addEventListener('mouseup', async (e) => {
        const LinkPress = spline.getVariable('didlinkpress');
        const WWWPress = spline.getVariable('didwwwpress');
        
        console.log(currentCardIndex);
        var www = mainList[currentCardIndex+1].www;
        var twitt = mainList[currentCardIndex+1].twitter;
        if (WWWPress) {
            window.location.href = www;
        } else if (LinkPress) {
            window.location.href = twitt;
        } 
    });
};

const LogOverlay = document.getElementById("overlay1");

sortedList.forEach((element, index) => {
    console.log(index);
    loadSplineScene("canvas" + index,element.code);
});
