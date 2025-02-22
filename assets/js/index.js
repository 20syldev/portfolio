let menuToggled = false;

// Mettre à jour la navigation du menu
const updateMenu = () => {
    const sections = ['skills', 'projets', 'badges'];
    let activeId = window.scrollY === 0 ? 'about' : sections.find(id => {
        const rect = document.getElementById(id).getBoundingClientRect();
        return rect.top <= window.innerHeight / 8 && rect.bottom >= window.innerHeight / 8;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5) activeId = 'badges';
    else if (!activeId) activeId = sections[0];
    document.querySelectorAll('.menu-list a').forEach(link => {
        const targetId = link.getAttribute('onclick')?.match(/#(\w+)/)?.[1];
        link.classList.toggle('is-active', targetId === activeId && activeId);
    });
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
    const notification = document.querySelector('.notification');
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

// Télécharge un fichier depuis une URL
const downloadFile = file => Object.assign(document.createElement('a'), { href: file, download: '' }).click();

// Anime le texte d'un élément
const animateText = () => {
    document.querySelectorAll('.bounce').forEach(el => el.innerHTML = [...el.textContent].map((char, index) =>
        char === ' ' ? ' ' : `<span style="animation-delay:${index * 0.1}s">${char}</span>`
    ).join(''));
};

// Au chargement de la page
window.addEventListener('load', () => {
    animateText();
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
});

// Fermeture du menu en cliquant en dehors
['click', 'touchmove'].forEach(event => {
    document.body.addEventListener(event, (e) => {
        if (!e.target.closest('.side-menu, .menu-btn, .switch-btn') && menuToggled) toggleMenu();
    });
});
