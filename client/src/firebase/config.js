// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAXsDC1n_W5B57q2nqdDR33gt9KKkWM8dw",
    authDomain: "local-18b0f.firebaseapp.com",
    projectId: "local-18b0f",
    storageBucket: "local-18b0f.appspot.com",
    messagingSenderId: "14549400617",
    appId: "1:14549400617:web:35a1113550569dca567038"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();


