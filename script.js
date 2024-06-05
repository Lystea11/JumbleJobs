document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const cards = Array.from(document.querySelectorAll('.card'));
    let currentCardIndex = 0;
    
    function setCardPosition(card, position) {
      card.style.transform = `translateY(${position}px)`;
      card.style.opacity = position === 0 ? '1' : '0';
    }
  
    function updateCards() {
      const viewportHeight = window.innerHeight;
      cards.forEach((card, index) => {
        const offset = index - currentCardIndex;
        const position = offset * viewportHeight;
        setCardPosition(card, position);
      });
    }
  
    function onScroll(event) {
      if (event.deltaY > 0) {
        currentCardIndex = (currentCardIndex + 1) % cards.length;
      } else {
        currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
      }
      updateCards();
    }
  
    window.addEventListener('wheel', onScroll);
  
    updateCards();
  });
  