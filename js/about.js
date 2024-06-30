document.addEventListener('DOMContentLoaded', function() {
    // Temps entre 2 dates
    try {
        var resultat = Math.round((new Date() - new Date(2018, 7, 19)) / 31536000000);
        document.getElementById('startDev').innerHTML = resultat;
    }
    catch (error) {
    }
});

// Phrase cachée
function showTxt() {
    document.getElementById('txtHidden').innerHTML = ' (sauf les maths)'
}

// Reset l'affichage
function normalTxt() {
    document.getElementById('txtHidden').innerHTML = ''
}
