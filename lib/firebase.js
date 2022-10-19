import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; 
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAiwv_eT4LkcCmBnhE0vECVURDLfAnAzDg",
    authDomain: "sistem-pakar-hp.firebaseapp.com",
    projectId: "sistem-pakar-hp",
    storageBucket: "sistem-pakar-hp.appspot.com",
    messagingSenderId: "898440025217",
    appId: "1:898440025217:web:02bd81004eb9ff1afbe980"
};

// Initialize Firebase
let app
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app()
}

const auth = firebase.auth();
const db = getFirestore(app);

export { auth, db }