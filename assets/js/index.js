let menuToggled = false;

/**
 * Fonctions
 */

// Met à jour les liens actifs en fonction du scroll
function updateMenu() {
    const sections = ['skills', 'projects', 'cv'];
    let activeId = window.scrollY === 0 ? 'about' : (window.innerHeight + window.scrollY >= document.body.scrollHeight ? 'cv' : sections.find(id => {
        const rect = document.getElementById(id).getBoundingClientRect();
        return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
    }));

    document.querySelectorAll('.menu-list a').forEach(link =>
        link.classList.toggle('is-active', link.getAttribute('href') === `#${activeId}`)
    );
}

// Applique l'effet hover sur les éléments de projet
function showTag(selector, text, iconClass) {
    document.querySelectorAll(selector).forEach(element => {
        const initial = element.innerHTML;
        element.addEventListener('mouseover', () => {
            element.innerHTML = `<i class="${iconClass} icon mr-1"></i> ${text}`;
        });
        element.addEventListener('mouseout', () => {
            element.innerHTML = initial;
        });
    });
}

// Cache la notification
function hideNotification() {
    const notification = document.getElementById('notif');
    notification.classList.add('slide-out');
    setTimeout(() => notification.style.display = 'none', 1000);
}

// Affiche/masque le menu
function toggleMenu() {
    menuToggled = !menuToggled;
    document.getElementById('sidebar').classList.toggle('is-visible', menuToggled);
    document.getElementById('menu-btn').classList.toggle('is-visible', menuToggled);
}

/**
 * Événements
 */

// Initialisation et événements
window.addEventListener('load', () => {
    const notif = document.getElementById('notif');

    // Mise à jour des liens actifs au scroll
    document.addEventListener('scroll', updateMenu);
    updateMenu();

    // Effet hover pour les projets en pause/archivés
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

    // Animation de la notification
    setTimeout(() => notif.classList.add('slide-in'), 3000);
    setTimeout(() => {
        notif.classList.remove('slide-in');
        notif.classList.add('slide-out');
    }, 8000);
});

// Fermeture du menu
['click', 'touchmove'].forEach(event => {
    document.body.addEventListener(event, (e) => {
        if (!e.target.closest('#sidebar') && !e.target.closest('#menu-btn') && menuToggled) {
            toggleMenu();
        }
    });
});
