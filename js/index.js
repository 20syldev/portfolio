document.addEventListener('DOMContentLoaded', function() {
    // Afficher ou non le texte italique
    if (localStorage.getItem('italique') !== 'true') {
      document.getElementById('info').style.visibility = 'visible';
    }

    // Pourcentage entre 2 dates (année scolaire)
    var start = new Date(2023, 8, 1);
    var end = new Date(2024, 5, 31, 23, 59, 59);
    var today = new Date();

    try {
        if (today < start) {
            document.getElementById('pourcentage').innerHTML = '0%';
        
        } 
        if (today > end) {
            document.getElementById('pourcentage').innerHTML = '100%';  
        } 
        else {
            var startEnd = end - start;
            var startToday = today - start;
            var pourcent = Math.round((startToday / startEnd) * 100);
            document.getElementById('pourcentage').innerHTML = pourcent + '%';
        }
    }
    catch (error) {
    }

    // Temps entre 2 dates
    try {
        var resultat = Math.round((new Date() - new Date(2018, 7, 19)) / 31536000000);
        document.getElementById('startDev').innerHTML = resultat;
    }
    catch (error) {
    }
});

// Fait un zoom de texte
function big(event) {
    event.target.style.fontSize = '1.4em';
    event.target.style.textDecoration = 'underline';
    event.target.style.transition = '1s';
}

// Reset le texte
function normal(event) {
    event.target.style.fontSize = '';
    event.target.style.textDecoration = '';
    event.target.style.transition = '1s';
}

// Paragraphe sous le sous-titre, et déplacement du bouton
function showSubTxt(text) {
    document.getElementById('txtChange' + text).style.textDecoration = 'underline';
    document.getElementById('txtChange' + text).style.fontSize = '1.1em';
    document.getElementById('txtChange' + text).style.paddingLeft = '5px';
    document.getElementById('txtChange' + text).style.paddingRight = '5px';
    document.getElementById('txtChange' + text).style.transition = '0.5s';

    document.getElementById('headerTxt' + text).style.opacity = '1';
    document.getElementById('headerTxt' + text).style.transition = '0.5s';
    
    document.getElementById('info').style.visibility = 'hidden';

    document.getElementById('bottom').style.marginTop = '-6vh';
    document.getElementById('bottom').style.transition = '0.6s';

    document.getElementById('btnProj').style.marginTop = '10vh';
    document.getElementById('btnProj').style.transition = '0.6s';
    
    document.getElementById('codeBtn').style.marginTop = '15vh';
    document.getElementById('codeBtn').style.transition = '0.4s';

    localStorage.setItem('italique', 'true')
}

// Reset l'affichage du sous-titre
function normalSubTxt(text) {
    document.getElementById('txtChange' + text).style.textDecoration = 'none';
    document.getElementById('txtChange' + text).style.fontSize = '1em';
    document.getElementById('txtChange' + text).style.padding = '0';
    document.getElementById('txtChange' + text).style.transition = '0.5s';

    document.getElementById('headerTxt' + text).style.opacity = '0';
    document.getElementById('headerTxt' + text).style.transition = '0.5s';

    document.getElementById('bottom').style.marginTop = '';
    document.getElementById('bottom').style.transitionDelay = '0.4s';

    document.getElementById('btnProj').style.marginTop = '';
    document.getElementById('btnProj').style.transitionDelay = '0.4s';
    
    document.getElementById('codeBtn').style.marginTop = '';
    document.getElementById('codeBtn').style.transitionDelay = '0.6s';
    
    setTimeout(function() {
        document.getElementById('btnProj').style.transitionDelay = '0s';
    });
}