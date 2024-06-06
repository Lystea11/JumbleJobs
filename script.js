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
      }, 750); // Match the transition duration

      // Clear the timeout to prevent multiple triggers
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
          isAnimating = false;
      }, 750); // Match the transition duration
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
});
