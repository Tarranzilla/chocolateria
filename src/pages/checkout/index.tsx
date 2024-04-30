import { useEffect, useState } from "react";

import Head from "next/head";
import Link from "next/link";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setCartOpen, setUserTabOpen } from "@/store/slices/interface";
import { setOrderNeedsUpdate } from "@/store/slices/user";
import { clearCart } from "@/store/slices/cart";

import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { PrecoPrazoRequest, calcularPrecoPrazo, consultarCep, rastrearEncomendas } from "correios-brasil";

import { useSimpleTranslation } from "@/international/useSimpleTranslation";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, DocumentData, Timestamp } from "firebase/firestore";
import { set } from "firebase/database";

import { PreferenceOnInitialization } from "@mercadopago/sdk-react/bricks/wallet/types";

import Product from "@/types/Product";
import { CartItem } from "@/store/slices/cart";
import type { CheckoutOrder } from "@/store/slices/cart";
import mercado_pago from "@/store/slices/mercado_pago";

const telephone = "5541999977955";
const cepOrigem = "80030470";

const defaultShippingObject = {
    peso: "1",
    formato: "1",
    comprimento: "20",
    altura: "20",
    largura: "20",
    diametro: "0",
};

export type TranslatedCartItem = {
    translatedTitle: string;
    value: number;
    quantity: number;
};

export default function Checkout() {
    const dispatch = useDispatch();

    const [mpWalletLoaded, setMpWalletLoaded] = useState(false);

    const closeCartAction = () => {
        dispatch(setCartOpen(false));
    };

    const clearCartAction = () => {
        dispatch(clearCart());
    };

    const openUserTabAction = () => {
        dispatch(setUserTabOpen(true));
    };

    const t = useSimpleTranslation();
    const availableProducts = t.landingPage.sections.products.productsList;
    const mercadoPagoSlice = useSelector((state: RootState) => state.mercadoPago);

    const cartSlice = useSelector((state: RootState) => state.cart);
    const cartItems = useSelector((state: RootState) => state.cart.cartItems);
    const cartTotal = useSelector((state: RootState) => state.cart.cartTotal);
    const [translatedCartItems, setTranslatedCartItems] = useState<TranslatedCartItem[]>([]);

    const [registeredUser, setRegisteredUser] = useState(false);
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

    const [shippingOption, setShippingOption] = useState<string | null>("Retirada");
    const handleOptionChange = (option: string) => {
        setShippingOption(option);
    };

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

    const [shippingCost, setShippingCost] = useState("0");
    const [observation, setObservation] = useState("");

    const handleObservationChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setObservation(event.target.value);
    };

    const [checkoutOrder, setCheckoutOrder] = useState<CheckoutOrder>();
    const [orderIsPlaced, setOrderIsPlaced] = useState(false);

    const orderNeedsUpdateAction = () => {
        dispatch(setOrderNeedsUpdate(true));
    };

    const handleCheckout = (orderType: string, preferenceID?: string, custom_reference?: string) => {
        let validPreferenceID;

        if (preferenceID) {
            validPreferenceID = preferenceID;
        } else {
            validPreferenceID = mercadoPagoSlice.preferenceId;
        }

        let customReference;

        if (custom_reference) {
            customReference = custom_reference;
        } else {
            customReference = validPreferenceID;
        }

        const order: CheckoutOrder = {
            orderID: customReference,
            customReference: customReference,
            orderItems: translatedCartItems,
            orderDate: Timestamp.now(),
            orderType: orderType,

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
                waitingPayment: false,
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
        const ordersCollectionRef = doc(db, `projects/${projectUID}/orders`, customReference);

        setDoc(ordersCollectionRef, order);

        console.log("Order has been placed and the user tab is signaled to update");
        orderNeedsUpdateAction();

        setOrderIsPlaced(true);
        clearCartAction();
    };

    const onSubmitTest = async () => {
        // callback called when clicking on Wallet Brick
        // this is possible because Brick is a button
    };

    // Gerar a Preferência do Mercado Pago
    const handleMercadoClick = async () => {
        console.log("Mercado Pago Clicked");

        if (cartItems.length < 1) {
            console.log("No items in cart, no purchase will happen.");
            return;
        }

        // setPaymentLoading(true);
        return new Promise((resolve, reject) => {
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
                        console.log("Mercado Pago Preference Created");
                        console.log("preferencia: ", preference);
                        console.log("preferencia.id: ", preference.id);
                        console.log("preferencia.external_reference: ", preference.custom_reference);

                        handleCheckout("mercado_pago", preference.id, preference.custom_reference);
                        resolve(preference.id);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject();
                })
                .finally(() => {
                    console.log("end of promise");
                });
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

        // Add shipping option and observation to the message
        message += `\n\nOpção de envio: ${shippingOption}`;
        if (shippingOption === "Entrega") {
            const checkoutAddressString = `Logradouro: ${checkoutAdress.street}, Número: ${checkoutAdress.number}, Complemento: ${checkoutAdress.extra}, Cidade: ${checkoutAdress.city}, CEP: ${checkoutAdress.postalCode}`;
            message += `\nEndereço de entrega: ${checkoutAddressString}`;
        }
        message += `\n\nObservação: ${observation}`;

        // Encode the message in a URL
        const encodedMessage = encodeURIComponent(message);

        // Return a WhatsApp Click to Chat URL
        return `https://wa.me/${telephone}?text=${encodedMessage}`;
    };

    useEffect(() => {
        // Initialize Mercado Pago SDK
        if (process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY !== undefined) {
            initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY);
        }

        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCheckoutUser({
                    name: user.displayName || "Sem Nome",
                    email: user.email || "Sem Email",
                    tropicalID: user.uid,
                });

                fetchUserAdress(user.uid);
                setRegisteredUser(true);
                console.log("User is signed in");
            } else {
                console.log("User is not signed in");
                setCheckoutUser({ name: "Anônimo", email: "Nenhum email registrado", tropicalID: "Tropical ID" });
                setRegisteredUser(false);
            }
        });

        // Cleanup function to unsubscribe from the listener when the component unmounts
        return () => {
            unsubscribe();
            // window.walletBrickController.unmount()
        };
    }, []);

    useEffect(() => {
        if (cartItems.length > 0) {
            const translatedItems = cartItems
                .map((cartItem) => {
                    const product = availableProducts.find((prod) => prod.key === cartItem.id);
                    return {
                        translatedTitle: product?.title || "Produto não encontrado",
                        value: product?.price || 0,
                        quantity: cartItem.quantity || 0,
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
                {orderIsPlaced ? (
                    <>
                        <div className="Checkout_Card Order_Placed_Card">
                            <h2 className="Checkout_Card_OrderNumber">Pedido Realizado!</h2>
                            <h3 className="Checkout_Card_OrderNumber_Content">Seu pedido foi registrado com sucesso!</h3>

                            <p className="">
                                <strong>Para confirmar o seu pedido é necessário entrar em contato com nossa equipe pelo whatsapp!</strong>
                            </p>
                            <p className="">
                                Você pode acompanhar o andamento deste e de outros pedidos pela <strong>Aba do Cliente</strong>
                            </p>

                            <p className="">Você também receberá um email com as informações do pedido após a confirmação e o pagamento.</p>
                        </div>

                        <button className="Checkout_Return_Btn" onClick={openUserTabAction}>
                            Abrir Aba do Cliente
                            <span className="material-icons">person_pin</span>
                        </button>
                    </>
                ) : (
                    <>
                        <div className="Checkout_Card ">
                            <h2 className="Checkout_Card_OrderNumber">Número do Pedido</h2>
                            <h3 className="Checkout_Card_OrderNumber_Content">{mercadoPagoSlice.preferenceId}</h3>
                        </div>

                        <div className="Checkout_Card_Wrapper">
                            <div className="Checkout_Card ">
                                <h2 className="Checkout_Card_OrderNumber">Itens</h2>

                                {cartItems.length > 0 &&
                                    translatedCartItems.map((item, index) => {
                                        return (
                                            <div className="Checkout_Order_Item" key={index}>
                                                <h3 className="Checkout_Order_Item_Name">{item.translatedTitle}</h3>
                                                <p className="Checkout_Order_Item_Quantity">x {item.quantity}</p>
                                                <p className="Checkout_Order_Item_Price">R$ {item.value.toFixed(2)}</p>
                                            </div>
                                        );
                                    })}

                                {cartItems.length === 0 && <p className="Empty_Cart_Message">Seu carrinho está vazio!</p>}
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
                        </div>

                        <div className="Checkout_Card_Wrapper">
                            <div className="Checkout_Card Checkout_Shipping">
                                <h2 className="Checkout_Card_OrderNumber">Opções de Recebimento</h2>
                                <div className="Checkout_Shipping_Options">
                                    <div className="Checkout_Shipping_Option" onClick={() => handleOptionChange("Retirada")}>
                                        <span className="material-icons Shipping_Icon">store</span>

                                        <div className="Shipping_Content">
                                            <h3>Retirada</h3>
                                            <p>Retire na loja</p>
                                        </div>

                                        <a
                                            href="https://maps.app.goo.gl/xVtMm7faZSJDcnT57"
                                            target="_blank"
                                            rel="noopener noreferer"
                                            className="Shipping_Map_Btn"
                                        >
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
                                        <div className="Disabled_Shipping_Message">
                                            <span className="material-icons">info</span>{" "}
                                            <p className="Disabled_Shipping_Text">
                                                <button className="Disabled_Shipping_Link" onClick={openUserTabAction}>
                                                    Faça login ou crie uma conta
                                                </button>{" "}
                                                para habilitar a entrega!
                                            </p>
                                        </div>
                                    )}

                                    {shippingOption === "Entrega" && (
                                        <>
                                            <div className="Shipping_Costs Card_Subtopic">
                                                <h4 className="Shipping_Detail_Info_Title">
                                                    <span className="material-icons">info</span> Valor da Entrega
                                                </h4>
                                                <p className="Shipping_Detail_Info">Os custos de entrega variam dependendo de sua localização.</p>
                                                <p className="Shipping_Detail_Info">
                                                    Para entregas em Curitiba e Região Metropolitana a média é de 15,00 a 30,00 reais. Já para
                                                    entregas interestaduais e internacionais estes valores podem ser mais elevados.
                                                </p>
                                                <p className="Shipping_Detail_Info">
                                                    Após a finalização da compra entraremos em contato para lhe repassar o valor e combinar a data.
                                                </p>
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
                                    className={cartItems.length > 0 ? "Checkout_Btn" : "Checkout_Btn Disabled"}
                                    href={generateWhatsAppURL()}
                                    onClick={() => {
                                        handleCheckout("whatsapp");
                                    }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Comprar pelo WhatsApp
                                </Link>

                                <div id="wallet_container" className={cartItems.length > 0 ? "Wallet" : "Wallet Disabled"}>
                                    <Wallet
                                        initialization={{ redirectMode: "modal" }}
                                        customization={{ texts: { action: "buy", valueProp: "smart_option" } }}
                                        onSubmit={handleMercadoClick}
                                        onReady={() => {
                                            setMpWalletLoaded(true);
                                            console.log("Wallet ready");
                                        }}
                                        locale="pt-BR"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <Link className="Checkout_Return_Btn" href="/#chocolates">
                    <span className="material-icons">arrow_back</span>
                    Voltar para a Loja
                </Link>
            </main>
        </>
    );
}

/*
    // Correios API
    const [cep, setCep] = useState("");

    const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCep(event.target.value);
        setPrecoPrazoRequest((prevState) => ({
            ...prevState,
            sCepDestino: event.target.value,
        }));
    };


        const handleCalcularPrecoPrazo = () => {
        calcularPrecoPrazo(precoPrazoRequest).then((response) => {
            setShippingCost(response[0].Valor);
        });
    };

  
    const [precoPrazoRequest, setPrecoPrazoRequest] = useState<PrecoPrazoRequest>({
        sCepOrigem: "80030470",
        sCepDestino: "0000000",
        nCdServico: ["04510"], // PAC à vista
        nVlPeso: defaultShippingObject.peso,
        nCdFormato: defaultShippingObject.formato,
        nVlComprimento: defaultShippingObject.comprimento,
        nVlAltura: defaultShippingObject.altura,
        nVlLargura: defaultShippingObject.largura,
        nVlDiametro: defaultShippingObject.diametro,
    });

*/
