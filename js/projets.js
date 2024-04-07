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