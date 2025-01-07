let currentTheme = 0, notifTimeout;
const modes = ['auto', 'light', 'dark'];

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
    const updateTheme = () => localStorage.getItem('theme') === 'auto' && 
        document.documentElement.setAttribute('data-theme', darkMode.matches ? 'dark' : 'light');
    darkMode.addEventListener('change', updateTheme);
};

// Au chargement de la page
window.addEventListener('load', () => {
    applySavedTheme();
    autoSwitch();
});

// Synchroniser les thèmes sur tous les onglets
window.addEventListener('storage', (event) => {
    if (event.key === 'theme' && event.newValue) {
        setTheme(event.newValue);
        currentTheme = modes.indexOf(event.newValue);
    }
});

// Bouton de changement de thème
document.querySelector('.switch-btn').addEventListener('click', () => {
    currentTheme = (currentTheme + 1) % modes.length;
    setTheme(modes[currentTheme]);
});
