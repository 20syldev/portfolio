let apiData = null, wait = false;

// Récupérer les données de l'API
async function fetchData() {
    try {
        apiData = await fetch('https://api.sylvain.pro/v1/website').then(res => res.json());
        load();
    } catch (e) { console.error('Erreur:', e); }
}
fetchData();

// Gestion des questions
function handleQuestion() {
    // Normaliser le texte
    const normalizeText = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['’]/g, '');

    // Récupérer les éléments et normaliser la question
    const questionInput = document.getElementById('question');
    const responseElement = document.getElementById('response');
    const question = normalizeText(questionInput.value.toLowerCase());

    // Réponse par défaut
    let result = 'Désolé, je n\'ai pas compris.';

    if (!apiData) return responseElement.textContent = 'Impossible de charger les données de l\'API.';

    // Mots-clés
    const keywords = {
        version: ['versions', 'version', 'verssion', 'verison', 'ver', 'projets', 'projet'],
        projets: ['nouveaux projets', 'novueaux projets', 'recent', 'recents', 'projets recents', 'derniers projets', 'new', 'new projects'],
        mis_a_jour: ['mis a jour', 'mise a jour', 'maj', 'projets mis a jour', 'update', 'updated', 'updated projects'],
        salut: ['salut', 'hey', 'yo', 'bonjour'],
        fais_quoi: ['tu fais quoi', 'tu es quoi', 'que fais-tu', 'que fais-tu ?', 'tu sers a quoi'],
        qui_es_tu: ['qui es-tu', 'qui es tu ?', 'qui est-ce ?', 'qui es ce ?', 'qui est tu', 'tu es qui'],
    };

    // Réponses
    if (keywords.salut.some(k => question.includes(k))) result = 'Salut !';
    else if (keywords.fais_quoi.some(k => question.includes(k))) result = 'Je suis un assistant pour vous aider à obtenir des informations sur les projets de Sylvain.';
    else if (keywords.qui_es_tu.some(k => question.includes(k))) result = 'Je suis une intelligence artificielle pour vous aider à obtenir des informations sur les projets de Sylvain.';
    else if (keywords.version.some(k => question.includes(k))) {
        let found = keywords.version.find(k => question.includes(k));
        let project = question.replace(/\b(l?'|de|la|du|des|le)\b/g, '').split(found)[1]?.trim();
        if (project) result = apiData.versions[project] ? `Projet '${project}' : <span class="tag is-hoverable">${apiData.versions[project]}</span>` : `Projet '${project.charAt(0).toUpperCase() + project.slice(1)}' introuvable.`;
        else { 
            questionInput.placeholder = 'Entrez un nom de projet';
            result = 'De quel projet voulez-vous afficher la version ?';
            wait = true;
        }
    }
    else if (keywords.projets.some(k => question.includes(k))) result = `Projets récents : '${apiData.new_projects.join('\', \'')}'.`;
    else if (keywords.mis_a_jour.some(k => question.includes(k))) result = `Projets mis à jour : '${apiData.updated_projects.join('\', \'')}'.`;
    else if (wait) {
        questionInput.placeholder = 'Quelle est la version de...';
        project = question.trim();
        result = apiData.versions[project] ? `Projet '${project.charAt(0).toUpperCase() + project.slice(1)}' : <span class="tag is-hoverable">${apiData.versions[project]}</span>` : `Projet '${project}' introuvable.`;
        wait = false;
    }

    // Afficher la réponse
    questionInput.value = '';
    responseElement.style.display = 'block';
    responseElement.innerHTML = result;
}

// Charger les données de l'API
function load() {
    if (!apiData) return;

    const { versions, updated_projects, new_projects, stats, notif_tag, active } = apiData;
    const titles = [
        { title: "Projets", stats: "projects" },
        { title: "Contributions aujourd'hui", stats: "today" },
        { title: "Contributions ce mois-ci", stats: "this_month" },
        { title: "Contributions l'année dernière", stats: "last_year" }
    ];
    let i = 0;
    
    // Afficher les versions
    Object.entries(versions).forEach(([id, value]) => {
        const el = document.getElementById(id + '-version');
        if (el) el.innerHTML = value;
    });

    // Afficher les projets récents / mis à jour dans le menu
    [['new-projects', new_projects], ['updated-projects', updated_projects]].forEach(([id, projects]) => {
        const section = document.getElementById(id);
        if (projects.length) {
            projects.forEach(project => {
                const li = document.createElement('li');
                li.innerHTML = `<a href='#${project}'>${project.charAt(0).toUpperCase() + project.slice(1)}</a>`;
                section.appendChild(li);
            });
        } else section.style.display = 'none';
    });

    // Afficher les informations
    ['stats1', 'stats2', 'stats3'].forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = stats[Object.keys(stats)[i]];
    });

    // Statistiques n°4 (dynamique)
    const updateStats4 = () => {
        const title = document.getElementById('stats4Title');
        const stats4 = document.getElementById('stats4');

        if (stats4 && title) {
            title.innerHTML = titles[i].title;
            stats4.innerHTML = stats[titles[i].stats];
        }
        i = (i + 1) % titles.length;
    };

    // Badges NEW / UPDATED
    const changeTag = (projects, label) => {
        projects.forEach(project => {
            const badge = document.getElementById(project);
            if (badge) {
                badge.innerHTML = label;
                badge.style.display = '';
            }
        });
    };

    // Afficher la notification ou non
    document.getElementById('notif').style.display = active === 'true' ? '' : 'none';
    if (active === 'true') document.getElementById('text-notif').innerHTML = notif_tag;

    // Mettre à jour les badges et les statistiques
    changeTag(updated_projects, 'UPDATED');
    changeTag(new_projects, 'NEW');
    setInterval(updateStats4, 5000);
    updateStats4();
}