let userMessage = false, lastMessages = [];
let notifEnabled = localStorage.getItem('notifEnabled') === 'true';
let notifMode = localStorage.getItem('notifMode') || 'classic';
let username = localStorage.getItem('username') || '';

// Notifications de chat
const radioClassic = document.querySelector('input[name="priority"][value="classic"]');
const radioCompact = document.querySelector('input[name="priority"][value="compact"]');
const activateNotifications = document.getElementById('activateNotifications');

// Chat
const chatContainer = document.getElementById('chatContainer');
const charCounter = document.getElementById('charCounter');
const chatForm = document.getElementById('chatForm');
const chatList = document.getElementById('chatList');
const messageInput = document.getElementById('message');
const usernameInput = document.getElementById('username');
const usernameError = document.getElementById('usernameError');
const maxChars = 500;

// Générer un ID de session ou récupérer celui existant
const session = localStorage.getItem('session') || (() => {
    const id = crypto.randomUUID();
    localStorage.setItem('session', id);
    return id;
})();

// Afficher une notification de chat
const showNotification = (title, message) => {
    if (notifEnabled && Notification.permission === 'granted') {
        const options = {
            body: message,
            icon: notifMode === 'classic' ? '/assets/images/logo.png' : ''
        };
        const notif = new Notification(title, options);
        notif.onclick = () => (window.focus(), notif.close());
        setTimeout(() => notif.close(), 5000);
    }
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

            chatContainer.style.maxHeight = '300px';
            chatList.innerHTML = groupedMessages.map(({ username, messages, timestamp }) => `
                <tr>
                    <td>${username}</td>
                    <td>${messages.map(m => `<div style="margin-bottom: 2px;">${m}</div>`).join('')}</td>
                    <td class="has-text-right">${formatDate(timestamp)}</td>
                </tr>
            `).join('');

            if (lastMessages.length < data.length && !userMessage && lastMessages.length > 0) {
                const { username, message } = data[data.length - 1];
                const titles = [
                    `${username} vient d'envoyer un message`,
                    `${username} a envoyé un message`,
                    `Nouveau message de ${username}`,
                ];
                if (username !== usernameInput.value) {
                    showNotification(titles[Math.floor(Math.random() * titles.length)], message);
                }
            }

            lastMessages = data;
        }
    } else {
        chatContainer.style.height = '40px';
        chatList.innerHTML = '<tr><td rowspan="3">Aucun message pour le moment.</td></tr>';
        lastMessages = [];
    }

    if (chatContainer.scrollHeight > previousHeight) chatContainer.scrollTop = chatContainer.scrollHeight;
};

// Demander la permission pour les notifications
activateNotifications.addEventListener('change', async () => {
    if (activateNotifications.checked) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') notifEnabled = true;
        else {
            activateNotifications.checked = false;
            notifEnabled = false;
        }
    } else notifEnabled = false;
    localStorage.setItem('notifEnabled', notifEnabled);
});

// Stocker les données dans l'API
chatForm.addEventListener('submit', async e => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();

    if (!username || !message) return;
    if (messageInput.value.length > maxChars) return;

    try {
        userMessage = true;
        const res = await fetch('https://api.sylvain.pro/v1/chat', {
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
        const result = await res.json();

        if (result.error == 'Session ID mismatch') {
            localStorage.setItem('username', null);
            usernameInput.classList.add('input-error');
            usernameError.classList.remove('is-hidden');
        } else {
            localStorage.setItem('username', username);
            usernameInput.readOnly = true;
            usernameInput.classList.remove('input-error');
            usernameError.classList.add('is-hidden');
            messageInput.value = '';
            charCounter.textContent = maxChars;
            fetchMessages();
        }
    } catch (error) { console.error('Erreur réseau ou serveur :', error);
    } finally { userMessage = false; }
});

// Raccourci CTRL+Enter
messageInput.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter' && usernameInput.value) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
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

const checkInputs = () => {
    switchChat.innerHTML = `<i class="fa-solid fa-${chatMode === 'private' ? 'earth-americas' : 'lock'} mr-2"></i>${chatMode === 'private' ? 'Chat global' : 'Chats privés'}`;
    [tokenTitle, tokenInput, resetToken, connectPrivate, tokenError, tokenSuccess].forEach(el => el.classList.toggle('is-hidden', chatMode !== 'private'));
};

// Switch between global & private chat
switchChat.addEventListener('click', () => {
    chatMode = chatMode === 'private' ? 'global' : 'private';
    localStorage.setItem('chatMode', chatMode);
    checkInputs();
    fetchMessages();
});

// Changer le mode de notification pour classique
radioClassic.addEventListener('change', () => {
    if (radioClassic.checked) {
        notifMode = 'classic';
        localStorage.setItem('notifMode', 'classic');
    }
});

// Changer le mode de notification pour compact
radioCompact.addEventListener('change', () => {
    if (radioCompact.checked) {
        notifMode = 'compact';
        localStorage.setItem('notifMode', 'compact');
    }
});

// Cocher ou non au chargement
activateNotifications.checked = notifEnabled;

if (tokenInput && resetToken && connectPrivate) {
    // Regenerate a new token
    resetToken.addEventListener('click', () => {
        tokenInput.value = crypto.randomUUID();
        tokenInput.type = 'text';
        tokenInput.classList.remove('input-success');
        tokenInput.classList.add('input-error');
        tokenSuccess.classList.add('is-hidden');
        tokenError.classList.remove('is-hidden');
        tokenError.textContent = 'Copiez cette clé mainenant ! Elle ne sera plus visible après la connexion !';
    });

    // Connect to private chat
    connectPrivate.addEventListener('click', () => {
        if (tokenInput.value) token = tokenInput.value;
        tokenError.classList.add('is-hidden');
        fetchMessages();
    });
}

// If session active, display name in input & activate readonly
if (username) usernameInput.value = username, usernameInput.readOnly = true;

// Sélectionner le mode de notification au chargement
if (notifMode === 'compact') radioCompact.checked = true;
else radioClassic.checked = true;

// Mettre à jour le chat
setInterval(fetchMessages, 1000);
fetchMessages();
checkInputs();