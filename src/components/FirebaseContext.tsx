import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { ReactNode } from "react";

import {
    initializeAuth,
    browserSessionPersistence,
    Auth,
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, collection, query, where, doc, getDocs, addDoc, Firestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeiia7aGI9U1c-IYIUEgaIlh2fvXyIJ8g",
    authDomain: "pragmatas-dev.firebaseapp.com",
    projectId: "pragmatas-dev",
    storageBucket: "pragmatas-dev.appspot.com",
    messagingSenderId: "378425065259",
    appId: "1:378425065259:web:9b729d86bae46f5cdf0f6e",
    measurementId: "G-1RVSKZH43N",
};

interface FirebaseProviderProps {
    children: ReactNode;
}

interface FirebaseContextValue {
    auth: Auth;
    firestore: Firestore;
    storage: FirebaseStorage;
}

// Create a context for Firebase
const FirebaseContext = createContext<FirebaseContextValue | null>(null);

// Create a provider for Firebase
export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
    const [firebaseInitialized, setFirebaseInitialized] = useState(false);

    useEffect(() => {
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const db = getFirestore(app);
        const auth = getAuth(app);
        const storage = getStorage(app);

        console.log("Firebase App =>", app);
        console.log("Firebase Analytics =>", analytics);
        console.log("Firebase Firestore =>", db);
        console.log("Firebase Auth =>", auth);
        console.log("Firebase Storage =>", storage);

        setFirebaseInitialized(true);
    }, []);

    if (!firebaseInitialized) {
        return <div>Loading...</div>; // or your custom loading UI
    }

    return <FirebaseContext.Provider value={}>{children}</FirebaseContext.Provider>;
};

// Create a hook to use Firebase
export const useFirebase = () => {
    return useContext(FirebaseContext);
};
