type Product = {
    key: string;
    category: string;
    type: string;
    variant?: string;

    availableForSale: boolean;
    isPromoted: boolean;
    showInStore: boolean;

    stockQtty: number;

    title: string;
    subtitle: string;
    description: string[];
    price: number;
    weight: string;

    ingredients: ProductIngredient[];
    imgSrc: WebImg[];
    pageLink: string;
};

export default Product;

export type Product_Category = {
    key: string;
    name: string;
    types: string[];
};

export type WebImg = {
    src: string;
    alt: string;
    width: number;
    height: number;
};

export type ProductIngredient = {
    key: string;
    name: string;
    description: string[];
};
