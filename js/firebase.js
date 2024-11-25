import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBeg4QPPuM9xghL1HwNiXEDbryyilpGmC8", // Not important, API is read only
    authDomain: "api-20syl.firebaseapp.com",
    projectId: "api-20syl",
    storageBucket: "api-20syl.appspot.com",
    messagingSenderId: "18523544518",
    appId: "1:18523544518:web:3c18c082bef03cce92b0c7"
};

// Initialiser Firebase & récupérer les données
const db = getFirestore(initializeApp(firebaseConfig));
async function load() {
    const [stats, versions, notifications] = await Promise.all([
        getDoc(doc(db, 'sylvain', 'stats')),
        getDoc(doc(db, 'sylvain', 'versions')),
        getDoc(doc(db, 'sylvain', 'notifications'))
    ]);

    if (stats.exists()) {
        const data = stats.data();
        ['stats1', 'stats2', 'stats3', 'stats4'].forEach(id => {
            document.getElementById(id).innerHTML = data[id];
        });
    }

    if (versions.exists()) {
        const data = versions.data();
        ['api', 'coop_status', 'database', 'doc_coopbot', 'gemsync', 'gitsite', 'nitrogen', 'portfolio', 'python_api', 'wrkit'].forEach(id => {
            console.log(id, data[id]);
            document.getElementById(id).innerHTML = data[id];
        });
    }

    if (notifications.exists()) {
        const data = notifications.data();
        if (data.active) {
            document.getElementById('text-notif').innerHTML = data.text;
        } else {
            document.getElementById('notif').style.display = 'none';
        }
    }
}
load();
