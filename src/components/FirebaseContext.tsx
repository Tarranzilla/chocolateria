import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Auth, getAuth, onAuthStateChanged } from "firebase/auth";
import { Firestore, getFirestore, doc, setDoc, getDoc, getDocs, DocumentData, Timestamp, collection, query, where } from "firebase/firestore";

import { initMercadoPago } from "@mercadopago/sdk-react";

import { setUserIsAdmin } from "@/store/slices/user";
import { useDispatch } from "react-redux";

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
    auth: Auth | null;
    firestore: Firestore | null;
    storage: FirebaseStorage | null;
}

// Create a context for Firebase
const FirebaseContext = createContext<FirebaseContextValue | null>(null);

// Create a provider for Firebase
export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
    const dispatch = useDispatch();

    const [firebaseInitialized, setFirebaseInitialized] = useState(false);

    const [auth, setAuth] = useState<Auth | null>(null);
    const [firestore, setFirestore] = useState<Firestore | null>(null);
    const [storage, setStorage] = useState<FirebaseStorage | null>(null);

    // Fetch the user's document from Firestore when the user logs in
    const fetchUserDoc = async (uid: string) => {
        const db = getFirestore();
        const projectUID = "WIlxTvYLd20rFopeFTZT"; // Replace with your project's UID
        const userDocRef = doc(db, `projects/${projectUID}/users`, uid);

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            console.log("User document data:", userDoc.data());

            if (userDoc.data().isAdmin === true) {
                console.log("User is an admin");
                setUserIsAdminAction(true);
            } else {
                console.log("User is not an admin");
                setUserIsAdminAction(false);
            }
        } else {
            setUserIsAdminAction(false);
        }
    };

    const setUserIsAdminAction = (isAdmin: boolean) => {
        dispatch(setUserIsAdmin(isAdmin));
    };

    useEffect(() => {
        initMercadoPago(`${process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY}`);

        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const db = getFirestore(app);
        const auth = getAuth(app);
        const storage = getStorage(app);

        setAuth(getAuth(app));

        onAuthStateChanged(auth, (user) => {
            console.log("Auth state changed");
            if (user) {
                // User is signed in
                console.log("User signed in: ", user);
                fetchUserDoc(user.uid);
            } else {
                // User is signed out
                console.log("User signed out");
                setUserIsAdminAction(false);
            }
        });

        setFirestore(getFirestore(app));
        setStorage(getStorage(app));

        console.log("Firebase App =>", app);
        console.log("Firebase Analytics =>", analytics);
        console.log("Firebase Firestore =>", db);
        console.log("Firebase Auth =>", auth);
        console.log("Firebase Storage =>", storage);

        setFirebaseInitialized(true);
    }, []);

    if (!firebaseInitialized) {
        return <div>Carregando Firebase...</div>; // or your custom loading UI
    }

    return <FirebaseContext.Provider value={{ auth, firestore, storage }}>{children}</FirebaseContext.Provider>;
};

// Create a hook to use Firebase
export const useFirebase = () => {
    return useContext(FirebaseContext);
};
