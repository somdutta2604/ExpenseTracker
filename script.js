function toggleMenu() {
    const navLinks = document.querySelector(".nav-links");
    const menuIcon = document.querySelector(".menu-icon");
    const closeIcon = document.querySelector(".close-icon");
    
    navLinks.classList.toggle("active");
    
    if (navLinks.classList.contains("active")) {
        menuIcon.style.display = "none";
        closeIcon.style.display = "inline";
    } else {
        menuIcon.style.display = "inline";
        closeIcon.style.display = "none";
    }
}