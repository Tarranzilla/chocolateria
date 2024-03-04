import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

import expertiseList from "@/content_lists/expertise_list";
import expertiseList_EN from "@/content_lists/english/expertise_list_en";

import { useSimpleTranslation } from "@/international/useSimpleTranslation";

import { GetStaticPathsContext } from "next";

import { motion as m, AnimatePresence } from "framer-motion";

import { Expertise } from "@/types/Expertise";

export async function getStaticPaths() {
    const paths: { params: { expertiseKey: string }; locale: string }[] = [];

    // Add Portuguese paths
    expertiseList.forEach((expertise) => {
        paths.push({ params: { expertiseKey: expertise.key }, locale: "pt-BR" });
    });

    // Add English paths
    expertiseList_EN.forEach((expertise) => {
        paths.push({ params: { expertiseKey: expertise.key }, locale: "en" });
    });

    return {
        paths,
        fallback: true,
    };
}

export async function getStaticProps({ params, locale }: { params: { expertiseKey: string }; locale: string }) {
    console.log(`getStaticProps called for locale: ${locale}, expertiseKey: ${params.expertiseKey}`);

    // Log the params and locale
    console.log("params:", params);
    console.log("locale:", locale);

    // Get the data for this page based on params
    const expertiseKey = params.expertiseKey;
    const list = locale === "pt-BR" ? expertiseList : expertiseList_EN;
    console.log("expertiseKey:", expertiseKey);

    //tests

    // Log the expertise lists
    console.log("expertiseList:", expertiseList);
    console.log("expertiseList_EN:", expertiseList_EN);

    const expertise = list.find((expertise) => expertise.key === expertiseKey);

    // Log the expertise
    console.log("expertise:", expertise);

    if (!expertise) {
        console.log("expertise not found");
        return {
            notFound: true,
        };
    }

    return {
        props: {
            expertise,
        },
    };
}

export default function ExpertiseDetail({ expertise }: { expertise: Expertise }) {
    const router = useRouter();
    const t = useSimpleTranslation();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    console.log("expertise client:", expertise);
    const message = "Olá, eu gostaria de agendar uma consulta relacionada a " + expertise.title + ".";

    function toUrlValidString(str: string) {
        return encodeURIComponent(str);
    }

    // Render the expertise details
    return (
        <>
            <Head>
                <title>{"Stresser & Machado | " + expertise.title}</title>
                <meta name="description" content={expertise.metadescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} key={expertise.key}>
                <main className="Page_Wrapper Expertise_Page_Wrapper">
                    <h1 className="Expertise_Page_Title">{expertise.title}</h1>
                    <p className="Expertise_Page_Description">{expertise.description}</p>

                    {expertise.subitems && (
                        <div className="Expertise_SubItems_List">
                            {expertise.subitems.map((subitem, index) => (
                                <div className="Expertise_SubItem" key={index}>
                                    <h3 className="SubItem_Title">{subitem.title}</h3>
                                    <p className="SubItem_Description">{subitem.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="Expertise_Page_Footer">
                        <Link className="Schedule_Btn" href={"/#areas-de-atuacao"}>
                            <span className="material-icons">keyboard_return</span>
                            {t.common.returnToAreasOfExpertise}
                        </Link>

                        <Link
                            className="Schedule_Btn"
                            href={`https://wa.me/1234567890?text=${toUrlValidString(message)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t.common.customScheduleText}
                            <span className="material-icons">event_available</span>
                        </Link>
                    </div>
                </main>
            </m.div>
        </>
    );
}
