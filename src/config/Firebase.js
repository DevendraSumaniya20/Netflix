// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCCqy6NVlEf0UAcAjcJci8-3wGg3H6GT6Q',
  authDomain: 'netflix-64e48.firebaseapp.com',
  projectId: 'netflix-64e48',
  storageBucket: 'netflix-64e48.appspot.com',
  messagingSenderId: '24728740444',
  appId: '1:24728740444:web:3b6d4f8563ab379db47c99',
  measurementId: 'G-5560W0GSLV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
