import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";

import { Provider } from "react-redux";
import { store } from "@/store/store";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { FirebaseProvider } from "@/components/FirebaseContext";

import Intro from "@/components/Intro";
import Cookies from "@/components/Cookies";
import Navbar from "@/components/Navbar";
import Cart from "@/components/Cart";
import Footer from "@/components/Footer";
import UserTab from "@/components/UserTab";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    initializeAuth,
    browserSessionPersistence,
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, collection, query, where, doc, getDocs, addDoc, Firestore } from "firebase/firestore";
import { useEffect } from "react";

import productList from "@/content_lists/product_list";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDeiia7aGI9U1c-IYIUEgaIlh2fvXyIJ8g",
    authDomain: "pragmatas-dev.firebaseapp.com",
    projectId: "pragmatas-dev",
    storageBucket: "pragmatas-dev.appspot.com",
    messagingSenderId: "378425065259",
    appId: "1:378425065259:web:9b729d86bae46f5cdf0f6e",
    measurementId: "G-1RVSKZH43N",
};

async function getProject(db: Firestore) {
    const request = collection(db, "projects");
    const projects = await getDocs(request);

    projects.forEach(async (doc) => {
        console.log(doc.id, " => ", doc.data());
        console.log("doc ref =>", doc.ref);

        const docId = doc.id;
        const docData = doc.data();
        const docRef = doc.ref;

        // Fetch 'products' subcollection for each project
        const productsCollection = collection(docRef, "products");
        const productsSnapshot = await getDocs(productsCollection);
        const products = productsSnapshot.docs.map((doc) => doc.data());

        console.log("Products =>", products);

        return {
            id: docId,
            data: docData,
            ref: docRef,
            products: products,
        };
    });
}

async function addProduct(db: Firestore, projectId: string, product: any) {
    // Get a reference to the 'products' collection inside the project document
    const productsCollection = collection(db, "projects", projectId, "products");

    // Create a query against the collection.
    const q = query(productsCollection, where("title", "==", product.title));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        // Add a new document to the 'products' collection
        const docRef = await addDoc(productsCollection, product);
        console.log("Product added with ID:", docRef.id);
    } else {
        console.log("Product already exists");
    }
}

function OverflowController() {
    const isMenuOpen = useSelector((state: RootState) => state.interface.isMenuOpen);
    const isUserTabOpen = useSelector((state: RootState) => state.interface.isUserTabOpen);
    const isCartOpen = useSelector((state: RootState) => state.interface.isCartOpen);

    useEffect(() => {
        if (isMenuOpen || isUserTabOpen || isCartOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isMenuOpen, isUserTabOpen, isCartOpen]);

    return null;
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Analytics />
            <SpeedInsights />
            <Provider store={store}>
                <FirebaseProvider>
                    {/* <OverflowController /> */}
                    <Intro />
                    <Cookies />
                    <Navbar />
                    <UserTab />
                    <Cart />
                    <AnimatePresence mode="wait">
                        <Component {...pageProps} />
                    </AnimatePresence>
                    <Footer />
                </FirebaseProvider>
            </Provider>
        </>
    );
}
