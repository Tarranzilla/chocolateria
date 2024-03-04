import { NavLink } from "./NavLink";
import { Page } from "./Page";

import ParagraphsWithTitle from "./ParagraphsWithTitle";

import { TeamMember } from "./TeamMember";
import { Expertise } from "./Expertise";

import Product from "./Product";
import { Product_Category } from "./Product";

import Banner from "./Banner";

// O site é definido como uma array de páginas, as páginas possuem uma estrutura recursiva de subpáginas
export type WebStructure = {
    common: {
        searchBtn?: {
            path: string;
            text: string;
            placeholder: string;
            label: string;
        };

        shareBtn?: {
            path: string;
            text: string;
            label: string;
        };

        shopBtn?: {
            title: string;
            label: string;
        };

        customScheduleText: string;
        returnToAreasOfExpertise: string;
        customTitle: string;
        customDescription: string;
        customWebsiteURL: string;
    };

    navbar: {
        logo: {
            pathURL: string;
            title: string;
            width: number;
            height: number;
            alt: string;
        };

        navLinks?: NavLink[];

        menuBtn?: {
            title: string;
            label: string;
        };
    };

    menu: {
        title: string;
        links: NavLink[];
        menuBtn?: {
            title: string;
            label: string;
        };

        colorModeBtn?: {
            path: string;
            text: string;
            label: string;
        };
    };

    cart?: {
        title: string;
        emptyMessage: string;

        cartBtn?: {
            path: string;
            text: string;
            label: string;
        };

        checkoutBtn: {
            text: string;
            label: string;
        };

        checkOutHelpBtn: {
            text: string;
            label: string;
        };

        checkOutHelp: {
            title: string;
            paragraphs: string[];
            actionText: string;
        };
    };

    cookies: {
        title: string;
        paragraphs: string[];
        btnText: string;
    };

    privacy: {
        title: string;
        paragraphs: ParagraphsWithTitle[];
    };

    terms: {
        title: string;
        paragraphs: ParagraphsWithTitle[];
    };

    landingPage: {
        sections: {
            home: {
                key: string;
                title: string;

                scheduleBtn: {
                    title: string;
                    label: string;
                };

                bannerList: Banner[];
            };
            about: {
                key: string;
                title: string;
                paragraphs: string[];
            };

            team: {
                key: string;
                title: string;
                members: TeamMember[];
            };

            expertise: {
                key: string;
                title: string;
                expertiseList: Expertise[];
            };

            products: {
                key: string;
                title: string;
                productsList: Product[];
                productCategories: Product_Category[];
                productTypes: string[];
            };

            contact: {
                key: string;
                title: string;

                telephone: {
                    title: string;
                };

                functioningHours: {
                    title: string;
                    schedule: string;
                };

                adress: {
                    key: string;
                    title: string;
                    adress: string;
                };
            };
        };
    };

    pages: Page[];

    footer: {
        privacyBtn: {
            title: string;
            label: string;
        };

        termsBtn: {
            title: string;
            label: string;
        };

        langBtn?: {
            text: string;
            label: string;
            availableLangs: string[];
        };

        copyRight: string;

        scheduleBtn: {
            title: string;
            label: string;
        };

        telephoneBtn: {
            title: string;
            label: string;
        };

        emailBtn: {
            title: string;
            label: string;
        };
    };
};
