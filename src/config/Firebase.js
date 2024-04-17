import {initializeApp} from 'firebase/app';
import {initializeAuth, getReactNativePersistence} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCCqy6NVlEf0UAcAjcJci8-3wGg3H6GT6Q',
  authDomain: 'netflix-64e48.firebaseapp.com',
  projectId: 'netflix-64e48',
  storageBucket: 'netflix-64e48.appspot.com',
  messagingSenderId: '24728740444',
  appId: '1:24728740444:web:3b6d4f8563ab379db47c99',
  measurementId: 'G-5560W0GSLV',
};

export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default db;
