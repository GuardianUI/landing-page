(() => {
    // Select HTML Elements
    const hamburger = document.querySelector(".hamburger");
    const header = document.querySelector("header");
    const navList = document.querySelector(".nav-list");

    // Handles Mobile Navigation Bar
    const toggleMobileNav = () => {
        header.classList.toggle("open");
    };

    // Event Listeners
    hamburger.addEventListener("click", toggleMobileNav);
    navList.addEventListener("click", toggleMobileNav);
})();
