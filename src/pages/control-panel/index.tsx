import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc, getDocs, DocumentData, Timestamp, collection, query, where } from "firebase/firestore";
import { useFirebase } from "@/components/FirebaseContext";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import type { CheckoutOrder } from "@/store/slices/cart";

import { useEffect, useState } from "react";

import { OrderItemProps } from "@/components/UserTab";

import { AnimatePresence, motion as m } from "framer-motion";

const businessTelephone = "5541999977955";

const generateWhatsAppURL = (orderNumber: string) => {
    let message = "Olá, eu gostaria de informações sobre o pedido nº:\n\n #" + orderNumber + "\n\n";

    // Encode the message in a URL
    const encodedMessage = encodeURIComponent(message);

    // Return a WhatsApp Click to Chat URL
    return `https://wa.me/${businessTelephone}?text=${encodedMessage}`;
};

const OrderItem: React.FC<OrderItemProps> = ({ order, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [editedOrderStatus, setEditedOrderStatus] = useState("");
    const [orderStatusIsExpanded, setOrderStatusIsExpanded] = useState(false);

    const updateOrderStatus = async (orderID: string, newStatus: string) => {
        const db = getFirestore();
        const projectUID = "WIlxTvYLd20rFopeFTZT"; // Replace with your project's UID
        const orderDocRef = doc(db, `projects/${projectUID}/orders`, orderID);

        let statusUpdate;

        switch (newStatus) {
            case "Aguardando Aprovação":
                statusUpdate = {
                    confirmed: true,
                    waitingPayment: false,
                    inProduction: false,
                    waitingForRetrieval: false,
                    waitingForDelivery: false,
                    delivered: false,
                    cancelled: false,
                };
                break;
            case "Aguardando Pagamento":
                statusUpdate = {
                    confirmed: false,
                    waitingPayment: true,
                    inProduction: false,
                    waitingForRetrieval: false,
                    waitingForDelivery: false,
                    delivered: false,
                    cancelled: false,
                };
                break;
            case "Em Produção":
                statusUpdate = {
                    confirmed: false,
                    waitingPayment: false,
                    inProduction: true,
                    waitingForRetrieval: false,
                    waitingForDelivery: false,
                    delivered: false,
                    cancelled: false,
                };
                break;
            case "Aguardando Retirada":
                statusUpdate = {
                    confirmed: false,
                    waitingPayment: false,
                    inProduction: false,
                    waitingForRetrieval: true,
                    waitingForDelivery: false,
                    delivered: false,
                    cancelled: false,
                };
                break;
            case "Aguardando Entrega":
                statusUpdate = {
                    confirmed: false,
                    waitingPayment: false,
                    inProduction: false,
                    waitingForRetrieval: false,
                    waitingForDelivery: true,
                    delivered: false,
                    cancelled: false,
                };
                break;
            case "Entregue":
                statusUpdate = {
                    confirmed: false,
                    waitingPayment: false,
                    inProduction: false,
                    waitingForRetrieval: false,
                    waitingForDelivery: false,
                    delivered: true,
                    cancelled: false,
                };
                break;
            case "Cancelado":
                statusUpdate = {
                    confirmed: false,
                    waitingPayment: false,
                    inProduction: false,
                    waitingForRetrieval: false,
                    waitingForDelivery: false,
                    delivered: false,
                    cancelled: true,
                };
                break;
            default:
                console.error(`Invalid status: ${newStatus}`);
                return;
        }

        await setDoc(orderDocRef, { status: statusUpdate }, { merge: true });
        console.log(`Order status updated to: ${statusUpdate}`);
    };

    return (
        <div className="User_Order_Item" key={index}>
            <div className="Order_Item_Text">
                <h3 className="User_Info_Label">Cliente</h3>
                <h3 className="User_Order_Number">{order.clientName}</h3>
                <h3 className="User_Info_Label">Pedido Nº</h3>
                <h3 className="User_Order_Number">#{order.orderID}</h3>

                <p className="User_Info_Detail User_Order_Date">
                    {new Intl.DateTimeFormat("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    }).format(order.orderDate.toDate())}
                </p>

                <div className="User_Order_Price">
                    <h4>Valor Total: </h4>
                    <p>
                        R$
                        {order.orderItems.reduce((total, product) => total + product.value * product.quantity, 0)}
                        ,00
                    </p>
                </div>

                <div
                    className="User_Order_Status"
                    onClick={() => {
                        setOrderStatusIsExpanded(!orderStatusIsExpanded);
                    }}
                >
                    <span className="material-icons">edit</span> Atualizar Pedido
                </div>

                {!orderStatusIsExpanded && editedOrderStatus === "" && (
                    <p className="User_Order_Status CP_Order_Status">
                        {order.status.confirmed === true && (
                            <>
                                <span className="material-icons">hourglass_bottom</span>
                                Aguardando Aprovação
                            </>
                        )}
                        {order.status.waitingPayment === true && (
                            <>
                                <span className="material-icons">request_quote</span> Aguardando Pagamento
                            </>
                        )}
                        {order.status.inProduction === true && (
                            <>
                                <span className="material-icons">category</span> Em Produção
                            </>
                        )}
                        {order.status.waitingForRetrieval === true && (
                            <>
                                <span className="material-icons">store</span> Aguardando Retirada
                            </>
                        )}
                        {order.status.waitingForDelivery === true && (
                            <>
                                <span className="material-icons">conveyor_belt</span> Aguardando Entrega
                            </>
                        )}
                        {order.status.delivered === true && (
                            <>
                                <span className="material-icons">markunread_mailbox</span> Entregue
                            </>
                        )}
                        {order.status.cancelled === true && (
                            <>
                                <span className="material-icons">do_not_disturb</span> Cancelado
                            </>
                        )}
                    </p>
                )}

                {!orderStatusIsExpanded && editedOrderStatus !== "" && (
                    <p className="User_Order_Status CP_Order_Status">
                        {editedOrderStatus === "Aguardando Aprovação" && (
                            <>
                                <span className="material-icons">hourglass_bottom</span>
                                Aguardando Aprovação
                            </>
                        )}
                        {editedOrderStatus === "Aguardando Pagamento" && (
                            <>
                                <span className="material-icons">request_quote</span> Aguardando Pagamento
                            </>
                        )}
                        {editedOrderStatus === "Em Produção" && (
                            <>
                                <span className="material-icons">category</span> Em Produção
                            </>
                        )}
                        {editedOrderStatus === "Aguardando Retirada" && (
                            <>
                                <span className="material-icons">store</span> Aguardando Retirada
                            </>
                        )}
                        {editedOrderStatus === "Aguardando Entrega" && (
                            <>
                                <span className="material-icons">conveyor_belt</span> Aguardando Entrega
                            </>
                        )}
                        {editedOrderStatus === "Entregue" && (
                            <>
                                <span className="material-icons">markunread_mailbox</span> Entregue
                            </>
                        )}
                        {editedOrderStatus === "Cancelado" && (
                            <>
                                <span className="material-icons">do_not_disturb</span> Cancelado
                            </>
                        )}
                    </p>
                )}

                {orderStatusIsExpanded && (
                    <div className="CP_Order_Status_Control User_Order_Status">
                        <button
                            className="material-icons CP_Order_Status_Btn"
                            onClick={() => {
                                setOrderStatusIsExpanded(false);
                            }}
                        >
                            cancel
                        </button>
                        <select className="CP_Order_Status_Selector" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                            <option value="">Selecione um novo status</option>
                            <option value="Aguardando Aprovação">Aguardando Aprovação</option>
                            <option value="Aguardando Pagamento">Aguardando Pagamento</option>
                            <option value="Em Produção">Em Produção</option>
                            <option value="Aguardando Retirada">Aguardando Retirada</option>
                            <option value="Aguardando Entrega">Aguardando Entrega</option>
                            <option value="Entregue">Entregue</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                        <button
                            className="material-icons CP_Order_Status_Btn"
                            onClick={() => {
                                setEditedOrderStatus(selectedStatus);
                                setOrderStatusIsExpanded(false);
                                updateOrderStatus(order.orderID, selectedStatus);
                            }}
                        >
                            save
                        </button>
                    </div>
                )}

                <div className="User_Order_Status">
                    <span className="material-icons">support_agent</span> Falar com o Cliente
                </div>
            </div>

            <span
                className={isExpanded ? "material-icons Order_Expand_Btn Active" : "material-icons Order_Expand_Btn"}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                expand_more
            </span>

            <AnimatePresence>
                {isExpanded && (
                    <>
                        <m.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2, ease: [0.43, 0.13, 0.23, 0.96], when: "beforeChildren" }}
                            className="User_Order_Extra_Info"
                        >
                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
                                className="User_Order_Product_List"
                                key={"product-list"}
                            >
                                {order.orderItems.map((product, index) => {
                                    return (
                                        <div key={index} className="User_Order_Product">
                                            <p className="User_Order_Product_Title">{product.translatedTitle}</p>
                                            <p className="User_Order_Product_Qtty">{product.quantity}x</p>
                                            <p className="User_Order_Product_Price">R${product.value},00</p>
                                        </div>
                                    );
                                })}
                            </m.div>

                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
                                className="User_Order_Shipping_Option"
                                key={"shipping-option"}
                            >
                                <h4 className="User_Order_Shipping_Option_Title">Método de Recebimento:</h4>
                                <div className="User_Order_Shipping_Option_Type">
                                    {order.shippingOption === "Entrega" && <span className="material-icons">local_shipping</span>}

                                    {order.shippingOption === "Retirada" && <span className="material-icons">store</span>}
                                    {order.shippingOption}
                                </div>
                            </m.div>
                        </m.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function ControlPanel() {
    const [orderList, setOrderList] = useState<CheckoutOrder[]>([]);
    const sortedOrders = orderList.sort((a, b) => b.orderDate.toMillis() - a.orderDate.toMillis());

    // Fetch all orders for the given user UID
    const fetchOrdersForUser = async (tropicalID: string): Promise<CheckoutOrder[] | undefined> => {
        const db = getFirestore();
        const projectUID = "WIlxTvYLd20rFopeFTZT"; // Replace with your project's UID
        const ordersCollectionRef = collection(db, `projects/${projectUID}/orders`);

        const q = query(ordersCollectionRef, where("clientRef", "==", tropicalID));
        const querySnapshot = await getDocs(q);

        const orders: CheckoutOrder[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as CheckoutOrder;
            if (data) {
                orders.push(data);
            }
        });

        if (orders.length > 0) {
            setOrderList(orders);
        }

        return orders;
    };

    // Fetch all orders
    const fetchAllOrders = async (): Promise<CheckoutOrder[] | undefined> => {
        const db = getFirestore();
        const projectUID = "WIlxTvYLd20rFopeFTZT"; // Replace with your project's UID
        const ordersCollectionRef = collection(db, `projects/${projectUID}/orders`);

        const querySnapshot = await getDocs(ordersCollectionRef);

        const orders: CheckoutOrder[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as CheckoutOrder;
            if (data) {
                orders.push(data);
            }
        });

        if (orders.length > 0) {
            setOrderList(orders);
        }

        return orders;
    };

    useEffect(() => {
        // Fetch all orders
        fetchAllOrders();
    }, []);

    return (
        <main className="Page_Wrapper">
            <div className="Control_Pannel_Container">
                <h1 className="User_Page_Title">Painel de Controle</h1>
                <div className="CP_Orders">
                    <h1 className="User_Page_Title CP_Orders_Title">Pedidos</h1>
                    <div className="CP_Orders_List">
                        {sortedOrders.map((order, index) => (
                            <OrderItem order={order} index={index} key={index} />
                        ))}
                    </div>
                </div>

                <div className="CP_Products">
                    <h2>Produtos</h2>
                    <div className="CP_Products_List">
                        <div className="CP_Product">
                            <h3 className="CP_Product_Name">Produto 1</h3>
                            <p className="CP_Product_Price">R$ 100,00</p>
                            <button className="CP_Product_Edit">Editar</button>
                        </div>
                    </div>
                </div>
                <div className="CP_Customers">
                    <h2>Clientes</h2>
                    <div className="CP_Customers_List">
                        <div className="CP_Customer">
                            <h3 className="CP_Customer_Name">Cliente 1</h3>
                            <p className="CP_Customer_Email">joaotarran@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
