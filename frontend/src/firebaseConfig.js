import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAMwBOHZjfGKdm26nMFjhzOaZGyrbxaCzs",
  authDomain: "cex-platform-chat.firebaseapp.com",
  projectId: "cex-platform-chat",
  storageBucket: "cex-platform-chat.appspot.com",
  messagingSenderId: "199744879476",
  appId: "1:199744879476:web:5af587dc5cf6acb05e8a21",
  measurementId: "G-959XVG61BR"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
const analytics = getAnalytics(app);