import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

import { PrecoPrazoRequest, calcularPrecoPrazo, consultarCep, rastrearEncomendas } from "correios-brasil";

import { setCartOpen } from "@/store/slices/interface";

import Head from "next/head";
import Link from "next/link";

import { useSimpleTranslation } from "@/international/useSimpleTranslation";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, DocumentData, Timestamp } from "firebase/firestore";
import { set } from "firebase/database";

const telephone = "5541999977955";

import { CartItem } from "@/store/slices/cart";
import Product from "@/types/Product";

import type { CheckoutOrder } from "@/store/slices/cart";

export type TranslatedCartItem = {
    translatedTitle: string;
    value: number;
    quantity: number;
};

export default function Checkout() {
    const dispatch = useDispatch();

    const cartItems = useSelector((state: RootState) => state.cart.cartItems);
    const cartTotal = useSelector((state: RootState) => state.cart.cartTotal);

    const t = useSimpleTranslation();
    const availableProducts = t.landingPage.sections.products.productsList;

    const [translatedCartItems, setTranslatedCartItems] = useState<TranslatedCartItem[]>([]);

    const mercadoPagoSlice = useSelector((state: RootState) => state.mercadoPago);
    const cartSlice = useSelector((state: RootState) => state.cart);

    const [shippingOption, setShippingOption] = useState<string | null>(null);

    const [precoPrazoRequest, setPrecoPrazoRequest] = useState<PrecoPrazoRequest>({
        sCepOrigem: "80030470",
        sCepDestino: "0000000",
        nVlPeso: "1",
        nCdFormato: "1",
        nVlComprimento: "20",
        nVlAltura: "20",
        nVlLargura: "20",
        nCdServico: ["04510"], // PAC à vista
        nVlDiametro: "0",
    });

    const closeCartAction = () => {
        dispatch(setCartOpen(false));
    };

    const handleOptionChange = (option: string) => {
        setShippingOption(option);
    };

    const [checkoutUser, setCheckoutUser] = useState({
        name: "Anônimo",
        email: "Nenhum email registrado",
        tropicalID: "Tropical ID",
    });

    const [checkoutAdress, setCheckoutAdress] = useState({
        street: "Nenhum Logradouro",
        number: "Nenhum Número",
        extra: "Nenhum Complemento",
        city: "Nenhuma Cidade",
        postalCode: "Nenhum CEP",
    });

    const [registeredUser, setRegisteredUser] = useState(false);

    // Fetch the user's document from Firestore when the user logs in
    const fetchUserAdress = async (uid: string) => {
        const db = getFirestore();
        const projectUID = "WIlxTvYLd20rFopeFTZT"; // Replace with your project's UID
        const userDocRef = doc(db, `projects/${projectUID}/users`, uid);

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            setCheckoutAdress(userDoc.data().address);
        }
    };

    const [cep, setCep] = useState("");
    const [shippingCost, setShippingCost] = useState("0");
    const [observation, setObservation] = useState("");

    const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCep(event.target.value);
        setPrecoPrazoRequest((prevState) => ({
            ...prevState,
            sCepDestino: event.target.value,
        }));
    };

    const handleObservationChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setObservation(event.target.value);
    };

    const handleCalcularPrecoPrazo = () => {
        calcularPrecoPrazo(precoPrazoRequest).then((response) => {
            setShippingCost(response[0].Valor);
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

    const [checkoutOrder, setCheckoutOrder] = useState<CheckoutOrder>();

    const handleCheckout = () => {
        const order: CheckoutOrder = {
            orderID: mercadoPagoSlice.preferenceId,
            orderItems: translatedCartItems,
            orderDate: Timestamp.now(),
            orderType: "whatsapp" || "mercado_pago",

            shippingOption: shippingOption || "Retirada",
            shippingCost: Number(shippingCost),
            observation: observation,
            total: cartTotal,

            clientRef: checkoutUser.tropicalID,
            clientType: registeredUser ? "registered" : "anonymous",
            clientName: checkoutUser.name,
            clientAdress: checkoutAdress.street + ", " + checkoutAdress.number + "( " + checkoutAdress.extra + " )" + " - " + checkoutAdress.city,

            status: {
                confirmed: false,
                waitingPayment: true,
                inProduction: false,
                waitingForRetrieval: false,
                waitingForDelivery: false,
                delivered: false,
                cancelled: false,
            },
        };

        setCheckoutOrder(order);

        const db = getFirestore();
        const projectUID = "WIlxTvYLd20rFopeFTZT"; // Replace with your project's UID
        const ordersCollectionRef = doc(db, `projects/${projectUID}/orders`, mercadoPagoSlice.preferenceId);

        setDoc(ordersCollectionRef, order);
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in");
                setCheckoutUser({
                    name: user.displayName || "Sem Nome",
                    email: user.email || "Sem Email",
                    tropicalID: user.uid,
                });

                fetchUserAdress(user.uid);

                setRegisteredUser(true);
            } else {
                console.log("User is not signed in");
            }
        });

        // Cleanup function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        initMercadoPago(`${process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY}`);
    }, []);

    useEffect(() => {
        if (cartItems.length > 0) {
            const translatedItems = cartItems
                .map((cartItem) => {
                    const product = availableProducts.find((prod) => prod.key === cartItem.id);
                    return {
                        translatedTitle: product?.title || "Produto não encontrado",
                        value: product?.price || 0,
                        quantity: cartItem.quantity,
                    };
                })
                .filter((item) => item !== undefined) as TranslatedCartItem[];

            setTranslatedCartItems(translatedItems);
        }
    }, [cartItems, availableProducts]);

    return (
        <>
            <Head>
                <title>{t.common.customTitle}</title>
                <meta name="description" content={t.common.customDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <meta property="og:title" content={t.common.customTitle} />
                <meta property="og:description" content={t.common.customDescription} />
                <meta property="og:image" content="https://chocolateria.vercel.app/brand_imgs/Icone_512.png" />
                <meta property="og:url" content="https://chocolateria.vercel.app/" />

                <meta name="author" content="https://pragmata.ninja/"></meta>

                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="Page_Wrapper Checkout_Page_Wrapper">
                <div className="Checkout_Card ">
                    <h2 className="Checkout_Card_OrderNumber">Número do Pedido</h2>
                    <h3 className="Checkout_Card_OrderNumber_Content">{mercadoPagoSlice.preferenceId}</h3>
                </div>

                <div className="Checkout_Card ">
                    <h2 className="Checkout_Card_OrderNumber">Itens</h2>

                    {translatedCartItems.map((item, index) => {
                        return (
                            <div className="Checkout_Order_Item" key={index}>
                                <h3 className="Checkout_Order_Item_Name">{item.translatedTitle}</h3>
                                <p className="Checkout_Order_Item_Quantity">x {item.quantity}</p>
                                <p className="Checkout_Order_Item_Price">R$ {item.value.toFixed(2)}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="Checkout_Card">
                    <h2 className="Checkout_Card_OrderNumber">Perfil</h2>
                    <div className="Checkout_User">
                        <span className="material-icons User_No_Image">person_pin</span>
                        <div className="Checkout_User_Info">
                            <h3 className="Checkout_User_Name">{checkoutUser.name}</h3>
                            <p className="Checkout_User_Email">{checkoutUser.email}</p>

                            {!registeredUser && <p>Nenhum endereço registrado</p>}

                            {registeredUser && (
                                <>
                                    <div className="Checkout_User_Adress_Detail">
                                        <p className="Checkout_User_Street">{checkoutAdress.street}</p>
                                        <p className="Checkout_User_Number">{checkoutAdress.number}</p>
                                        <p className="Checkout_User_Complement">{checkoutAdress.extra}</p>
                                    </div>

                                    <p className="Checkout_User_City">{checkoutAdress.city}</p>
                                    <p className="Checkout_User_PostalCode">{checkoutAdress.postalCode}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="Checkout_Card Checkout_Shipping">
                    <h2 className="Checkout_Card_OrderNumber">Como você gostaria de receber o pedido?</h2>
                    <div className="Checkout_Shipping_Options">
                        <div className="Checkout_Shipping_Option" onClick={() => handleOptionChange("Retirada")}>
                            <span className="material-icons Shipping_Icon">store</span>

                            <div className="Shipping_Content">
                                <h3>Retirada</h3>
                                <p>Retire na loja</p>
                            </div>

                            <a href="https://maps.app.goo.gl/xVtMm7faZSJDcnT57" target="_blank" rel="noopener noreferer" className="Shipping_Map_Btn">
                                Ver no Mapa
                            </a>

                            <div className="Shipping_Selector_Frame">
                                {shippingOption === "Retirada" && <span className="material-icons">check_circle</span>}
                            </div>
                        </div>

                        <div
                            className={registeredUser ? "Checkout_Shipping_Option" : "Checkout_Shipping_Option Disabled"}
                            onClick={() => handleOptionChange("Entrega")}
                        >
                            <span className="material-icons Shipping_Icon">local_shipping</span>

                            <div className="Shipping_Content">
                                <h3>Entrega</h3>
                                <p>Receba em casa</p>
                            </div>

                            <div className="Shipping_Selector_Frame">
                                {shippingOption === "Entrega" && <span className="material-icons">check_circle</span>}
                            </div>
                        </div>

                        {!registeredUser && (
                            <p className="Disabled_Shipping_Message">
                                <span className="material-icons">info</span>{" "}
                                <p className="Disabled_Shipping_Text">
                                    <Link href="/usuario" className="Disabled_Shipping_Link">
                                        Faça login ou crie uma conta
                                    </Link>{" "}
                                    para habilitar a entrega!
                                </p>
                            </p>
                        )}

                        {shippingOption === "Entrega" && (
                            <>
                                <div className="Shipping_Costs Card_Subtopic">
                                    <h3>Valor da Entrega</h3>
                                    <p>R$ {shippingCost},00</p>
                                </div>
                            </>
                        )}

                        <div className="Checkout_Observations Card_Subtopic">
                            <h3>Observações</h3>
                            <textarea
                                className="Observation_TextArea"
                                name="observation"
                                onChange={handleObservationChange}
                                placeholder="Caso tenha alguma observação sobre o seu pedido, escreva aqui."
                                value={observation}
                            />
                        </div>
                    </div>
                </div>

                <div className="Checkout_Card Total_Value_Card">
                    <h2 className="Checkout_Card_OrderNumber">Valor Total</h2>
                    <h3 className="Checkout_Card_Total">R$ {cartSlice.cartTotal},00</h3>

                    <Link
                        className="Checkout_Btn"
                        href={generateWhatsAppURL()}
                        onClick={() => {
                            handleCheckout();
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Comprar pelo WhatsApp
                    </Link>

                    <div id="wallet_container" className="Wallet">
                        <Wallet
                            initialization={{ preferenceId: mercadoPagoSlice.preferenceId }}
                            customization={{ texts: { action: "buy", valueProp: "smart_option" } }}
                        />
                    </div>
                </div>

                <Link className="Checkout_Return_Btn" href="/#chocolates">
                    <span className="material-icons">clear</span>
                    Voltar para a Loja
                </Link>
            </main>
        </>
    );
}
