import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc, getDocs, DocumentData, Timestamp, collection, query, where } from "firebase/firestore";
import { useFirebase } from "@/components/FirebaseContext";

import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getAuth, User, signOut, updateProfile } from "firebase/auth";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import type { CheckoutOrder } from "@/store/slices/cart";

import { useEffect, useState } from "react";

import { OrderItemProps } from "@/components/UserTab";

import { AnimatePresence, motion as m } from "framer-motion";
import { set } from "firebase/database";

type UserType = {
    address: {
        street: string;
        postalCode: string;
        city: string;
        number: string;
        extra: string;
    };
    telephone: string;
    authUID: string;
    email: string;
    isAdmin: boolean;
    isOwner: boolean;
    isMember: boolean;
    name: string;
};

type ProductType = {
    availableForSale: boolean;
    category: string;
    description: string[];
    imgSrc: any[]; // Replace with the actual type
    ingredients: any[]; // Replace with the actual type
    isPromoted: boolean;
    key: string;
    pageLink: string;
    price: number;
    showInStore: boolean;
    stockQtty: number;
    subtitle: string;
    title: string;
    type: string;
    weight: string;
};

const businessTelephone = "5541999977955";

const generateWhatsAppURL = (orderNumber: string) => {
    let message = "Olá, eu gostaria de informações sobre o pedido nº:\n\n #" + orderNumber + "\n\n";

    // Encode the message in a URL
    const encodedMessage = encodeURIComponent(message);

    // Return a WhatsApp Click to Chat URL
    return `https://wa.me/${businessTelephone}?text=${encodedMessage}`;
};

const CP_OrderItem: React.FC<OrderItemProps> = ({ order, index }) => {
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
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const [productsList, setProductsList] = useState<ProductType[]>([]);

    const [usersList, setUsersList] = useState<UserType[]>([]);

    const [orderList, setOrderList] = useState<CheckoutOrder[]>([]);
    const sortedOrders = orderList.sort((a, b) => b.orderDate.toMillis() - a.orderDate.toMillis());

    // Fetch the user's document from Firestore when the user logs in
    const fetchUserDoc = async (uid: string) => {
        const db = getFirestore();
        const projectUID = "WIlxTvYLd20rFopeFTZT"; // Replace with your project's UID
        const userDocRef = doc(db, `projects/${projectUID}/users`, uid);

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            console.log("User document data:", userDoc.data());

            if (userDoc.data().isAdmin === true) {
                console.log("User is an admin");
                setIsAdmin(true);
            } else {
                console.log("User is not an admin");
                setIsAdmin(false);
            }
        }
    };

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

    const fetchAllUsers = async (): Promise<UserType[] | undefined> => {
        const db = getFirestore();
        const projectUID = "WIlxTvYLd20rFopeFTZT"; // Replace with your project's UID
        const usersCollectionRef = collection(db, `projects/${projectUID}/users`);

        const querySnapshot = await getDocs(usersCollectionRef);

        const users: UserType[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data() as UserType;
            if (data) {
                users.push(data);
            }
        });

        setUsersList(users);
        console.log("Users list:", users);

        return users;
    };

    const fetchAllProducts = async () => {
        const db = getFirestore();
        const projectUID = "WIlxTvYLd20rFopeFTZT"; // Replace with your project's UID
        const productsCollectionRef = collection(db, `projects/${projectUID}/products`);

        const querySnapshot = await getDocs(productsCollectionRef);

        const products: ProductType[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data() as ProductType;
            if (data) {
                products.push(data);
            }
        });

        setProductsList(products);
        console.log("Products list:", products);
        return products;
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                fetchUserDoc(user.uid);
                fetchOrdersForUser(user.uid);
            } else {
                // User is unsubscribed or not logged in
                setIsAdmin(false);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Fetch all orders
        fetchAllOrders();
        fetchAllUsers();
        fetchAllProducts();
    }, []);

    return (
        <main className="Page_Wrapper">
            <div className="Control_Pannel_Container">
                <h1 className="User_Page_Title">Painel de Controle</h1>

                {!isAdmin && <h2>Apenas Administradores têm acesso à estas funcionalidades.</h2>}

                {isAdmin && (
                    <>
                        <div className="CP_Orders">
                            <h1 className="User_Page_Title CP_Orders_Title">Pedidos</h1>
                            <div className="CP_Orders_List">
                                {sortedOrders.map((order, index) => (
                                    <CP_OrderItem order={order} index={index} key={index} />
                                ))}
                            </div>
                        </div>

                        <div className="CP_Products">
                            <h1 className="User_Page_Title CP_Orders_Title">Produtos</h1>
                            <div className="CP_Products_List">
                                {productsList.map((product, index) => (
                                    <div className="CP_Product" key={product.title}>
                                        <img src={product.imgSrc[0].src} alt={product.title} className="CP_Product_Img" />
                                        <div className="CP_Product_Info">
                                            <h3 className="CP_Product_Name">{product.title}</h3>
                                            <p className="CP_Product_Price">R$ {product.price},00</p>
                                            <button className="CP_Product_Edit">
                                                Editar <span className="material-icons CP_Product_Edit_Icon">edit</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="CP_Customers">
                            <h1 className="User_Page_Title CP_Orders_Title">Clientes</h1>
                            <div className="CP_Customers_List">
                                {usersList.map((user, index) => (
                                    <div className="CP_Customer" key={user.name + index}>
                                        <span className="material-icons User_No_Image">person_pin</span>

                                        <div className="CP_Customer_Info">
                                            <h3 className="CP_Customer_Name">{user.name}</h3>
                                            <p className="CP_Customer_Email">{user.telephone}</p>
                                            <p className="CP_Customer_Email">{user.email}</p>
                                            {user.isAdmin && (
                                                <p className="CP_Customer_Admin">
                                                    {" "}
                                                    <span className="material-icons CP_Customer_Admin_Status_Icon">star</span>Admin
                                                </p>
                                            )}
                                            {user.isOwner && (
                                                <p className="CP_Customer_Admin">
                                                    <span className="material-icons CP_Customer_Admin_Status_Icon">gavel</span>Proprietário
                                                </p>
                                            )}
                                            {!user.isAdmin && !user.isOwner && (
                                                <p className="CP_Customer_Admin">
                                                    {" "}
                                                    <span className="material-icons">emoji_emotions</span>Cliente
                                                </p>
                                            )}
                                            {user.isMember && (
                                                <p className="CP_Customer_Admin">
                                                    {" "}
                                                    <span className="material-icons CP_Customer_Admin_Status_Icon">loyalty</span>Assinante
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
