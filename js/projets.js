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

document.addEventListener('DOMContentLoaded', function() {
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
            document.getElementById('endpoints').innerHTML = data.endpoints;
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