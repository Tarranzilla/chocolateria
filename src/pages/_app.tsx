import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Intro from "@/components/Intro";
import Cookies from "@/components/Cookies";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Firebase from "@/components/Firebase";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Analytics />
            <SpeedInsights />

            <Intro />
            <Cookies />
            <Navbar />
            <AnimatePresence mode="wait">
                <Component {...pageProps} />
            </AnimatePresence>
            <Footer />
        </>
    );
}
