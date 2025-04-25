function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
    
    // Optional: Toggle hamburger icon animation
    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle.classList.toggle('open');
}
