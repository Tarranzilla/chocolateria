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
                <meta property="og:image" content="https://stresseremachado.vercel.app/brand_imgs/Icone_512.png" />
                <meta property="og:url" content="https://stresseremachado.vercel.app/" />

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

                            <h1 className="Section_Title" key={t.landingPage.sections.team.title}>
                                {t.landingPage.sections.team.title}
                            </h1>

                            <div className="Team_Container">
                                {t.landingPage.sections.team.members.map((member, index) => (
                                    <div className="Team_Member" key={index}>
                                        <div className="Team_Member_Header">
                                            <Image src={member.picture} alt={member.name} width={200} height={300} />
                                            <div className="Team_Member_Info">
                                                <h2 className="Team_Member_Name">{member.name}</h2>
                                                <div className="Team_Member_Actions">
                                                    <div className="Team_Member_Action">
                                                        <span className="material-icons">phone</span>
                                                        <p>{member.cellphone}</p>
                                                    </div>
                                                    <div className="Team_Member_Action">
                                                        <span className="material-icons">fax</span>
                                                        <p>{member.telephone}</p>
                                                    </div>
                                                    <div className="Team_Member_Action">
                                                        <span className="material-icons">mail</span>
                                                        <p>{member.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="Team_Member_Description">
                                            {member.description.map((paragraph, index) => (
                                                <p key={index}>{paragraph}</p>
                                            ))}

                                            {member.professionalExperience && (
                                                <div className="Team_Member_ProfessionalExperience">
                                                    <h3>{member.professionalExperience[0].title}</h3>
                                                    {member.professionalExperience[0].paragraphs.map((paragraph, index) => (
                                                        <p key={index}>{paragraph}</p>
                                                    ))}
                                                </div>
                                            )}

                                            {member.complementaryEducation && (
                                                <div className="Team_Member_ComplementaryEducation">
                                                    <h3>{member.complementaryEducation[0].title}</h3>
                                                    {member.complementaryEducation[0].paragraphs.map((paragraph, index) => (
                                                        <p key={index}>{paragraph}</p>
                                                    ))}
                                                </div>
                                            )}

                                            {member.academicBackground && (
                                                <div className="Team_Member_AcademicBackground">
                                                    <h3>{member.academicBackground[0].title}</h3>
                                                    {member.academicBackground[0].paragraphs.map((paragraph, index) => (
                                                        <p key={index}>{paragraph}</p>
                                                    ))}
                                                </div>
                                            )}

                                            {member.academicProduction && (
                                                <div className="Team_Member_AcademicProduction">
                                                    <h3>{member.academicProduction[0].title}</h3>
                                                    {member.academicProduction[0].paragraphs.map((paragraph, index) => (
                                                        <p key={index}>{paragraph}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
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

                            <p>
                                Sinta-se a vontade para entrar em contato! Estamos de prontidão para responder suas dúvidas, atender pedidos e
                                encomendar chocolates especiais e personalizados!
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
                            </div>

                            <div className="Working_Hours Contact_Layout_Item Adress_Item">
                                <h1 className="Adress_Title">{t.landingPage.sections.contact.adress.title}</h1>
                                <p>{t.landingPage.sections.contact.adress.adress}</p>
                            </div>

                            <iframe
                                title="Mapa de localização do escritório de advocacia Stresser & Machado"
                                className="Map"
                                referrerPolicy="no-referrer-when-downgrade"
                                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBoWxQtCEHcm-AqgB3fjGveoXqVgy8g9pI&q=Avenida+Manoel+Ribas,+n%C2%BA+507,+Merc%C3%AAs+Curitiba+-+PR+-+Brasil"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </section>
                </main>
            </m.div>
        </>
    );
}
