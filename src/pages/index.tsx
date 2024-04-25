// General Imports

import { useState } from "react";
import { motion as m, AnimatePresence } from "framer-motion";

import { useSimpleTranslation } from "@/international/useSimpleTranslation";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// Component Imports

import ImageSlider from "@/components/ImageSlider";
import GroupSlider from "@/components/groupSlider";
import InstaFeed from "@/components/InstaFeed";

// WhatsApp Functions

const businessTelephone = "5541999977955";

const generateWhatsAppURL = () => {
    let message = "Olá, eu gostaria de fazer parte do Clube Tropical!";

    // Encode the message in a URL
    const encodedMessage = encodeURIComponent(message);

    // Return a WhatsApp Click to Chat URL
    return `https://wa.me/${businessTelephone}?text=${encodedMessage}`;
};

const generateWhatsAppURL_Advanced = (business_telephone: string, message: string) => {
    // Encode the message in a URL
    const encodedMessage = encodeURIComponent(message);

    // Return a WhatsApp Click to Chat URL
    return `https://wa.me/${businessTelephone}?text=${encodedMessage}`;
};

// About Content

const AboutContent = [
    {
        bannerImgSrc: "/about_imgs/historia_cacau.jpg",
        title: "A História do Cacau",
        paragraphs: [
            "O Cacau, uma planta nativa da região amazônica, é uma das culturas mais importantes e populares no mundo, tendo uma história antiga e fascinante que inclui diversas lendas e mitos.",
            "Segundo a mitologia maia, Coração do Céu, a principal divindade, criou os seres humanos utilizando vários materiais da natureza, incluindo o cacau, como um dos ingredientes essenciais.",
            "De acordo com a lenda asteca, Quetzalcoatl, a serpente emplumada, foi a primeira a trazer as sementes de cacau para a Terra do Jardim do Éden. Quetzalcoatl ensinou os humanos a arte da agricultura, medicina e cultivo do cacau. Esta divindade não gostava de rituais de sacrifício humano e era amada pelas pessoas.",
            "Para os antigos peruanos, o deus das tempestades, Khuno, destruiu uma aldeia com chuva torrencial e granizo porque seus habitantes derrubaram as árvores e atearam fogo na floresta para clarear a terra e cultivar alimentos. Quando a tempestade acabou, os sobreviventes encontraram uma árvore de cacau, que se tornou um alimento essencial para eles e os ajudou a viver em harmonia com a natureza.",
            "Uma lenda dos Andes fala sobre um deus onipotente chamado Sibu que transferiu seus poderes para outro deus, Sura, mas suas sementes foram comidas por uma terceira divindade, Jabaru. Jabaru foi morto por Sura, que enterrou seu corpo no local onde estavam as sementes. Quando Sura voltou, encontrou um cacaueiro e um pé de cabaça crescendo no local. Sibu ordenou que Jabaru preparasse uma bebida com as sementes do cacau, mas a bebida fez a barriga de Jabaru inchar e explodir, deixando cair as sementes no chão. Sibu restaurou a vida de Sura e devolveu as sementes, permitindo que humanos e animais nascessem e crescessem.",
            "A história do cacau na América do Sul ainda inclui outros mitos e lendas, como a história de como os deuses teriam dado o cacau como presente para os humanos, para que eles pudessem ter acesso à imortalidade. De acordo com essa história, o deus Viracocha teria criado a primeira árvore de cacau e dado seus frutos aos homens, que aprenderam a prepará-los como bebida. Ao consumir essa bebida, os humanos teriam adquirido poderes divinos e se tornado imortais.",
            'Ao longo dos séculos, o cacau se tornou um ingrediente essencial na culinária e cultura de muitos países da América Latina. Os Astecas e Maias usavam o cacau para fazer uma bebida quente e espumosa, chamada de "xocoatl", que era misturada com especiarias e mel. Essa bebida era considerada sagrada e utilizada em rituais religiosos, e também era consumida como um tônico energético.',
            "Com a chegada dos europeus na América, o cacau foi introduzido na Europa e se tornou um produto de luxo e prestígio. Os europeus descobriram que misturando açúcar com cacau, era possível fazer uma bebida ainda mais saborosa, e assim nasceu o chocolate. A partir do século XVIII, o cultivo do cacau se espalhou por outras partes do mundo, como a África e a Ásia, e o chocolate se tornou um produto popular e consumido em todo o mundo.",
            "Hoje em dia, o cacau é um dos principais produtos agrícolas do mundo, e é cultivado em países como Gana, Costa do Marfim, Indonésia e Brasil. O chocolate é um produto amplamente consumido em todo o mundo, em diferentes formas e variedades, e continua a ser um símbolo de luxo, prazer e indulgência. A história do cacau é rica em mitos e lendas, e é uma prova da importância que essa planta teve e ainda tem na cultura e na gastronomia de muitos países ao redor do mundo.",
        ],
    },

    {
        bannerImgSrc: "/about_imgs/cacau_brasil.jpg",
        title: "O Cacau no Brasil",
        paragraphs: [
            "O cacau tem uma longa história no Brasil, remontando a milhares de anos, quando as civilizações indígenas já o consumiam. No entanto, foi somente durante o século XVIII que a cultura do cacau ganhou impulso significativo no país. Em meados do século XIX, a Bahia se tornou o principal estado produtor de cacau, graças às condições climáticas favoráveis e ao solo rico da região cacaueira.",
            "Com a crescente demanda mundial por chocolate na virada do século XX, a produção de cacau no Brasil aumentou substancialmente. A partir da década de 1930, o país se consolidou como o maior produtor mundial de cacau, impulsionado principalmente pela produção de chocolate em grande escala por empresas brasileiras e internacionais.",
            "No entanto, a década de 1980 trouxe desafios significativos para a indústria do cacau no Brasil. A propagação de uma doença devastadora chamada vassoura-de-bruxa causou grandes perdas nas plantações de cacau e teve um impacto significativo na produção. Além disso, a concorrência com outros países produtores e mudanças nos hábitos de consumo também afetaram o setor.",
            "A partir dos anos 2000, o Brasil começou a se recuperar dessa crise através de esforços de pesquisa e desenvolvimento de variedades resistentes da planta. Novas áreas de cultivo foram exploradas em outros estados além da Bahia, como Pará e Espírito Santo, diversificando a produção do país.",
            "Atualmente, o Brasil continua sendo um dos principais produtores de cacau no mundo, embora a liderança tenha sido compartilhada com outros países. O cultivo sustentável e a busca por práticas agrícolas responsáveis estão se tornando cada vez mais relevantes para garantir a preservação do cacau brasileiro e o crescimento sustentável da indústria do chocolate no país.",
        ],
    },

    {
        bannerImgSrc: "/about_imgs/propriedades_cacau.jpg",
        title: "Propriedades do Cacau",
        paragraphs: [
            "O cacau, especialmente em sua forma não processada, oferece várias propriedades benéficas para o corpo humano, graças à presença de compostos naturais.",
            "Abaixo estão as principais propriedades e efeitos do cacau no corpo:",
            "Antioxidantes: O cacau é uma rica fonte de antioxidantes, incluindo flavonoides e polifenóis. Esses antioxidantes ajudam a combater os radicais livres no corpo, reduzindo o estresse oxidativo e protegendo as células contra danos, o que pode contribuir para a prevenção de doenças crônicas e o envelhecimento celular.",
            "Efeitos cardiovasculares: O cacau tem propriedades que podem melhorar a saúde do coração. Os flavonoides encontrados no cacau podem promover a dilatação dos vasos sanguíneos, melhorar a circulação e reduzir a pressão arterial. Além disso, estudos sugerem que o consumo regular de cacau pode contribuir para a redução do colesterol LDL (colesterol ruim) e aumentar o colesterol HDL (colesterol bom).",
            "Estimulante e bem-estar: O cacau contém teobromina e cafeína em quantidades moderadas, substâncias estimulantes que podem promover um aumento temporário de energia e melhorar o humor. Além disso, o cacau é associado à liberação de endorfinas, neurotransmissores que podem gerar uma sensação de prazer e bem-estar.",
            "Cognição e humor: Algumas pesquisas sugerem que o cacau pode ter efeitos positivos na cognição e no humor. Os flavonoides presentes no cacau podem melhorar o fluxo sanguíneo cerebral, o que pode aumentar a função cognitiva e a concentração. Além disso, o cacau pode reduzir os sintomas de estresse e ansiedade, melhorando o humor.",
            "Efeitos anti-inflamatórios: Os antioxidantes encontrados no cacau também podem ter propriedades anti-inflamatórias. Eles podem ajudar a reduzir a inflamação no corpo, contribuindo para a prevenção de doenças inflamatórias crônicas, como a artrite reumatoide e algumas doenças cardiovasculares.",
            "É importante lembrar que esses efeitos benéficos estão associados ao consumo moderado de cacau e preferencialmente em sua forma menos processada, como o chocolate amargo com alto teor de cacau ou o cacau em pó natural. O consumo excessivo de produtos de chocolate altamente açucarados e processados pode anular esses benefícios e até mesmo ser prejudicial à saúde.",
        ],
    },

    {
        bannerImgSrc: "/about_imgs/producao_cacau.jpg",
        title: "Produção do Cacau",
        paragraphs: [
            "O ciclo sazonal da plantação e do crescimento do cacau segue um padrão bem definido, com quatro principais etapas:",
            "Florada: O ciclo começa com a florada, que geralmente ocorre entre novembro e janeiro, período em que as árvores de cacau florescem. As pequenas flores são de coloração branca e nascem diretamente no tronco e nos galhos mais velhos das árvores.",
            "Frutificação: Após a polinização cruzada, as flores dão lugar às frutas do cacau, conhecidas como 'cápsulas' ou 'cabruca'. Essas cápsulas têm formato oval e contêm diversas sementes envolvidas por uma polpa adocicada. O processo de frutificação começa cerca de 5 a 7 meses após a florada, geralmente a partir de maio ou junho.",
            "Colheita: A colheita das cápsulas de cacau acontece de forma manual e é um processo trabalhoso. Ela é realizada ao longo de vários meses, uma vez que as cápsulas não amadurecem todas ao mesmo tempo. Os agricultores colhem as cápsulas maduras e, ao mesmo tempo, fazem a poda das árvores para garantir um melhor crescimento futuro.",
            "Pós-colheita e secagem: Após a colheita, as cápsulas são abertas e as sementes de cacau (amêndoas) são retiradas. As amêndoas, ainda envoltas em uma polpa mucilaginosa, são deixadas para fermentar por alguns dias em caixotes ou cestos cobertos. Em seguida, as amêndoas são espalhadas para secar ao sol, processo que pode levar de uma a duas semanas. A secagem é uma etapa essencial para evitar a formação de fungos e garantir a qualidade do cacau.",
            "Completado o ciclo sazonal, o cacau está pronto para ser comercializado e processado. As amêndoas de cacau serão transformadas em produtos como o cacau em pó, a manteiga de cacau e, é claro, o tão apreciado chocolate. Esse ciclo se repete anualmente, com as árvores de cacau produzindo frutos por várias décadas, desde que cuidadas adequadamente pelos agricultores.",
            "Os produtos da Tropical Cacau são produzidos com base em práticas sustentáveis, desde a plantação do cacau até a fabricação do chocolate. O ciclo de vida desses produtos é dividido em três fases: produção, uso e descarte.",
            "Produção: Durante a fase de produção, a Tropical Cacau se preocupa em utilizar técnicas que minimizem o impacto ambiental, como o uso de insumos orgânicos e o respeito às leis trabalhistas. Além disso, a empresa promove a preservação das florestas e do habitat natural dos animais, realizando um manejo florestal responsável em suas fazendas produtoras de cacau.",
            "Uso: Durante a fase de uso, a Tropical Cacau incentiva o consumo consciente, promovendo a educação sobre a importância da sustentabilidade e do respeito ao meio ambiente. Os produtos são embalados de forma a minimizar a utilização de plástico e outros materiais que causem danos ambientais, além de serem oferecidos em embalagens reutilizáveis e/ou recicláveis.",
            "Descarte: Durante a fase de descarte, a Tropical Cacau promove a reciclagem e o correto descarte das embalagens, além de buscar formas de reutilização dos resíduos gerados na produção do chocolate, como a utilização de cascas de cacau na fabricação de adubo orgânico. A empresa também se preocupa em apoiar projetos de recuperação ambiental e social em suas comunidades.",
            "Em resumo, a Tropical Cacau busca seguir práticas sustentáveis em todas as fases do ciclo de vida de seus produtos, desde a produção até o descarte, visando a preservação do meio ambiente e o desenvolvimento sustentável.",
        ],
    },
];

type AboutContainerProps = {
    bannerImgSrc: string;
    title: string;
    paragraphs: string[];
};

function AboutContainer(AboutContainerProps: AboutContainerProps) {
    const t = useSimpleTranslation();

    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="Scrollable_Item">
            <div className="Scrollable_Item_Content_Wrapper">
                <Image
                    className="Scrollable_Item_Image"
                    src={AboutContainerProps.bannerImgSrc}
                    alt={AboutContainerProps.title}
                    width={800}
                    height={800}
                    onClick={() => {
                        setIsExpanded(!isExpanded);
                    }}
                />

                <div
                    className="About_Container_Header"
                    onClick={() => {
                        setIsExpanded(!isExpanded);
                    }}
                >
                    <h3 className="About_Container_UpTitle">Sobre</h3>
                    <h2 className="About_Container_Title" key={AboutContainerProps.title}>
                        {AboutContainerProps.title}
                    </h2>

                    <span className={isExpanded ? "material-icons About_Expand_Btn Active" : "material-icons About_Expand_Btn"}>expand_more</span>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <m.div
                            className="About_Container_Text"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
                        >
                            {AboutContainerProps.paragraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </m.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Home Component

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

                <link rel="icon" href="/favicon.png" />
            </Head>
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} key="home">
                <main className="Page_Wrapper">
                    <section id="inicio" className="Page_Section LP_Section" key={"inicio"}>
                        <ImageSlider content={t.landingPage.sections.home.bannerList} />
                    </section>
                    <section id="quem-somos" className="Page_Section LP_Section" key={"quem-somos"}>
                        <h1 className="Section_Title" key={t.landingPage.sections.about.title}>
                            {t.landingPage.sections.about.title}
                        </h1>

                        <div className="Section_Horizontal_Content">
                            <Image
                                src={"/team_imgs/Leticia_Tropical_Cacau.jpg"}
                                alt="Foto Leticia"
                                className="Section_Main_Image"
                                width={400}
                                height={600}
                            />

                            <div className="Section_Text_Wrapper">
                                <div className="Section_Text_Container">
                                    {t.landingPage.sections.about.paragraphs.map((paragraph, index) => (
                                        <p className={"Section_Text_Container_P"} key={index}>
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section id="universo_cacau" className="Page_Section LP_Section" key={"universo-cacau"}>
                        <h2 className="Section_Title Club_Title">O Universo do Cacau</h2>

                        <div className="Section_Horizontal_Content">
                            <div className="Section_Scrollable_Content_Wrapper">
                                {AboutContent.map((content, index) => (
                                    <AboutContainer
                                        key={index}
                                        title={content.title}
                                        paragraphs={content.paragraphs}
                                        bannerImgSrc={content.bannerImgSrc}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                    <section id="Instagram-News" className="Page_Section LP_Section" key={"insta-feed"}>
                        <h2 className="Section_Title">Publicações nas Redes</h2>
                        <div className="Section_Horizontal_Content">
                            <InstaFeed />
                        </div>
                    </section>
                    <section id="chocolates" className="Page_Section LP_Section" key={"chocolates"}>
                        <h2 className="Section_Title" key={t.landingPage.sections.expertise.title}>
                            {t.landingPage.sections.expertise.title}
                        </h2>
                        <GroupSlider />
                    </section>
                    <section id="clube-tropical" className="Page_Section LP_Section Club_Section" key={"clube-tropical"}>
                        <h2 className="Section_Title Club_Title">Clube Tropical</h2>

                        <p className="Club_Text Main_Club_Text">Que tal ter uma seleção de chocolates deliciosos chegando todo mês na sua casa?</p>

                        <p className="Club_Text">
                            Membros do Clube Tropical recebem mensalmente uma caixa com 6 chocolates especiais, feitos com cacau de origem única - E
                            também possuem acesso a descontos de 10% em todos os outros produtos.
                        </p>

                        <Link className="Subcription_Btn" href={generateWhatsAppURL()} target="_blank" rel="noopener noreferrer">
                            Quero Participar
                            <span className="material-icons">loyalty</span>
                        </Link>

                        <Image
                            className={"Clube_Tropical_Section_Img"}
                            src={"/brand_imgs/Clube_Tropical_002.png"}
                            width={1000}
                            height={800}
                            alt="Clube Tropical"
                        />
                    </section>
                    <section id="contato" className="Page_Section LP_Section" key={"contato"}>
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
                                        <p>+55 (41) 987 754 906</p>
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
                    </section>
                </main>
            </m.div>
        </>
    );
}
