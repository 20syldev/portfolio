// Charger les données de l'API
async function load() {
    const data = await fetch('https://api.sylvain.pro/latest/website').then(res => res.json());

    if (!data) return console.error('Impossible de charger les données de l\'API !');

    // Récupérer les données
    const { versions, patched_projects, updated_projects, new_projects, stats, notif_tag, active } = data;
    const notification = document.querySelector('.notification');
    const menuList = document.getElementById('menu-list');
    const titles = [
        { title: 'Heures de code', stats: '4' },
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

    // Afficher les informations
    Object.keys(stats).slice(0, 3).forEach((key, i) => {
        const el = document.getElementById(`stats${i + 1}`);
        if (el) el.innerHTML = stats[key];
    });

    // Afficher les projets récents / mis à jour dans le menu
    [['new', new_projects],
    ['patched', patched_projects],
    ['updated', updated_projects]].forEach(([id, projects]) => {
        const filtered = projects.filter(p => p && p !== 'undefined')
        const section = document.getElementById(id + '-projects');
        const wrapper = document.getElementById(id)
        if (filtered.length) {
            filtered.forEach(project => {
                const li = document.createElement('li')
                li.innerHTML = `<a onclick="window.location.href='#${project}'">${project.charAt(0).toUpperCase() + project.slice(1)}</a>`
                section.appendChild(li)
            })
        }
        else if (!filtered.length) document.getElementById(id).style.display = 'none';
        else wrapper.style.display = 'none';
    });

    // Statistiques n°4 (dynamique)
    const updateStats4 = () => {
        const title = document.getElementById('stats4Title');
        const stats4 = document.getElementById('stats4');

        if (stats4 && title) {
            title.innerHTML = titles[i].title;
            stats4.innerHTML = titles[i].stats === 'projects'
                ? `<a onclick="window.location.href='#projets'" style="color: var(--bg-invert)">${stats[titles[i].stats]}</a>`
                : `<a onclick="window.open('https:/\/github.com/20syldev')" style="color: var(--bg-invert)">${stats[titles[i].stats]}</a>`;
        }
        i = (i + 1) % titles.length;
    };

    // Badges PATCH / NEW / UPDATE
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
    changeTag(updated_projects, 'UPDATE');
    changeTag(patched_projects, 'PATCH');
    changeTag(new_projects, 'NEW');
    setInterval(updateStats4, 5000);
    updateStats4();
}
load();