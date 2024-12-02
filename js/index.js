// Au chargement
window.addEventListener('load', function() {
    // Infos au survol
    document.querySelectorAll('.pause').forEach(function(pause) {
        pause.addEventListener('mouseover', function() {
            pause.innerHTML = '<i class="fa-solid fa-pause icon mr-1"></i> Projet en pause';
        });
        pause.addEventListener('mouseout', function() {
            pause.innerHTML = '<i class="fa-solid fa-pause icon"></i>';
        });
    });

    document.querySelectorAll('.wip').forEach(function(wip) {
        wip.addEventListener('mouseover', function() {
            wip.innerHTML = 'Work In Progress';
        });
        wip.addEventListener('mouseout', function() {
            wip.innerHTML = 'WIP';
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