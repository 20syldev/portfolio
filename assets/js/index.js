let menuToggled = false;
const notification = document.querySelector('.notification');

// Mettre à jour la navigation du menu
const updateMenu = () => {
    const sections = ['skills', 'projets', 'global-chat', 'cv'];
    let activeId = window.scrollY === 0 ? 'about' : sections.find(id => {
        const rect = document.getElementById(id).getBoundingClientRect();
        return rect.top <= window.innerHeight / 8 && rect.bottom >= window.innerHeight / 8;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5) activeId = 'cv';
    document.querySelectorAll('.menu-list a').forEach(link =>
        link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`)
    );
};

// Afficher les tags interactifs en entier
const showTag = (selector, text, iconClass) => {
    document.querySelectorAll(selector).forEach(el => {
        const initial = el.innerHTML;
        el.addEventListener('mouseover', () => el.innerHTML = `<i class="${iconClass} icon mr-1"></i> ${text}`);
        el.addEventListener('mouseout', () => el.innerHTML = initial);
    });
};

// Cache une notification avec une animation
const hideNotification = () => {
    notification.classList.add('slide-out');
    setTimeout(() => notification.style.display = 'none', 1000);
};

// Ouvre ou ferme le menu latéral
const toggleMenu = () => {
    menuToggled = !menuToggled;
    document.querySelectorAll('.side-menu, .menu-btn, .switch-btn').forEach(el => 
        el.classList.toggle('is-visible', menuToggled)
    );
};

// Au chargement de la page
window.addEventListener('load', () => {
    updateMenu();
    document.addEventListener('scroll', updateMenu);

    // Affichage des tags interactifs
    showTag('.pause', 'Projet en pause', 'fa-solid fa-pause');
    showTag('.old', 'Projet archivé', 'fa-solid fa-file-arrow-down');

    // Animation des barres de progression
    document.querySelectorAll('.progress').forEach(progressBar => {
        const max = progressBar.getAttribute('value');
        const duration = 4000;
        progressBar.value = 0;

        function animate(timestamp, startTime) {
            const progress = Math.min((timestamp - startTime) / duration, 1);
            progressBar.value = max * (0.5 * (1 - Math.cos(Math.PI * progress)));
            if (progress < 1) requestAnimationFrame(t => animate(t, startTime));
        }
        setTimeout(() => requestAnimationFrame(t => animate(t, t)), 500);
    });

    // Notifications au chargement
    setTimeout(() => notification.classList.add('slide-in'), 3000);
    setTimeout(() => notification.classList.replace('slide-in', 'slide-out'), 8000);
});

// Fermeture du menu en cliquant en dehors
['click', 'touchmove'].forEach(event => {
    document.body.addEventListener(event, (e) => {
        if (!e.target.closest('.side-menu, .menu-btn, .switch-btn') && menuToggled) toggleMenu();
    });
});
