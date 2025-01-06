let menuToggled = false, currentTheme = 0, notifTimeout;
const notification = document.querySelector('.notification');
const modes = ['auto', 'light', 'dark'];

// Mettre à jour la navigation du menu
const updateMenu = () => {
    const sections = ['skills', 'projects', 'cv'];
    let activeId = window.scrollY === 0 
        ? 'about' 
        : (window.innerHeight + window.scrollY >= document.body.scrollHeight 
        ? 'cv' 
        : sections.find(id => {
            const rect = document.getElementById(id).getBoundingClientRect();
            return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
        })
    );
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

// Définir le thème pour le site
const setTheme = (mode) => {
    const theme = mode === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : mode;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', mode);

    const icon = document.querySelector('.switch-btn i') || document.createElement('i');
    if (!icon.parentElement) document.querySelector('.switch-btn').appendChild(icon);
    icon.className = { light: 'fa-solid fa-sun', dark: 'fa-solid fa-moon', auto: 'fa-solid fa-wand-magic-sparkles' }[mode];

    const themeNotif = document.querySelector('.theme-notif');
    themeNotif.textContent = { light: 'Mode clair', dark: 'Mode sombre', auto: 'Automatique' }[mode];
    themeNotif.classList.remove('show', 'hide');
    void themeNotif.offsetWidth;
    themeNotif.classList.add('show');
    clearTimeout(notifTimeout);
    notifTimeout = setTimeout(() => themeNotif.classList.add('hide'), 3000);
};

// Appliquer le thème enregistré ou celui par défaut
const applySavedTheme = () => {
    const theme = localStorage.getItem('theme') || 'auto';
    setTheme(theme);
    currentTheme = modes.indexOf(theme);
};

// Changer de thème automatiquement
const autoSwitch = () => {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)');
    const setCurrentTheme = () => setTheme(darkMode.matches ? 'dark' : 'light');
    if (localStorage.getItem('theme') === 'auto') setCurrentTheme();
    darkMode.addEventListener('change', setCurrentTheme);
};

// Au chargement de la page
window.addEventListener('load', () => {
    applySavedTheme();
    autoSwitch();
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

// Bouton de changement de thème
document.querySelector('.switch-btn').addEventListener('click', () => {
    currentTheme = (currentTheme + 1) % modes.length;
    setTheme(modes[currentTheme]);
});
