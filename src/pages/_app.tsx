import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";

import { Provider } from "react-redux";
import { store } from "@/store/store";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Intro from "@/components/Intro";
import Cookies from "@/components/Cookies";
import Navbar from "@/components/Navbar";
import Cart from "@/components/Cart";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Analytics />
            <SpeedInsights />

            <Provider store={store}>
                <Intro />
                <Cookies />
                <Navbar />
                <Cart />
                <AnimatePresence mode="wait">
                    <Component {...pageProps} />
                </AnimatePresence>
                <Footer />
            </Provider>
        </>
    );
}
