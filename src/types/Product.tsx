type Product = {
    key: string;
    category: string;
    type: string;
    variant?: string;

    title: string;
    subtitle: string;
    description: string[];
    price: number;
    weight: string;

    ingredients: string[];
    imgSrc: string;
    size: {
        width: number;
        height: number;
    };
    pageLink: string;
};

export default Product;

export type Product_Category = {
    key: string;
    name: string;
    types: string[];
};
