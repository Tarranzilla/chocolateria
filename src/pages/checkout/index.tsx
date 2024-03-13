import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

import { setCartOpen } from "@/store/slices/interface";
import Link from "next/link";

export default function Checkout() {
    const dispatch = useDispatch();
    initMercadoPago("TEST-793c5e04-727f-4f79-9c94-2eec92225301");

    const mercadoPagoSlice = useSelector((state: RootState) => state.mercadoPago);
    const cartSlice = useSelector((state: RootState) => state.cart);

    const closeCartAction = () => {
        dispatch(setCartOpen(false));
    };

    useEffect(() => {
        closeCartAction();
    }, []);

    return (
        <main className="Page_Wrapper Expertise_Page_Wrapper Checkout_Page_Wrapper">
            <div className="Checkout_Card">
                <h2 className="Checkout_Card_OrderNumber">Número do Pedido</h2>
                <h3>{mercadoPagoSlice.preferenceId}</h3>

                <h2 className="Checkout_Card_OrderNumber">Valor Total</h2>
                <h3 className="Checkout_Card_Total">R$ {cartSlice.cartTotal},00</h3>
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
