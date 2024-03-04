import { WebStructure } from "@/types/WebStructure";

import teamList from "@/content_lists/team_list";
import expertiseList from "@/content_lists/expertise_list";
import productList from "@/content_lists/product_list";
import { productTypes, productCategories } from "@/content_lists/product_list";

import bannerList from "@/content_lists/banner_list";
import privacyList from "@/content_lists/privacy_list";
import termsList from "@/content_lists/terms_list";

const portugueseWebStructure: WebStructure = {
    common: {
        customScheduleText: "Agende uma Consulta",
        returnToAreasOfExpertise: "Voltar para Áreas de Atuação",
        customTitle: "Tropical Cacau | Chocolates Orgânicos",
        customDescription:
            "Tropical Cacau é uma empresa que produz chocolates orgânicos de alta qualidade. Nossos produtos são feitos com ingredientes naturais e de forma sustentável. Experimente nossos chocolates e descubra o verdadeiro sabor do cacau.",
        customWebsiteURL: "https://tropical-cacau.vercel.com",
    },
    navbar: {
        logo: {
            pathURL: "/brand_imgs/Logo_Orange.png",
            title: "Tropical Cacau",
            width: 100,
            height: 100,
            alt: "Logotipo Tropical Cacau",
        },

        navLinks: [
            {
                path: "/",
                name: "Início",
            },
            {
                path: "/#quem-somos",
                name: "Sobre",
            },
            {
                path: "/#chocolates",
                name: "Chocolates",
            },
            {
                path: "/#contato",
                name: "Contato",
            },
        ],
    },
    menu: {
        title: "Menu",
        links: [
            {
                path: "/",
                name: "Início",
            },
            {
                path: "/#quem-somos",
                name: "Sobre",
            },
            {
                path: "/#chocolates",
                name: "Chocolates",
            },
            {
                path: "/#contato",
                name: "Contato",
            },
            {
                path: "/privacidade",
                name: "Privacidade",
            },
            {
                path: "/termos-de-uso",
                name: "Termos de Uso",
            },
        ],
    },
    cookies: {
        title: "Cookies",
        paragraphs: [
            "Este site usa cookies para garantir que você obtenha a melhor experiência.",
            "Ao continuar a usar este site, você concorda com o uso de cookies.",
        ],
        btnText: "Entendi",
    },
    privacy: {
        title: "Política de Privacidade",
        paragraphs: privacyList,
    },
    terms: {
        title: "Termos de Uso",
        paragraphs: termsList,
    },
    landingPage: {
        sections: {
            home: {
                key: "inicio",
                title: "Início",

                scheduleBtn: {
                    title: "Agende uma Consulta",
                    label: "Agende uma Consulta",
                },

                bannerList: bannerList,
            },
            about: {
                key: "quem-somos",
                title: "A Chocolateria",
                paragraphs: [
                    "A Tropical Cacau é uma chocolateria Brasileira criada pela confeiteira e nutricionista Letícia Guedes. Confecionamos sabores e experiências de forma consciente por meio do uso de ingredientes sustentáveis, orgânicos e saborosos.",
                    "Na Tropical Cacau, estamos empenhados em trazer para você um chocolate de qualidade excepcional, enquanto protegemos o meio ambiente e promovemos o comércio justo.",
                    "Como uma empresa com valores éticos e sustentáveis, estamos comprometidos em fornecer a nossos clientes uma experiência única e deliciosa. Desde o cacau cuidadosamente selecionado, até a produção artesanal em nossa própria fábrica em Curitiba, cada etapa do processo é feita com paixão e responsabilidade.",
                    "Nossa missão é ser uma referência em chocolate de qualidade, inovação e responsabilidade social e ambiental. Nossa visão é oferecer ao mundo o melhor chocolate brasileiro, baseado em uma cadeia produtiva justa e sustentável, que valorize o trabalho humano e promova o desenvolvimento econômico e social.",
                    "Junte-se a nós nesta jornada pelo chocolate brasileiro de qualidade, justo e sustentável!",
                ],
            },

            team: {
                key: "equipe",
                title: "Nossa Equipe",
                members: teamList,
            },

            expertise: {
                key: "chocolates",
                title: "Chocolates",
                expertiseList: expertiseList,
            },

            products: {
                key: "produtos",
                title: "Produtos",
                productsList: productList,
                productCategories: productCategories,
                productTypes: productTypes,
            },

            contact: {
                key: "contato",
                title: "Contato",

                telephone: {
                    title: "Telefone",
                },

                functioningHours: {
                    title: "Horário de Funcionamento",
                    schedule: "Segunda a Sexta: 09:00 - 12:00 | 13:00 - 18:00",
                },

                adress: {
                    key: "endereco",
                    title: "Endereço",
                    adress: "Avenida Manoel Ribas, nº 507 - Sala 05 - Mercês Curitiba - PR 80510-346 Brasil",
                },
            },
        },
    },

    pages: [],
    footer: {
        privacyBtn: {
            title: "Política de Privacidade",
            label: "Política de Privacidade",
        },
        termsBtn: {
            title: "Termos de Uso",
            label: "Termos de Uso",
        },
        langBtn: {
            text: "English",
            label: "Mudar para Inglês",
            availableLangs: ["en", "pt-BR"],
        },
        copyRight: "© 2024 Stresser & Machado",

        scheduleBtn: {
            title: "Agende uma Consulta",
            label: "Agende uma Consulta",
        },

        telephoneBtn: {
            title: "Ligue para nós",
            label: "Ligue para nós",
        },

        emailBtn: {
            title: "Envie um Email",
            label: "Envie um Email",
        },
    },
};

export default portugueseWebStructure;
