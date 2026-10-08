import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";
import { browserLocalPersistence, getAuth, indexedDBLocalPersistence, initializeAuth } from "firebase/auth";
import { Capacitor } from "@capacitor/core";

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
// in de ios/android app werkt getAuth niet goed in de webview dus daar zelf de persistence kiezen
// https://firebase.google.com/docs/auth/web/custom-dependencies
const auth = Capacitor.isNativePlatform()
  ? initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence] })
  : getAuth(app);

// analytics werkt alleen in een gewone browser
let analytics: Analytics | null = null;
isSupported().then((supported) => {
  if (supported) analytics = getAnalytics(app);
});

export { analytics, app, auth };
