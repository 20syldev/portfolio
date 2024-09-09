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
const stats = doc(db, 'sylvain', 'stats');

// Fonction pour récupérer les données
async function load() {
    const docSnap = await getDoc(stats);
    if (docSnap.exists()) {
        document.getElementById('stats1').innerHTML = docSnap.data().stats1;
        document.getElementById('stats2').innerHTML = docSnap.data().stats2;
        document.getElementById('stats3').innerHTML = docSnap.data().stats3;
        document.getElementById('stats4').innerHTML = docSnap.data().stats4;
    }
}
load();