import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyA_zynKTdlwRD8E0WkxwzmGS19luxrlbjY",
    authDomain: "whsassassin2021.firebaseapp.com",
    databaseURL: "https://whsassassin2021-default-rtdb.firebaseio.com",
    projectId: "whsassassin2021",
    storageBucket: "whsassassin2021.appspot.com",
    messagingSenderId: "962420682296",
    appId: "1:962420682296:web:d29cef56b5e489cc78c0cd"
};
firebase.initializeApp(config);
firebase.firestore().clearPersistence();
export default firebase;