import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

setPersistence(auth, browserLocalPersistence).then(() => {
     const overlay = document.getElementById('overlay1');
     const notificationButton = document.getElementById('notificationButton');
     const notificationBadge = document.getElementById('notificationBadge');
     const notificationMenu = document.getElementById('notificationMenu');
     const chatButton = document.getElementById('chatButton');
     const accountInfo = document.getElementById('accountInfo');
     const accountMenu = document.getElementById('accountMenu');
     const chatSidebar = document.getElementById('chatSidebar');
     const closeChatButton = document.getElementById('closeChatButton');
   
     let activeMenu = null;
     let isFirstNotificationOpen = true;
   
     function toggleMenu(menu) {
        if (activeMenu && activeMenu !== menu) {
          activeMenu.classList.remove('active');
        }
        
        if (activeMenu === menu) {
          menu.classList.remove('active');
          activeMenu = null;
        } else {
          menu.classList.add('active');
          activeMenu = menu;
        }
    
        if (menu === notificationMenu && isFirstNotificationOpen) {
          hideNotificationBadge();
          isFirstNotificationOpen = false;
        }
      }
   
      function hideNotificationBadge() {
        notificationBadge.classList.add('hide');
        notificationBadge.addEventListener('animationend', () => {
          notificationBadge.style.display = 'none';
        }, { once: true });
      }
   
      function closeAllMenus() {
        if (activeMenu) {
          activeMenu.classList.remove('active');
          activeMenu = null;
        }
      }
   
      function toggleChatSidebar() {
        chatSidebar.classList.toggle('active');
        closeAllMenus();
      }
   
      notificationButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMenu(notificationMenu);
      });
   
      accountInfo.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMenu(accountMenu);
      });
   
      chatButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleChatSidebar();
      });
    
      closeChatButton.addEventListener('click', () => {
        chatSidebar.classList.remove('active');
      });
   
      document.addEventListener('click', (event) => {
        if (!event.target.closest('#allMenu') && !event.target.closest('#chatSidebar')) {
          closeAllMenus();
          chatSidebar.classList.remove('active');
        }
      });
    
      // Prevent clicks inside menus from closing them
      notificationMenu.addEventListener('click', (event) => {
        event.stopPropagation();
      });
   
      accountMenu.addEventListener('click', (event) => {
        event.stopPropagation();
      });
    
      chatSidebar.addEventListener('click', (event) => {
        event.stopPropagation();
      });
   
     // Chat functionality
     const chatContent = document.getElementById('chatContent');
     const chatInput = document.getElementById('chatInput');
     const sendMessageButton = document.getElementById('sendMessageButton');
   
     function addMessage(message, isUser = false) {
       const messageElement = document.createElement('div');
       messageElement.classList.add('chat-message');
       if (isUser) {
         messageElement.classList.add('user-message');
       }
   
       messageElement.innerHTML = `
         <div class="chat-avatar">${isUser ? '👦' : '👤'}</div>
         <div class="chat-bubble">${message}</div>
       `;
   
       chatContent.appendChild(messageElement);
       chatContent.scrollTop = chatContent.scrollHeight;
     }
   
     function sendMessage() {
       const message = chatInput.value.trim();
       if (message) {
         addMessage(message, true);
         chatInput.value = '';
         setTimeout(() => {
           addMessage(`Thank you! We will get in contact soon.`);
         }, 1500);
       }
     }
   
     sendMessageButton.addEventListener('click', sendMessage);
   
     chatInput.addEventListener('keypress', (event) => {
       if (event.key === 'Enter') {
         sendMessage();
       }
     });
   
     // Animate notification items
     const notificationItems = document.querySelectorAll('.notification-item');
     notificationItems.forEach((item, index) => {
       item.style.animationDelay = `${index * 0.1}s`;
       item.classList.add('animate__animated', 'animate__fadeInUp');
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