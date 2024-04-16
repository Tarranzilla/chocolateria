import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import Product from "@/types/Product";

import { addCartItem, removeCartItem, decrementCartItem } from "@/store/slices/cart";
import { setCartOpen } from "@/store/slices/interface";
import { setPreferenceId } from "@/store/slices/mercado_pago";

import { useRouter } from "next/router";
import Link from "next/link";

import { useSimpleTranslation } from "@/international/useSimpleTranslation";

import { motion as m, AnimatePresence } from "framer-motion";

import Image from "next/image";

const telephone = "5541999977955";

export default function Cart() {
    const [generalLoading, setGeneralLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();

    const isCartOpen = useSelector((state: RootState) => state.interface.isCartOpen);

    const closeCartAction = () => {
        dispatch(setCartOpen(false));
    };

    const cartItems = useSelector((state: RootState) => state.cart.cartItems);
    const cartTotal = useSelector((state: RootState) => state.cart.cartTotal);

    const t = useSimpleTranslation();
    const availableProducts = t.landingPage.sections.products.productsList;

    const cartItemIds = cartItems.map((item) => item.id);
    const translatedCartItems = availableProducts.filter((product) => cartItemIds.includes(product.key));

    const setPreferenceIdAction = (value: string) => {
        dispatch(setPreferenceId(value));
    };

    const handleMercadoClick = () => {
        console.log("Mercado Pago Clicked");

        if (cartItems.length < 1) {
            console.log("No items in cart, no purchase will happen.");
            return;
        }

        setPaymentLoading(true);

        fetch(`${process.env.NEXT_PUBLIC_MERCADO_PAGO_CREATE_PREFERENCE_API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cartItems),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then((data) => {
                if (data) {
                    const preference = JSON.parse(data);
                    setPreferenceIdAction(preference.id);
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                closeCartAction();
                setPaymentLoading(false);
                router.push("/checkout");
            });
    };

    const generateWhatsAppURL = () => {
        let message = "Olá, tenho interesse em adquirir os seguintes itens:\n\n";

        cartItems.forEach((cartItem) => {
            let product;
            for (const prod of availableProducts) {
                if (prod.key === cartItem.id) {
                    product = prod;
                    break;
                }
            }
            if (product) {
                message += `${cartItem.quantity}X ${product.title}\n`;
            }
        });

        message += `\nTotal = ${cartTotal.toFixed(2)}`;

        // Encode the message in a URL
        const encodedMessage = encodeURIComponent(message);

        // Return a WhatsApp Click to Chat URL
        return `https://wa.me/${telephone}?text=${encodedMessage}`;
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    key={"Shopping_Cart"}
                    className="Shopping_Cart"
                >
                    <div className="Cart_Header">
                        <h1 className="Cart_Title">Lista de Compras</h1>
                    </div>

                    {(generalLoading || paymentLoading) && (
                        <div className="Cart_Loader">
                            <Image className="Intro_Image" src={"/brand_imgs/Icone_TC_512.png"} alt="Logo" width={400} height={400} />
                            {generalLoading && <p className="Cart_Loader_Text">Carregando ...</p>}
                            {paymentLoading && <p className="Cart_Loader_Text">Carregando Pedido...</p>}
                        </div>
                    )}

                    <div className="Cart_List_Container">
                        {cartItems.length < 1 && (
                            <div className="Empty_Cart_Message">
                                <p>Seu carrinho está vazio no momento, adicione itens da loja para poder realizar pedidos!</p>
                            </div>
                        )}

                        {translatedCartItems.length > 0 && (
                            <div className="Cart_List">
                                {translatedCartItems.map((item, index) => {
                                    return (
                                        <div key={index} className="Cart_List_Item">
                                            <div className="Cart_Item_Content">
                                                <div className="Cart_Item_Image_Container">
                                                    <img className="Cart_Item_Image" src={item.imgSrc[0].src} alt={item.title} />
                                                </div>
                                                <div className="Cart_Item_Details">
                                                    <h2 className="Cart_Item_Title">{item.title}</h2>
                                                    <p className="Cart_Item_Price">R$ {item.price},00</p>
                                                    <p className="Cart_Item_Weight">{item.weight}</p>
                                                </div>
                                            </div>
                                            <div className="Cart_Item_Actions">
                                                <button
                                                    className="Cart_Item_Action_Btn"
                                                    onClick={() =>
                                                        dispatch(
                                                            removeCartItem({ cartItemId: item.key, variant: { key: "default", name: "default" } })
                                                        )
                                                    }
                                                >
                                                    <span className="material-icons">clear</span>
                                                    Remover
                                                </button>

                                                <div className="Cart_Item_Actions_Counter">
                                                    <button
                                                        className="Cart_Item_Action_Btn Cart_Item_Action_Circle_Btn"
                                                        onClick={() =>
                                                            dispatch(
                                                                decrementCartItem({
                                                                    cartItemId: item.key,
                                                                    variant: { key: "default", name: "default" },
                                                                })
                                                            )
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                    <span className="Cart_Item_Quantity">{cartItems[index].quantity}</span>
                                                    <button
                                                        className="Cart_Item_Action_Btn Cart_Item_Action_Circle_Btn"
                                                        onClick={() =>
                                                            dispatch(
                                                                addCartItem({ cartItemId: item.key, variant: { key: "default", name: "default" } })
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="Cart_List_Footer">
                        <div className="Cart_Total_Container">
                            <h3 className="Cart_Total_Label">Valor Total de</h3>
                            <h3 className="Cart_Total_Value">R$ {cartTotal},00</h3>
                        </div>

                        <div className="Cart_Payment_Container">
                            {cartItems.length > 0 ? (
                                <>
                                    <button className="Cart_Checkout_Btn" onClick={handleMercadoClick}>
                                        Finalizar Pedido
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="Cart_Checkout_Btn Disabled" disabled>
                                        Finalizar Pedido
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </m.div>
            )}
        </AnimatePresence>
    );
}
