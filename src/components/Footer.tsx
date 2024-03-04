import Link from "next/link";

import { useRouter } from "next/router";

import { useSimpleTranslation } from "@/international/useSimpleTranslation";

export default function Footer() {
    const router = useRouter();
    const message = "Olá, eu gostaria de agendar uma consulta.";
    const t = useSimpleTranslation();

    function toUrlValidString(str: string) {
        return encodeURIComponent(str);
    }

    const changeLanguage = () => {
        const currentLocale = router.locale;
        const newLocale = currentLocale === "en" ? "pt-BR" : "en";
        const currentPath = router.asPath;
        router.push(currentPath, currentPath, { locale: newLocale });
    };

    return (
        <div className="Footer">
            <div className="Footer_Content">
                <div className="Footer_Actions Desktop_Only">
                    <div className="Footer_Btn Privacy_Btn" title={t.footer.privacyBtn.label}>
                        <Link href={"/privacidade"}>
                            <span className="Footer_Icon material-icons">verified_user</span>
                        </Link>
                    </div>
                    <div className="Footer_Btn Terms_Btn" title={t.footer.termsBtn.label}>
                        <Link href="/termos-de-uso">
                            <span className="Footer_Icon material-icons">sticky_note_2</span>
                        </Link>
                    </div>
                    <div className="Footer_Btn Lang_Btn" title={t.footer.langBtn?.label} onClick={changeLanguage}>
                        <span className="Footer_Icon material-icons">language</span>
                    </div>
                </div>

                <p className="Desktop_Only">© 2024 Tropical Cacau</p>

                <div className="Footer_Actions">
                    <div className="Footer_Btn Quote_Btn" title={t.footer.scheduleBtn.label}>
                        <Link href={`https://wa.me/1234567890?text=${toUrlValidString(message)}`} target="_blank" rel="noopener noreferrer">
                            <span className="Footer_Icon material-icons">shopping_cart</span>
                        </Link>
                    </div>
                    <div className="Footer_Btn Phone_Btn" title={t.footer.telephoneBtn.label}>
                        <Link href="tel:+1234567890">
                            <span className="Footer_Icon material-icons">phone</span>
                        </Link>
                    </div>
                    <div className="Footer_Btn Email_Btn" title={t.footer.emailBtn.label}>
                        <Link href="mailto:example@example.com">
                            <span className="Footer_Icon material-icons">email</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
