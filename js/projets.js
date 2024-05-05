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

// Récupérer les versions des projets & icône de chargement
document.addEventListener('DOMContentLoaded', function() {    
    fetch('https://api.sylvain.pro/fr/versions')
    .then(response => response.json())
    .then(data => {
        document.getElementById('api').innerHTML = data.api;
        document.getElementById('database').innerHTML = data.database;
        document.getElementById('coopbot').innerHTML = data.doc_coopbot;
        document.getElementById('coop-status').innerHTML = data.coop_status;
        document.getElementById('coop-api').innerHTML = data.coop_api;
        document.getElementById('nitrogen').innerHTML = data.nitrogen;
    });

    setInterval(function() {
        document.getElementById("loader").style.zIndex = '-1';
        document.getElementById("loader").style.opacity = '0';
        document.getElementById("loader").style.transition = '0.5s';
        document.getElementById("loader-wrapper").style.zIndex = '-1';
        document.getElementById("loader-wrapper").style.opacity = '0';
        document.getElementById("loader-wrapper").style.transition = '0.5s';
      }, 1800)
});