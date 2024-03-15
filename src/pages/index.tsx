import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import ImageSlider from "@/components/ImageSlider";
import CardGrid from "@/components/cardGrid";
import GroupSlider from "@/components/groupSlider";

import { motion as m } from "framer-motion";

import { useSimpleTranslation } from "@/international/useSimpleTranslation";

export default function Home() {
    const t = useSimpleTranslation();

    return (
        <>
            <Head>
                <title>{t.common.customTitle}</title>
                <meta name="description" content={t.common.customDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <meta property="og:title" content={t.common.customTitle} />
                <meta property="og:description" content={t.common.customDescription} />
                <meta property="og:image" content="https://chocolateria.vercel.app/brand_imgs/Icone_TC_512.png" />
                <meta property="og:url" content="https://chocolateria.vercel.app/" />

                <meta name="author" content="https://pragmata.ninja/"></meta>

                <link rel="icon" href="/favicon.ico" />
            </Head>
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} key="home">
                <main className="Page_Wrapper">
                    <section id="inicio" key={"inicio"}>
                        <ImageSlider content={t.landingPage.sections.home.bannerList} />
                    </section>
                    <section id="quem-somos" key={"quem-somos"}>
                        <div className="About_Container">
                            <h1 className="Section_Title" key={t.landingPage.sections.about.title}>
                                {t.landingPage.sections.about.title}
                            </h1>
                            {t.landingPage.sections.about.paragraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </section>
                    <section id="chocolates" key={"chocolates"}>
                        <div className="Services_Container">
                            <h2 className="Section_Title" key={t.landingPage.sections.expertise.title}>
                                {t.landingPage.sections.expertise.title}
                            </h2>
                            <GroupSlider />
                        </div>
                    </section>
                    <section id="contato" key={"contato"}>
                        <div className="Contact_Container">
                            <h2 className="Section_Title" key={t.landingPage.sections.contact.title}>
                                {t.landingPage.sections.contact.title}
                            </h2>

                            <div className="Contact_Content">
                                <div className="Contact_Card">
                                    <p className="Contact_CallToAction">Sinta-se a vontade para entrar em contato!</p>
                                    <p className="Contact_CallToAction">
                                        Estamos de prontidão para responder suas dúvidas, atender pedidos e encomendar chocolates especiais e
                                        personalizados!
                                    </p>

                                    <div className="Contact_Layout_Container">
                                        <div className="Telephone Contact_Layout_Item" key={"contato_telefone"}>
                                            <h3 className="Contact_Layout_Item_Title">{t.landingPage.sections.contact.telephone.title}</h3>
                                            <p>(41) 999 999 999</p>
                                        </div>

                                        <div className="Working_Hours Contact_Layout_Item" key={"contato_email"}>
                                            <h3 className="Contact_Layout_Item_Title">Email</h3>
                                            <p>contato@tropicalcacau.com</p>
                                        </div>

                                        <div className="Working_Hours Contact_Layout_Item">
                                            <h3 key={t.landingPage.sections.contact.functioningHours.title} className="Contact_Layout_Item_Title">
                                                {t.landingPage.sections.contact.functioningHours.title}
                                            </h3>
                                            <p key={"schedule"}>{t.landingPage.sections.contact.functioningHours.schedule}</p>
                                        </div>

                                        <div className="Working_Hours Contact_Layout_Item">
                                            <h3 key={t.landingPage.sections.contact.functioningHours.title} className="Contact_Layout_Item_Title">
                                                Endereço
                                            </h3>
                                            <p key={"schedule"}>
                                                Rua Francisco Camargo, nº 262 - Apto 01 <br></br> Colombo - PR - Brasil
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <iframe
                                    title="Mapa de localização da Chocolateria Tropical Cacau"
                                    className="Map"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBoWxQtCEHcm-AqgB3fjGveoXqVgy8g9pI&q=Rua+Franscisco+Camargo,+262,+Colombo+-+PR+-+Brasil"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </section>
                </main>
            </m.div>
        </>
    );
}
