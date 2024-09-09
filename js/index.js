// Au chargement
window.addEventListener('load', function() {    
    // Barres de progression
    document.querySelectorAll('.progress').forEach(function(progressBar) {
        let max = progressBar.getAttribute('value');
        let duration = 3000;

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
    const announcement = document.getElementById('announcement');
    setTimeout(function() {
        announcement.classList.add('slide-in');
    }, 1000);

    setTimeout(function() {
        announcement.classList.remove('slide-in');
        announcement.classList.add('slide-out');
    }, 6000);
});

// Forcer la disparition de la notification
function hideNotification() {
    const notification = document.getElementById('announcement');
    notification.classList.add('slide-out');
    setTimeout(() => notification.style.display = 'none', 1000);
  }