import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

import productList from "@/content_lists/product_list";
import Product from "@/types/Product";

import { useSimpleTranslation } from "@/international/useSimpleTranslation";
import { useSelector, useDispatch } from "react-redux";

import { addCartItem } from "@/store/slices/cart";

import { motion as m, AnimatePresence } from "framer-motion";

import Image from "next/image";

import { RootState } from "@/store/store";

export async function getStaticPaths() {
    const paths: { params: { productKey: string }; locale: string }[] = [];

    // Add Portuguese paths
    productList.forEach((product) => {
        paths.push({ params: { productKey: product.key }, locale: "pt-BR" });
    });

    // Add English paths
    productList.forEach((product) => {
        paths.push({ params: { productKey: product.key }, locale: "en" });
    });

    return {
        paths,
        fallback: true,
    };
}

export async function getStaticProps({ params, locale }: { params: { productKey: string }; locale: string }) {
    console.log(`getStaticProps called for locale: ${locale}, expertiseKey: ${params.productKey}`);

    // Log the params and locale
    console.log("params:", params);
    console.log("locale:", locale);

    // Get the data for this page based on params
    const productKey = params.productKey;
    console.log("expertiseKey:", productKey);

    const list = locale === "pt-BR" ? productList : productList;

    const product = list.find((product) => product.key === productKey);

    // Log the expertise
    console.log("product:", product);

    if (!product) {
        console.log("product not found");
        return {
            notFound: true,
        };
    }

    return {
        props: {
            product,
        },
    };
}

export default function ExpertiseDetail({ product }: { product: Product }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const t = useSimpleTranslation();

    const cartItems = useSelector((state: RootState) => state.cart.cartItems);

    const getCartItemAmmount = (itemId: string) => {
        const cartItem = cartItems.find((item) => item.id === itemId);
        return cartItem ? cartItem.quantity : 0;
    };

    const addToCartAction = (item: Product) => {
        dispatch(addCartItem({ cartItemId: item.key, variant: { key: "default", name: "default" } }));
    };

    if (router.isFallback) {
        return <div>Loading...</div>;
    }
    const message = "Olá, eu gostaria de adquirir o seguinte produto: " + product.title + ".";

    function toUrlValidString(str: string) {
        return encodeURIComponent(str);
    }

    // Render the expertise details
    return (
        <>
            <Head>
                <title>{"Tropical Cacau | " + product.title}</title>
                <meta name="description" content={product.subtitle} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} key={product.key}>
                <main className="Page_Wrapper Expertise_Page_Wrapper">
                    <h1 className="Expertise_Page_Title">{product.title}</h1>
                    <div className="Product_Page_Header">
                        <h3 className="Product_Page_Header_Info">{product.weight}</h3>
                        <h3 className="Product_Page_Header_Info">R$ {product.price},00</h3>
                        <h3 className="Product_Page_Header_Info">{product.type}</h3>
                        <h3 className="Product_Page_Header_Info">{product.category}</h3>
                    </div>
                    <div className="Product_Page_Image_Container">
                        {product.imgSrc.map((img, index) => (
                            <>
                                <Image key={index} className="Product_Page_Image" src={img.src} alt={img.alt} width={img.width} height={img.height} />
                                <Image
                                    key={index + "B"}
                                    className="Product_Page_Image"
                                    src={img.src}
                                    alt={img.alt}
                                    width={img.width}
                                    height={img.height}
                                />
                            </>
                        ))}
                    </div>

                    <p className="Product_Page_Description">{product.description}</p>

                    <div className="Expertise_Page_Footer">
                        <button
                            className="Schedule_Btn"
                            onClick={() => {
                                addToCartAction(product);
                            }}
                        >
                            Adicionar à Cesta
                            <span className="material-icons">shopping_basket</span>
                            {getCartItemAmmount(product.key) > 0 ? ` (${getCartItemAmmount(product.key)})` : ""}
                        </button>
                    </div>

                    {product.ingredients && (
                        <>
                            <h3 className="Product_Page_Ingredients_Title">Ingredientes</h3>
                            <div className="Ingredient_List">
                                {product.ingredients.map((ingredient, index) => (
                                    <div className="Ingredient" key={index}>
                                        <h4>{ingredient.name}</h4>
                                        {ingredient.description.map((line, index) => (
                                            <p key={index}>{line}</p>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </m.div>
        </>
    );
}
