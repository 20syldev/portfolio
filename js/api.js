// Récupérer les données depuis l'API
async function load() {
    try {
        const { versions, updated_projects, new_projects, stats, notif_tag, active } = await fetch('https://api.sylvain.pro/v1/website').then(res => res.json());

        // Afficher les informations
        ['stats1', 'stats2', 'stats3', 'stats4'].forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = stats[i];
        });

        // Afficher les projets récents / mis à jour dans le menu
        [['new-projects', new_projects], ['updated-projects', updated_projects]].forEach(([id, projects]) => {
            const sectionTitle = document.querySelector(`#${id}`).previousElementSibling;
            const section = document.getElementById(id);
        
            if (projects.length > 0) {
                projects.forEach(project => {
                    const li = document.createElement('li');
                    const formattedProject = project === 'api' ? project.toUpperCase() : project.charAt(0).toUpperCase() + project.slice(1);
                    li.innerHTML = `<a href="#${project}">${formattedProject}</a>`;
                    section.appendChild(li);
                });
                sectionTitle.style.display = '';
                section.style.display = '';
            } else {
                sectionTitle.style.display = 'none';
                section.style.display = 'none';
            }
        });

        // Afficher les versions
        Object.entries(versions).forEach(([id, value]) => {
            const el = document.getElementById(id + '-version');
            if (el) el.innerHTML = value;
        });

        // Afficher / masquer la notification
        const notif = document.getElementById('notif');
        if (notif) notif.style.display = active === 'true' ? '' : 'none';

        if (active === 'true') {
            const text = document.getElementById('text-notif');
            if (text) text.innerHTML = notif_tag;
        }

        // Gère les badges "NEW" et "UPDATED"
        const changeTag = (projects, label) => {
            projects.forEach(project => {
                const badge = document.getElementById(project);
                if (badge) {
                    badge.innerHTML = label;
                    badge.style.display = '';
                }
            });
        };

        // Nouveaux projets / récemment mis à jour
        changeTag(updated_projects, 'UPDATED');
        changeTag(new_projects, 'NEW');
    } catch (e) {
        console.error('Erreur :', e);
    }
}
load();
