import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

import { PrecoPrazoRequest, calcularPrecoPrazo, consultarCep, rastrearEncomendas } from "correios-brasil";

import { setCartOpen } from "@/store/slices/interface";
import Link from "next/link";

import { useSimpleTranslation } from "@/international/useSimpleTranslation";

const telephone = "5541999977955";

export default function Checkout() {
    const dispatch = useDispatch();
    initMercadoPago(`${process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY}`);

    const cartItems = useSelector((state: RootState) => state.cart.cartItems);
    const cartTotal = useSelector((state: RootState) => state.cart.cartTotal);

    const t = useSimpleTranslation();
    const availableProducts = t.landingPage.sections.products.productsList;

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

    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");

    const [cep, setCep] = useState("");

    const [shippingCost, setShippingCost] = useState("0");

    const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStreet(event.target.value);
    };

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumber(event.target.value);
    };

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    };

    const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState(event.target.value);
    };

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

    useEffect(() => {
        if (cep.length === 8) {
            consultarCep(cep).then((response) => {
                setStreet(response.logradouro);
                setCity(response.localidade);
                setState(response.uf);
                setPrecoPrazoRequest((prevState) => ({
                    ...prevState,
                    sCepDestino: cep,
                }));
            });
        }
    }, [cep]);

    return (
        <main className="Page_Wrapper Checkout_Page_Wrapper">
            <div className="Checkout_Card">
                <h2 className="Checkout_Card_OrderNumber">Número do Pedido</h2>
                <h3 className="Checkout_Card_OrderNumber_Content">{mercadoPagoSlice.preferenceId}</h3>
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

                        <div className="Shipping_Selector_Frame">
                            {shippingOption === "Retirada" && <span className="material-icons">check_circle</span>}
                        </div>
                    </div>

                    <div className="Checkout_Shipping_Option" onClick={() => handleOptionChange("Entrega")}>
                        <span className="material-icons Shipping_Icon">local_shipping</span>

                        <div className="Shipping_Content">
                            <h3>Entrega</h3>
                            <p>Receba em casa</p>
                        </div>

                        <div className="Shipping_Selector_Frame">
                            {shippingOption === "Entrega" && <span className="material-icons">check_circle</span>}
                        </div>
                    </div>

                    {shippingOption === "Entrega" && (
                        <>
                            <div className="Shipping_Input_Container">
                                <div className="Shipping_Input_Block">
                                    <input
                                        className="Shipping_Input"
                                        type="text"
                                        name="street"
                                        onChange={handleCepChange}
                                        placeholder="CEP"
                                        required
                                    />
                                    <button className="Shipping_Calc_Btn" onClick={handleCalcularPrecoPrazo}>
                                        Calcular Frete
                                    </button>
                                </div>

                                <div className="Shipping_Input_Block">
                                    <input
                                        className="Shipping_Input"
                                        type="text"
                                        name="street"
                                        onChange={handleStreetChange}
                                        placeholder="Rua"
                                        value={street}
                                        required
                                    />
                                    <input
                                        className="Shipping_Input Number_Input"
                                        type="text"
                                        name="number"
                                        onChange={handleNumberChange}
                                        placeholder="Número"
                                        value={number}
                                        required
                                    />
                                </div>

                                <div className="Shipping_Input_Block">
                                    <input
                                        className="Shipping_Input"
                                        type="text"
                                        name="city"
                                        onChange={handleCityChange}
                                        placeholder="Cidade"
                                        value={city}
                                        required
                                    />
                                    <input
                                        className="Shipping_Input State_Input"
                                        type="text"
                                        name="state"
                                        onChange={handleStateChange}
                                        placeholder="Estado"
                                        value={state}
                                        required
                                    />
                                </div>

                                {shippingOption === "Entrega" && (
                                    <p className="Shipping_Adress_Result">{`${street}, ${number}, ${city}, ${state}`}</p>
                                )}
                            </div>

                            <div className="Shipping_Costs">
                                <h3>Custo da Entrega</h3>
                                <p>R$ {shippingCost},00</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="Checkout_Card">
                <h2 className="Checkout_Card_OrderNumber">Valor Total</h2>
                <h3 className="Checkout_Card_Total">R$ {cartSlice.cartTotal},00</h3>

                <Link className="Checkout_Btn" href={generateWhatsAppURL()} target="_blank" rel="noopener noreferrer">
                    Comprar pelo WhatsApp
                </Link>

                <div id="wallet_container" className="Wallet">
                    <Wallet
                        initialization={{ preferenceId: mercadoPagoSlice.preferenceId }}
                        customization={{ texts: { valueProp: "smart_option" } }}
                    />
                </div>
            </div>

            <Link className="Checkout_Return_Btn" href="/#chocolates">
                <span className="material-icons">clear</span>
                Voltar para a Loja
            </Link>
        </main>
    );
}
