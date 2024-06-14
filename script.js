document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.card'));
    let currentCardIndex = 0;
    let isAnimating = false;

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
    }

    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    const debouncedOnScroll = debounce(onScroll, 300); // Adjust delay as needed

    function handleScroll(event) {
        event.preventDefault();
        if (!isAnimating) {
            debouncedOnScroll(event);
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
