import Link from "next/link";
import { useState } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useSimpleTranslation } from "@/international/useSimpleTranslation";

export default function Cookies() {
    const [cookie, setCookie] = useState(false);
    const router = useRouter();

    const currentLocale = router.locale;
    const t = useSimpleTranslation();

    // Don't show the cookie banner on /privacidade and /termos-de-uso
    const shouldShowCookieBanner = !cookie && !["/privacidade", "/termos-de-uso"].includes(router.pathname);
    return (
        <AnimatePresence mode="wait">
            {shouldShowCookieBanner && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    key={"cookies-banner"}
                    className="Cookie"
                >
                    <div className="Cookie_Container">
                        {currentLocale === "en" && (
                            <>
                                <h1 className="Cookie_Title">Cookies</h1>
                                <p className="Cookie_Text">This website use cookies to guarantee that you get the best experience.</p>
                                <p className="Cookie_Text">
                                    By continuing to use this site, you agree to our <Link href="/privacidade">privacy policy</Link> and with our{" "}
                                    <Link href="/termos-de-uso">terms of use</Link>.
                                </p>
                            </>
                        )}

                        {currentLocale === "pt-BR" && (
                            <>
                                <h1 className="Cookie_Title">Cookies</h1>
                                <p className="Cookie_Text">Nós usamos cookies para melhorar a sua experiência no nosso site.</p>
                                <p className="Cookie_Text">
                                    Ao continuar a navegar, você concorda com a nossa <Link href="/privacidade">política de privacidade</Link> e com
                                    nossos <Link href="/termos-de-uso">termos de uso</Link>.
                                </p>
                            </>
                        )}
                        <button
                            className="Cookie_Btn"
                            onClick={() => {
                                setCookie(true);
                                localStorage.setItem("cookie", "true");
                            }}
                        >
                            {t.cookies.btnText}
                        </button>
                    </div>
                </m.div>
            )}
        </AnimatePresence>
    );
}
