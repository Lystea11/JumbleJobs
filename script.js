import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { Application } from 'https://cdn.jsdelivr.net/npm/@splinetool/runtime@1.8.9/build/runtime.min.js';
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
var wwwrn = "";
var linkrn = "";
document.addEventListener('DOMContentLoaded', () => {
    wwwrn = mainList[currentCardIndex+1].www;
    linkrn = mainList[currentCardIndex+1].twitter;
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

    const noMoreJobsElement = document.getElementById('no-more-jobs');

    function updateCards() {
        if (currentCardIndex >= cards.length) {
            // No more cards, show the message
            noMoreJobsElement.classList.add('show');
        } else {
            wwwrn = mainList[currentCardIndex].www;
            linkrn = mainList[currentCardIndex].twitter;
            
            cards.forEach((card, index) => {
                card.classList.remove('active', 'exit-left', 'exit-right', 'magictime', 'tinRightOut', 'tinLeftOut', 'spaceInUp');
                if (index === currentCardIndex) {
                    card.classList.add('active');
                }
            });
        }
    }

    function moveNext() {
        if (currentCardIndex < cards.length) {
          updateUserIndexLiked("add", currentCardIndex + 1);
          gsap.to(cards[currentCardIndex], { x: '100%', opacity: 0, duration: 0.9, ease: 'power1.inOut', onComplete: () => {
            currentCardIndex++;
            updateCards();
          }});
        }
      }
      
      function movePrev() {
        if (currentCardIndex > 0) {
          updateUserIndexLiked("remove", currentCardIndex);
          gsap.to(cards[currentCardIndex], { x: '-100%', opacity: 0, duration: 0.9, ease: 'power1.inOut', onComplete: () => {
            currentCardIndex--;
            updateCards();
            gsap.fromTo(cards[currentCardIndex], { x: '-100%', opacity: 0 }, { x: '0%', opacity: 1, duration: 0.9, ease: 'power1.inOut' });
          }});
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
        
        let percentage;
        if (mouseX < middleX) {
          percentage = (1 - (mouseX / window.innerWidth)) * maxPercentage;
          gsap.to(semiCircleLeft, { clipPath: `ellipse(${percentage}% 50% at 0% 50%)`, duration: 0.3, ease: 'power1.out' });
          gsap.to(semiCircleRight, { clipPath: `ellipse(0% 50% at 100% 50%)`, duration: 0.3, ease: 'power1.out' });
        } else {
          percentage = ((mouseX / window.innerWidth) - 0.5) * 2 * maxPercentage;
          gsap.to(semiCircleRight, { clipPath: `ellipse(${percentage}% 50% at 100% 50%)`, duration: 0.3, ease: 'power1.out' });
          gsap.to(semiCircleLeft, { clipPath: `ellipse(0% 50% at 0% 50%)`, duration: 0.3, ease: 'power1.out' });
        }
      });
    document.addEventListener('mousedown', (event) => {
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
        console.log(linkrn);
        if (WWWPress) {
            window.open(wwwrn, "_blank", "noopener, noreferrer");
            spline.setVariable("didwwwpress", false);
        } else if (LinkPress) {
            spline.setVariable("didlinkpress", false);
            window.open(linkrn, "_blank", "noopener, noreferrer");
        } 
    });
};

const LogOverlay = document.getElementById("overlay1");

sortedList.forEach((element, index) => {
    console.log(index);
    loadSplineScene("canvas" + index,element.code);
});
