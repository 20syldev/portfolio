import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBeg4QPPuM9xghL1HwNiXEDbryyilpGmC8",
    authDomain: "api-20syl.firebaseapp.com",
    projectId: "api-20syl",
    storageBucket: "api-20syl.appspot.com",
    messagingSenderId: "18523544518",
    appId: "1:18523544518:web:3c18c082bef03cce92b0c7"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const versions = doc(db, 'sylvain', 'versions');

// Fonction pour récupérer les données
async function load() {
    const docSnap = await getDoc(versions);
    if (docSnap.exists()) {
        document.getElementById('gemsync').innerHTML = docSnap.data().gemsync;
        document.getElementById('gitsite').innerHTML = docSnap.data().gitsite;
        document.getElementById('api').innerHTML = docSnap.data().api;
        document.getElementById('database').innerHTML = docSnap.data().database;
        document.getElementById('doc-coopbot').innerHTML = docSnap.data().doc_coopbot;
        document.getElementById('coop-status').innerHTML = docSnap.data().coop_status;
        document.getElementById('nitrogen').innerHTML = docSnap.data().nitrogen;
    }
}
load();