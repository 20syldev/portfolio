// Chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Animation du texte de chargement
    let phrases = ['Connexion à la base', 'Récupération des données', 'Chargement des versions', 'Ça arrive', 'C\'est presque terminé', 'Une petite seconde'];
    let loadTime = 90000;
    let changeIntervals = [0.127, 0.2, 0.3, 0.5, 0.7, 0.85];
    let i = 0, d = 0;

    changeIntervals.forEach((interval, j) => {
        setTimeout(() => {
            i = j + 1;
            if (i >= phrases.length) {
                i = 1;
            }
        }, interval * loadTime);
    });

    loading = setInterval(() => {
        d = (d + 1) % 4;
        let loader = phrases[i] + (i !== 3 && i !== 4 && i !== 5 ? '.'.repeat(d) : '');
        document.getElementById('loaderText').innerHTML = loader;
    }, 500);

    // Bloquer le scrolling au chargement
    document.body.style.overflow = 'hidden';

    // Récupérer les versions de mes projets
    fetch('https://api.sylvain.pro/fr/versions')
    .then(response => response.json())
    .then(data => {
        document.getElementById('api').innerHTML = data.api;
        document.getElementById('coopbot').innerHTML = data.doc_coopbot;
        document.getElementById('coop-status').innerHTML = data.coop_status;
        document.getElementById('database').innerHTML = data.database;
        document.getElementById('gitsite').innerHTML = data.gitsite;
        document.getElementById('nitrogen').innerHTML = data.nitrogen;
        
        // Récupérer le nombre d'endpoints
        fetch('https://api.sylvain.pro/fr/infos')
        .then(response => response.json())
        .then(data => {
            clearInterval(loading);
            document.getElementById('endpoints').innerHTML = data.endpoints;
            document.getElementById('loaderText').innerHTML = 'Terminé !';
        })
        .finally(() => {
            // Cacher le loader dès que les données sont chargées
            document.getElementById("loader").style.zIndex = '-1';
            document.getElementById("loader").style.opacity = '0';
            document.getElementById("loader").style.transition = '0.5s';
            document.getElementById("loader-wrapper").style.zIndex = '-1';
            document.getElementById("loader-wrapper").style.opacity = '0';
            document.getElementById("loader-wrapper").style.transition = '0.5s';
            document.body.style.overflow = 'auto';
            window.scroll({ top: 0, behavior: 'instant' });
        });
    });
});

// Affichage de la barre
window.onscroll = updateBar;
function updateBar() {
    if (window.scrollY >= window.innerHeight * 0.1) {
        document.getElementById('bar').style.width = '100%';
        document.getElementById('bar').style.opacity = '1';
        document.getElementById('bar').style.transition = '1s';
    } else {
        document.getElementById('bar').style.width = '0';
        document.getElementById('bar').style.opacity = '0';
        document.getElementById('bar').style.transition = '0.5s';
    }
}
