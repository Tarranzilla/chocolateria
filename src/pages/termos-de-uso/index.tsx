import { motion as m } from "framer-motion";
import { useSimpleTranslation } from "@/international/useSimpleTranslation";

export default function Privacidade() {
    const t = useSimpleTranslation();

    return (
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="Page_Container">
            <div className="Page_Wrapper">
                <div className="terms-of-use">
                    {t.terms.paragraphs.map((paragraph, index) => (
                        <>
                            <h3>{paragraph.title}</h3>
                            {paragraph.paragraphs.map((p, i) => (
                                <p key={i + "_Paragraph"}>{p}</p>
                            ))}
                        </>
                    ))}
                </div>
            </div>
        </m.div>
    );
}
