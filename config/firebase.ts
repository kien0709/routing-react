import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNQ3Tl1A6GbSuam147WclXqBgeVhi26ro",
  authDomain: "react-a214f.firebaseapp.com",
  projectId: "react-a214f",
  storageBucket: "react-a214f.firebasestorage.app",
  messagingSenderId: "779399248724",
  appId: "1:779399248724:web:1899a59412cde78c8ae6c1",
  measurementId: "G-XMYX2P70NW",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { analytics, app, auth };
