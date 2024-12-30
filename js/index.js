let menuToggled = false;

// Au chargement
window.addEventListener('load', function() {
    // Tag projet en pause
    document.querySelectorAll('.pause').forEach(pause => {
        const initial = pause.innerHTML;
        pause.addEventListener('mouseover', () => {
            pause.innerHTML = '<i class="fa-solid fa-pause icon mr-1"></i> Projet en pause';
        });
        pause.addEventListener('mouseout', () => {
            pause.innerHTML = initial;
        });
    });

    // Tag projet archivé
    document.querySelectorAll('.old').forEach(archive => {
        const initial = archive.innerHTML;
        archive.addEventListener('mouseover', () => {
            archive.innerHTML = '<i class="fa-solid fa-file-arrow-down icon mr-1"></i> Projet archivé';
        });
        archive.addEventListener('mouseout', () => {
            archive.innerHTML = initial;
        });
    });

    // Barres de progression
    document.querySelectorAll('.progress').forEach(function(progressBar) {
        let max = progressBar.getAttribute('value');
        let duration = 4000;

        progressBar.value = 0;

        function animate(timestamp, startTime) {
            let progress = Math.min((timestamp - startTime) / duration, 1);
            let easedProgress = 0.5 * (1 - Math.cos(Math.PI * progress));
            progressBar.value = max * easedProgress;
            if (progress < 1) requestAnimationFrame((t) => animate(t, startTime));
        }
    
        setTimeout(() => {
            requestAnimationFrame((timestamp) => animate(timestamp, timestamp));
        }, 500);
    });

    // Notification au chargement
    const notif = document.getElementById('notif');
    setTimeout(function() {
        notif.classList.add('slide-in');
    }, 3000);

    setTimeout(function() {
        notif.classList.remove('slide-in');
        notif.classList.add('slide-out');
    }, 8000);
});

// Forcer la disparition de la notification
function hideNotification() {
    const notification = document.getElementById('notif');
    notification.classList.add('slide-out');
    setTimeout(() => notification.style.display = 'none', 1000);
}

// Afficher ou cacher le menu
function toggleMenu() {
    menuToggled = !menuToggled;
    document.getElementById('sidebar').classList.toggle('is-visible', menuToggled);
    document.getElementById('menu-btn').classList.toggle('is-visible', menuToggled);
}

// Gestion du menu
['click', 'touchstart'].forEach(event => {
    document.body.addEventListener(event, (e) => {
        if (!e.target.closest('#sidebar') && !e.target.closest('#menu-btn') && menuToggled) {
            toggleMenu();
        }
    });
});