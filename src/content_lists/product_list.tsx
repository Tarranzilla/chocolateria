import Product from "@/types/Product";
import { Product_Category } from "@/types/Product";

export const productCategories: Product_Category[] = [
    {
        key: "pascoa",
        name: "Páscoa",
        types: ["Ovos Trufados", "Ovos com Lascas", "Mini Ovos"],
    },
    {
        key: "classicos",
        name: "Clássicos",
        types: ["Barras"],
    },
];
export const productTypes: string[] = ["Ovos Trufados", "Ovos com Lascas", "Mini Ovos"];

const productList: Product[] = [
    {
        key: "ovo-caramelo-amendoim",
        type: "Ovos Trufados",
        category: "Páscoa",
        title: "Ovo Caramelo com Amendoim",
        subtitle: "Chocolate 55% intenso ao leite com recheio de caramelo com amendoim.",
        description: ["Chocolate 55% intenso ao leite com recheio de caramelo com amendoim."],
        price: 103.0,
        weight: "400g",
        ingredients: ["Chocolate 55%", "Caramelo", "Amendoim"],
        imgSrc: "/product_imgs/ovo_caramelo_com_amendoim.jpg",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "ovo-pistache",
        type: "Ovos Trufados",
        category: "Páscoa",
        title: "Ovo Pistache",
        subtitle: "Chocolate branco com pedaços de pistache torrado é nosso recheio exclusivo de creme de pistache.",
        description: ["Chocolate branco com pedaços de pistache torrado é nosso recheio exclusivo de creme de pistache."],
        price: 193.0,
        weight: "400g",
        ingredients: ["Chocolate branco", "Pistache"],
        imgSrc: "/product_imgs/ovo_pistache.jpg",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "ovo-tropical-minas",
        type: "Ovos com Lascas",
        category: "Páscoa",
        title: "Ovo Tropical Minas",
        subtitle: "Chocolate branco 35% caramelizado com notas de doce de leite, acompanha lascas do mesmo chocolate com castanha de caju.",
        description: ["Chocolate branco 35% caramelizado com notas de doce de leite, acompanha lascas do mesmo chocolate com castanha de caju."],
        price: 90.0,
        weight: "300g",
        ingredients: ["Chocolate branco 35%", "Doce de leite", "Castanha de caju"],
        imgSrc: "/product_imgs/ovo_tropical_minas.jpg",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "mini-ovo",
        type: "Mini Ovos",
        category: "Páscoa",
        title: "Mini Ovo",
        subtitle: "Cada mini ovo acompanha duas mini barrinhas de chocolate do mesmo sabor.",
        description: [
            "Cada mini ovo acompanha duas mini barrinhas de chocolate do mesmo sabor.",
            "Não esqueça de escolher o sabor da casca: ao leite, intenso 70%, branco, doce de leite, intenso 55% ao leite ou café 40% ao leite.",
        ],
        price: 35.0,
        weight: "120g",
        ingredients: ["Depende do sabor escolhido"],
        imgSrc: "/product_imgs/ovo_mini.jpg",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "ovo-cookies-nutella",
        type: "Ovos Trufados",
        category: "Páscoa",
        title: "Ovo Cookies com Nutella",
        subtitle: "Chocolate branco com crocante de cookies e recheio de nutella.",
        description: ["Chocolate branco com crocante de cookies e recheio de nutella."],
        price: 138.0,
        weight: "400g",
        ingredients: ["Chocolate branco", "Cookies", "Nutella"],
        imgSrc: "/product_imgs/ovo_cookies_nutela.jpg",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "ovo-tropical-maravilha",
        type: "Ovos Trufados",
        category: "Páscoa",
        title: "Ovo Tropical Maravilha",
        subtitle: "Chocolate ao leite com recheio cremoso sabor chocolate, com suave crocancia de pedaços de wafer recheado.",
        description: ["Chocolate ao leite com recheio cremoso sabor chocolate, com suave crocancia de pedaços de wafer recheado."],
        price: 155.0,
        weight: "400g",
        ingredients: ["Chocolate ao leite", "Recheio cremoso sabor chocolate", "Pedaços de wafer recheado"],
        imgSrc: "/product_imgs/ovo_tropical_maravilha.jpg",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "ovo-tropical-amazonas",
        type: "Ovos com Lascas",
        category: "Páscoa",
        title: "Ovo Tropical Amazonas",
        subtitle: "Chocolate ao leite 45% cacau, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará.",
        description: ["Chocolate ao leite 45% cacau, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará."],
        price: 90.0,
        weight: "300g",
        ingredients: ["Chocolate ao leite 45%", "Castanha de caju", "Castanha do pará"],
        imgSrc: "/product_imgs/ovo_tropical_amazonas.jpg",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "ovo-tropical-parana-amazonas",
        type: "Ovos com Lascas",
        category: "Páscoa",
        title: "Ovo Tropical Paraná + Amazonas",
        subtitle:
            "Metade chocolate branco 35% e a outra metade chocolate ao leite 45% cacau, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará.",
        description: [
            "Metade chocolate branco 35% e a outra metade chocolate ao leite 45% cacau, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará.",
        ],
        price: 90.0,
        weight: "300g",
        ingredients: ["Chocolate branco 35%", "Chocolate ao leite 45%", "Castanha de caju", "Castanha do pará"],
        imgSrc: "/product_imgs/ovo_tropical_parana_amazonas.jpg",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "ovo-tropical-parana",
        type: "Ovos com Lascas",
        category: "Páscoa",
        title: "Ovo Tropical Paraná",
        subtitle: "Chocolate branco 35%, acompanha lascas do mesmo chocolate com castanha de caju.",
        description: ["Chocolate branco 35%, acompanha lascas do mesmo chocolate com castanha de caju."],
        price: 90.0,
        weight: "300g",
        ingredients: ["Chocolate branco 35%", "Castanha de caju"],
        imgSrc: "/product_imgs/ovo_tropical_parana.jpg",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "ovo-tropical-rio",
        type: "Ovos com Lascas",
        category: "Páscoa",
        title: "Ovo Tropical Rio",
        subtitle: "Chocolate intenso ao leite 55% cacau, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará.",
        description: ["Chocolate intenso ao leite 55% cacau, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará."],
        price: 90.0,
        weight: "300g",
        ingredients: ["Chocolate intenso ao leite 55%", "Castanha de caju", "Castanha do pará"],
        imgSrc: "/product_imgs/ovo_tropical_rio.jpg",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "ovo-tropical-sampa",
        type: "Ovos com Lascas",
        category: "Páscoa",
        title: "Ovo Tropical Sampa",
        subtitle: "Chocolate ao leite 40% cacau com café, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará.",
        description: ["Chocolate ao leite 40% cacau com café, acompanha lascas do mesmo chocolate com castanha de caju e castanha do pará."],
        price: 90.0,
        weight: "300g",
        ingredients: ["Chocolate ao leite 40% cacau", "Café", "Castanha de caju", "Castanha do pará"],
        imgSrc: "/product_imgs/ovo_tropical_sampa.jpg",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "tropical-amazonas-barra",
        type: "Barras",
        category: "Clássicos",
        title: "Barra Tropical Amazonas",
        subtitle: "Chocolate ao leite 45% cacau, com castanha de caju e castanha do pará.",
        description: ["Barra de Chocolate ao leite 45% cacau, com castanha de caju e castanha do pará."],
        price: 40.0,
        weight: "100g",
        ingredients: ["Chocolate ao leite 45%", "Castanha de caju", "Castanha do pará"],
        imgSrc: "/product_imgs/produto_tropical_amazonas_thumb.png",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "tropical-rio-barra",
        type: "Barras",
        category: "Clássicos",
        title: "Barra Tropical Rio",
        subtitle: "Chocolate intenso ao leite 55% cacau, com castanha de caju e castanha do pará.",
        description: ["Barra de Chocolate intenso ao leite 55% cacau, com castanha de caju e castanha do pará."],
        price: 40.0,
        weight: "100g",
        ingredients: ["Chocolate intenso ao leite 55%", "Castanha de caju", "Castanha do pará"],
        imgSrc: "/product_imgs/produto_tropical_rio_thumb.png",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "tropical-minas-barra",
        type: "Barras",
        category: "Clássicos",
        title: "Barra Tropical Minas",
        subtitle: "Chocolate branco 35%, com doce de leite e castanha de caju.",
        description: ["Barra de Chocolate branco 35%, com doce de leite e castanha de caju."],
        price: 40.0,
        weight: "100g",
        ingredients: ["Chocolate branco 35%", "Doce de leite", "Castanha de caju"],
        imgSrc: "/product_imgs/produto_tropical_minas_thumb.png",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "tropical-sampa-barra",
        type: "Barras",
        category: "Clássicos",
        title: "Barra Tropical Sampa",
        subtitle: "Chocolate ao leite 40% cacau com café, com castanha de caju e castanha do pará.",
        description: ["Barra de Chocolate ao leite 40% cacau com café, com castanha de caju e castanha do pará."],
        price: 40.0,
        weight: "100g",
        ingredients: ["Chocolate ao leite 40% cacau com café", "Castanha de caju", "Castanha do pará"],
        imgSrc: "/product_imgs/produto_tropical_sampa_thumb.png",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "tropical-bahia-barra",
        type: "Barras",
        category: "Clássicos",
        title: "Barra Tropical Bahia",
        subtitle: "Chocolate branco 35% com coco e castanha de caju.",
        description: ["Barra de Chocolate branco 35% com coco e castanha de caju."],
        price: 40.0,
        weight: "100g",
        ingredients: ["Chocolate branco 35%", "Coco", "Castanha de caju"],
        imgSrc: "/product_imgs/produto_tropical_bahia_thumb.png",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
    {
        key: "tropical-parana-barra",
        type: "Barras",
        category: "Clássicos",
        title: "Barra Tropical Paraná",
        subtitle: "Chocolate branco 35% com castanha de caju.",
        description: ["Barra de Chocolate branco 35% com castanha de caju."],
        price: 40.0,
        weight: "100g",
        ingredients: ["Chocolate branco 35%", "Castanha de caju"],
        imgSrc: "/product_imgs/produto_tropical_parana_thumb.png",
        size: {
            width: 400,
            height: 400,
        },
        pageLink: "/caminho/para/a/pagina",
    },
];

export default productList;
