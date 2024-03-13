import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA__EnhkkcTmnn3Y6eTWuTShUgSlTc57Ds",
    authDomain: "tropical-cacau.firebaseapp.com",
    projectId: "tropical-cacau",
    storageBucket: "tropical-cacau.appspot.com",
    messagingSenderId: "1049790770687",
    appId: "1:1049790770687:web:47bd87c53fb803577ecbca",
    measurementId: "G-ZVRJC06FES",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default function Firebase() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    useEffect(() => {
        import("firebase/analytics").then((analyticsModule) => {
            setAnalytics(analyticsModule.getAnalytics(app));
        });
    }, []);

    return null;
}
