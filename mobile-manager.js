// mobile-manager.js

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    
    // 1. Gestion du menu Burger pour mobile
    const createMobileMenu = () => {
        const navLinks = document.querySelector('.nav-links');
        const burger = document.createElement('div');
        burger.className = 'burger-menu';
        burger.innerHTML = '<i class="fas fa-bars"></i>';
        
        navbar.prepend(burger);

        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            burger.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    };

    // 2. Détection de l'orientation pour ajuster la grille
    window.addEventListener('orientationchange', () => {
        console.log("Orientation changée, ajustement de l'affichage...");
    });

    // 3. Optimisation du bouton "Charger plus" sur mobile (vibration haptique si supportée)
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn && 'vibrate' in navigator) {
        loadMoreBtn.addEventListener('click', () => {
            navigator.vibrate(50); // Petite vibration lors du clic sur mobile
        });
    }

    if (window.innerWidth <= 768) {
        createMobileMenu();
    }
});
