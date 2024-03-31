// Afficher ou non le texte italique
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('italique') !== 'true') {
      document.getElementById('info').style.visibility = 'visible';
    }

    // Pourcentage entre 2 dates
    var start = new Date(2023, 8, 1);
    var end = new Date(2024, 5, 31, 23, 59, 59);
    var today = new Date();

    if (today < start) {
        document.getElementById('pourcentage').innerHTML = "0%";
    
    } 
    if (today > end) {
        document.getElementById('pourcentage').innerHTML = "100%";  
    } 
    else {
        var startEnd = end - start;
        var startToday = today - start;
        var pourcent = Math.round((startToday / startEnd) * 100);
        document.getElementById('pourcentage').innerHTML = pourcent + "%";
    }
});

// Fait un zoom de texte
function big(event) {
    event.target.style.fontSize = '1.8em';
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
    document.getElementById('txtChange' + text).style.fontSize = '1.25em';
    document.getElementById('txtChange' + text).style.paddingLeft = '5px';
    document.getElementById('txtChange' + text).style.paddingRight = '5px';
    document.getElementById('txtChange' + text).style.transition = '0.5s';

    document.getElementById('headerTxt' + text).style.opacity = '1';
    document.getElementById('headerTxt' + text).style.transition = '0.5s';
    
    document.getElementById('info').style.visibility = 'hidden';

    document.getElementById('btnProj').style.marginTop = '6em';
    document.getElementById('btnProj').style.transition = '0.5s';

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

    document.getElementById('btnProj').style.marginTop = '2em';
    document.getElementById('btnProj').style.transitionDelay = '0.4s';
    
    setTimeout(function() {
        document.getElementById('btnProj').style.transitionDelay = '0s';
    });
}

// Astérisque quand on passe la souris sur un mot
function showAstTxt(text) {
    document.getElementById('charAst').style.textDecoration = 'none';
    document.getElementById('charAst').style.fontSize = '1.25em';
    document.getElementById('charAst').style.paddingRight = '1vw';
    document.getElementById('charAst').style.transition = '0.5s';

    document.getElementById('ast' + text).style.textDecoration = 'underline';
    document.getElementById('ast' + text).style.fontSize = '1.25em';
    document.getElementById('ast' + text).style.paddingLeft = '0.5vw';
    document.getElementById('ast' + text).style.transition = '0.5s';

    document.getElementById('infoAst' + text).style.opacity = '1';
    document.getElementById('infoAst' + text).style.transition = '0.5s';
}

// Reset l'affichage de l'astérisque
function normalAstTxt(text) {
    document.getElementById('charAst').style.textDecoration = 'none';
    document.getElementById('charAst').style.fontSize = '1em';
    document.getElementById('charAst').style.transition = '0.5s';

    document.getElementById('ast' + text).style.textDecoration = 'none';
    document.getElementById('ast' + text).style.fontSize = '1em';
    document.getElementById('ast' + text).style.padding = '0';
    document.getElementById('ast' + text).style.transition = '0.5s';

    document.getElementById('infoAst' + text).style.opacity = '0';
    document.getElementById('infoAst' + text).style.transition = '0.5s';
}