import { WebStructure } from "@/types/WebStructure";

import teamList_EN from "@/content_lists/english/team_list_en";
import expertiseList_EN from "@/content_lists/english/expertise_list_en";

import productList from "@/content_lists/product_list";
import { productTypes, productCategories } from "@/content_lists/product_list";

import bannerList_EN from "@/content_lists/english/banner_list_en";
import privacyList_EN from "@/content_lists/english/privacy_list_en";
import termsList_EN from "@/content_lists/english/terms_list_en";

const englishWebStructure: WebStructure = {
    common: {
        customScheduleText: "Schedule an Appointment",
        returnToAreasOfExpertise: "Return to Areas of Expertise",
        customTitle: "Stresser & Machado | Advocacy and Legal Consultancy",
        customDescription:
            "Law firm in Curitiba led by two experienced lawyers, with twenty years of experience in the market and a solid academic background. We offer a wide range of legal services, including civil, criminal, labor, administrative, and tax law, with a commitment to providing reliable and personalized legal guidance to meet the individual needs of our clients.",
        customWebsiteURL: "https://www.stresseremachado.adv.br/en",
    },
    navbar: {
        logo: {
            pathURL: "/brand_imgs/Logo_Orange.png",
            title: "Stresser & Machado",
            width: 100,
            height: 100,
            alt: "Logotype Stresser & Machado",
        },

        navLinks: [
            {
                path: "/",
                name: "Home",
            },
            {
                path: "/#quem-somos",
                name: "About Us",
            },
            {
                path: "/#areas-de-atuacao",
                name: "Areas of Expertise",
            },
            {
                path: "/#contato",
                name: "Contact",
            },
        ],
    },
    menu: {
        title: "Menu",
        links: [
            {
                path: "/",
                name: "Home",
            },
            {
                path: "/#quem-somos",
                name: "About Us",
            },
            {
                path: "/#areas-de-atuacao",
                name: "Areas of Expertise",
            },
            {
                path: "/#contato",
                name: "Contact",
            },
            {
                path: "/privacidade",
                name: "Privacy",
            },
            {
                path: "/termos-de-uso",
                name: "Terms of Use",
            },
        ],
    },
    cookies: {
        title: "Cookies",
        paragraphs: [
            "This website use cookies to guarantee that you get the best experience.",
            "By continuing to use this site, you agree to the use of cookies.",
        ],
        btnText: "Understood",
    },
    privacy: {
        title: "Privacy Policy",
        paragraphs: privacyList_EN,
    },
    terms: {
        title: "Terms of Use",
        paragraphs: termsList_EN,
    },
    landingPage: {
        sections: {
            home: {
                key: "inicio",
                title: "Home",

                scheduleBtn: {
                    title: "Schedule an Appointment",
                    label: "Schedule an Appointment",
                },

                bannerList: bannerList_EN,
            },
            about: {
                key: "quem-somos",
                title: "About Us",
                paragraphs: [
                    "The law firm Stresser and Machado is recognized for the exemplary leadership of two prominent lawyers in the field. With a solid experience gained in both public and private service, they bring with them a deep understanding of legal nuances and intricacies of the legal system. Throughout their twenty years of practice in the market and academic formation, they have established themselves as leaders in the field.",
                    "Our office offers a wide range of legal services, covering areas such as civil, criminal, labor, administrative, and tax law. We are committed to providing reliable and high-quality legal guidance to meet the diverse needs of our clients.",
                    "Furthermore, the personalized approach adopted by Stresser and Machado's office is a distinctive feature. We understand that each case is unique and deserves individualized attention. Therefore, we work closely with our clients, developing tailored legal strategies to achieve the best possible results.",
                    "Our commitment to excellence and integrity is essential in every aspect of our work. Not only do we vigorously defend the interests of our clients, but we also do so within the highest ethical standards. This ensures not only satisfactory results but also the lasting trust and satisfaction of those who rely on our services.",
                ],
            },

            team: {
                key: "equipe",
                title: "Our Team",
                members: teamList_EN,
            },

            expertise: {
                key: "areas-de-atuacao",
                title: "Areas of Expertise",
                expertiseList: expertiseList_EN,
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
                title: "Contact",

                telephone: {
                    title: "Telephone",
                },

                functioningHours: {
                    title: "Functioning Hours",
                    schedule: "Monday to Friday: 09:00 - 12:00 | 13:00 - 18:00",
                },

                adress: {
                    key: "endereco",
                    title: "Address",
                    adress: "Avenida Manoel Ribas, nº 507 - Sala 05 - Mercês Curitiba - PR 80510-346 Brazil",
                },
            },
        },
    },

    pages: [],
    footer: {
        privacyBtn: {
            title: "Privacy Policy",
            label: "Privacy Policy",
        },
        termsBtn: {
            title: "Terms of Use",
            label: "Terms of Use",
        },
        langBtn: {
            text: "Português",
            label: "Change to Portuguese",
            availableLangs: ["en", "pt-BR"],
        },
        copyRight: "© 2024 Stresser & Machado",

        scheduleBtn: {
            title: "Schedule an Appointment",
            label: "Schedule an Appointment",
        },

        telephoneBtn: {
            title: "Call Us",
            label: "Call us",
        },

        emailBtn: {
            title: "Send us an Email",
            label: "Send us an Email",
        },
    },
};

export default englishWebStructure;
