// Charger les données de l'API
async function load() {
    const data = await fetch('https://api.sylvain.pro/latest/website').then(res => res.json());

    if (!data) return console.error('Impossible de charger les données de l\'API !');

    // Récupérer les données
    const { versions, updated_projects, new_projects, stats, notif_tag, active } = data;
    const notification = document.querySelector('.notification');
    const titles = [
        { title: 'Projets', stats: 'projects' },
        { title: 'Contributions aujourd\'hui', stats: 'today' },
        { title: 'Contributions ce mois-ci', stats: 'this_month' },
        { title: 'Contributions l\'année dernière', stats: 'last_year' }
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
                li.innerHTML = `<a onclick="window.location.href='#${project}'">${project.charAt(0).toUpperCase() + project.slice(1)}</a>`;
                section.appendChild(li);
            });
        } else section.classList.add('is-hidden');
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
            stats4.innerHTML = titles[i].stats === 'projects'
                ? stats[titles[i].stats]
                : `<a onclick="window.open('https:/\/github.com/20syldev?tab=overview&from=2025-01-01#sr-footer-heading')" style="color: var(--bg-invert)">${stats[titles[i].stats]}</a>`;
        }
        i = (i + 1) % titles.length;
    };

    // Badges NEW / UPDATED
    const changeTag = (projects, label) => {
        projects.forEach(project => {
            const badge = document.getElementById(project);
            if (badge) {
                badge.innerHTML = label;
                badge.classList.remove('is-hidden');
            }
        });
    };

    // Afficher la notification ou non
    if (active === 'true') {
        document.querySelector('.text-notif').innerHTML = notif_tag;
        setTimeout(() => notification.classList.add('slide-in'), 3000);
        setTimeout(() => notification.classList.replace('slide-in', 'slide-out'), 8000);
    } else notification.style.display = 'none';

    // Mettre à jour les badges et les statistiques
    changeTag(updated_projects, 'UPDATED');
    changeTag(new_projects, 'NEW');
    setInterval(updateStats4, 5000);
    updateStats4();
}
load();