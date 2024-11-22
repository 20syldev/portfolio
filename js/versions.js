// Récupérer les versions de mes projets
fetch('https://api.sylvain.pro/v1/versions')
.then(response => response.json())
.then(data => {
    document.getElementById('api').innerHTML = data.api;
    document.getElementById('coop-status').innerHTML = data.coop_status;
    document.getElementById('database').innerHTML = data.database;
    document.getElementById('doc-coopbot').innerHTML = data.doc_coopbot;
    document.getElementById('gemsync').innerHTML = data.gemsync;
    document.getElementById('gitsite').innerHTML = data.gitsite;
    document.getElementById('nitrogen').innerHTML = data.nitrogen;
    document.getElementById('portfolio').innerHTML = data.portfolio;
    document.getElementById('wrkit').innerHTML = data.wrkit;
});