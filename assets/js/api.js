let apiData = null, wait = false, lastMessages = [];

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
    else if (keywords.qui_es_tu.some(k => question.includes(k))) result = 'Moi c\'est Bep, je suis un mini chatbot créé par Sylvain.';
    else if (keywords.projets.some(k => question.includes(k))) {
        result = `Nouveaux projets : ${apiData.new_projects.map(project => 
            `<a href="https://github.com/20syldev/${project}#readme"><span class="tag is-hoverable">${project}</span></a>`
        ).join(', ')}`;
    }
    else if (keywords.mis_a_jour.some(k => question.includes(k))) {
        result = `Projets mis à jour : ${apiData.updated_projects.map(project => 
            `<a href="https://github.com/20syldev/${project}/releases/latest"><span class="tag is-hoverable">${project}</span></a>`
        ).join(', ')}`;
    }
    else if (keywords.version.some(k => question.includes(k))) {
        let found = keywords.version.find(k => question.includes(k));
        let project = question.replace(/\b(l?'|de|la|du|des|le)\b/g, '').split(found)[1]?.trim().replace(/\s.*$/, '');;
        if (project) result = apiData.versions[project] 
            ? `Projet '${project.charAt(0).toUpperCase() + project.slice(1)}' : <a href="https://github.com/20syldev/${project}/releases/latest"><span class="tag is-hoverable">${apiData.versions[project]}</span></a>`
            : `Projet '${project.charAt(0).toUpperCase() + project.slice(1)}' introuvable.`;
        else { 
            questionInput.placeholder = 'Entrez un nom de projet';
            result = 'De quel projet voulez-vous afficher la version ?';
            wait = true;
        }
    }
    else if (wait) {
        questionInput.placeholder = 'Quelle est la version de...';
        project = question.trim().replace(/\s.*$/, '');;
        result = apiData.versions[project] 
            ? `Projet '${project.charAt(0).toUpperCase() + project.slice(1)}' : <a href="https://github.com/20syldev/${project}/releases/latest"><span class="tag is-hoverable">${apiData.versions[project]}</span></a>`
            : `Projet '${project.charAt(0).toUpperCase() + project.slice(1)}' introuvable.`;
        wait = false;
    }

    // Afficher la réponse
    questionInput.value = '';
    responseElement.classList.remove('is-hidden');
    responseElement.innerHTML = result;
}

// Charger les données de l'API
async function load() {
    if (!apiData) return;

    const { versions, updated_projects, new_projects, stats, notif_tag, active } = apiData;
    const chatContainer = document.getElementById('chatContainer');
    const charCounter = document.getElementById('charCounter');
    const chatList = document.getElementById('chatList');
    const messageInput = document.getElementById('message');
    const usernameInput = document.getElementById('username');
    const maxChars = 500;
    const titles = [
        { title: "Projets", stats: "projects" },
        { title: "Contributions aujourd'hui", stats: "today" },
        { title: "Contributions ce mois-ci", stats: "this_month" },
        { title: "Contributions l'année dernière", stats: "last_year" }
    ];
    let i = 0;

    // Générer un ID de session ou récupérer celui existant
    const session = localStorage.getItem('session') || (() => {
        const id = crypto.randomUUID();
        localStorage.setItem('session', id);
        return id;
    })();

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
                badge.classList.remove('is-hidden');
            }
        });
    };

    // Afficher proprement la date
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('fr-FR', {
            hour: 'numeric',
            minute: 'numeric',
        }).format(date);
    };

    // Markdown & liens cliquables
    const transformMessage = (message) => {
        const escapeHTML = str => str.replace(/[&<>"']/g, char => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[char]));

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const markdownRegex = /\*\*(.*?)\*\*/g;
        const italicRegex = /\*(.*?)\*/g;
        const underlineRegex = /_(.*?)_/g;
        const strikethroughRegex = /~~(.*?)~~/g;

        return escapeHTML(message)
            .replace(urlRegex, url => 
                /\.(jpg|jpeg|png|gif)$/i.test(url) 
                    ? `<img src="${url}" style="max-width: 100px;">` 
                    : `<a href="${url}" target="_blank">${escapeHTML(url)}</a>`
            )
            .replace(markdownRegex, (match, p1) => `<strong>${p1}</strong>`)
            .replace(italicRegex, (match, p1) => `<em>${p1}</em>`)
            .replace(underlineRegex, (match, p1) => `<u>${p1}</u>`)
            .replace(strikethroughRegex, (match, p1) => `<del>${p1}</del>`);
    };

    // Récupérer les informations stockées
    const fetchMessages = async () => {
        const res = await fetch('https://api.sylvain.pro/v1/chat');
        const data = res.ok ? await res.json() : [];
        const previousHeight = chatList.scrollHeight;

        if (Array.isArray(data) && data.length) {
            if (JSON.stringify(data) !== JSON.stringify(lastMessages)) {
                let lastUsername = '';
                let groupedMessages = [];

                data.forEach(({ username, message, timestamp }) => {
                    const msg = transformMessage(message.replace(/\s+/g, ' ').trim());
                    if (!msg) return;
                    if (username === lastUsername) groupedMessages[groupedMessages.length - 1].messages.push(msg);
                    else groupedMessages.push({ username, messages: [msg], timestamp });
                    lastUsername = username;
                });

                chatList.innerHTML = groupedMessages.map(({ username, messages, timestamp }) => `
                    <tr>
                        <td>${username}</td>
                        <td>${messages.map(m => `<div style="margin-bottom: 2px;">${m}</div>`).join('')}</td>
                        <td class="has-text-right">${formatDate(timestamp)}</td>
                    </tr>
                `).join('');
                lastMessages = data;
            }
        } else {
            chatList.innerHTML = '<tr><td rowspan="3">Aucun message pour le moment.</td></tr>';
            lastMessages = [];
        }

        if (chatContainer.scrollHeight > previousHeight) chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    // Afficher la notification ou non
    document.querySelector('.notification').style.display = active === 'true' ? '' : 'none';
    if (active === 'true') document.querySelector('.text-notif').innerHTML = notif_tag;

    // Stocker les données dans l'API
    document.getElementById('chatForm').addEventListener('submit', async e => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const message = messageInput.value.trim();
        const usernameError = document.getElementById('usernameError');

        if (!username || !message) return;
        if (messageInput.value.length > maxChars) return;

        try {
            const response = await fetch('https://api.sylvain.pro/v1/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    message,
                    session
                }),
            });

            const result = await response.json();

            if (result.error == 'Session ID mismatch') {
                usernameInput.classList.add('input-error');
                usernameError.classList.remove('is-hidden');
            } else {
                usernameInput.readOnly = true;
                usernameInput.classList.remove('input-error');
                usernameError.classList.add('is-hidden');
                messageInput.value = '';
                charCounter.textContent = maxChars;
                fetchMessages();
            }
        } catch (error) { console.error('Erreur réseau ou serveur :', error); }
    });

    // Raccourci CTRL+Enter
    messageInput.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'Enter' && usernameInput.value) {
            e.preventDefault();
            document.getElementById('chatForm').dispatchEvent(new Event('submit'));
        }
    });

    // Limiter à 10 lignes maximum et 500 caractères
    messageInput.addEventListener('input', () => {
        const lines = messageInput.value.split('\n');
        const remaining = maxChars - messageInput.value.length;

        charCounter.textContent = `${remaining}`;
        charCounter.style.color = remaining <= 10 ? 'var(--error)' : '';

        if (lines.length > 10) messageInput.value = lines.slice(0, 10).join('\n');
    });

    // Mettre à jour les badges et les statistiques
    changeTag(updated_projects, 'UPDATED');
    changeTag(new_projects, 'NEW');
    setInterval(fetchMessages, 1000);
    setInterval(updateStats4, 5000);
    fetchMessages();
    updateStats4();
}