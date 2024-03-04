import Image from "next/image";
import { useState, useEffect } from "react";

import { motion as m, AnimatePresence } from "framer-motion";

export default function Intro() {
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsMounted(false);
        }, 1000);

        return () => clearTimeout(timer); // This will clear the timer when the component unmounts
    }, []);

    useEffect(() => {
        if (isMounted) {
            // Add the overflow hidden rule to the body
            document.body.classList.add("body-no-scroll");
        } else {
            // Remove the overflow hidden rule from the body
            document.body.classList.remove("body-no-scroll");
        }

        // Clean up function
        return () => {
            document.body.classList.remove("body-no-scroll");
        };
    }, [isMounted]);

    return (
        <>
            <AnimatePresence mode="wait">
                {isMounted && (
                    <m.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="Intro">
                        <div className="Intro_Content">
                            <Image className="Intro_Image" src={"/brand_imgs/Icone_TC_512.png"} alt="Logo" priority width={400} height={400} />
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
}
