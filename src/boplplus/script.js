document.addEventListener("scroll", function() {
    const scrolled = window.scrollY;
    const speed = 0.8; // Adjust this value to change the speed of the parallax effect
    document.querySelector('body').style.backgroundPosition = `center ${-scrolled * speed}px`;
});