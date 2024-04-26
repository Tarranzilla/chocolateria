import { useState, useEffect } from "react";
import Head from "next/head";

import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getAuth, User, signOut, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc, getDocs, DocumentData, Timestamp, collection, query, where } from "firebase/firestore";
import { useFirebase } from "@/components/FirebaseContext";

import { useSimpleTranslation } from "@/international/useSimpleTranslation";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import type { CheckoutOrder } from "@/store/slices/cart";
import { setOrderNeedsUpdate } from "@/store/slices/user";

import Link from "next/link";

import { motion as m, AnimatePresence } from "framer-motion";

const businessTelephone = "5541999977955";

const generateWhatsAppURL = (orderNumber: string) => {
    let message = "Olá, eu gostaria de informações sobre o pedido nº:\n\n #" + orderNumber + "\n\n";

    // Encode the message in a URL
    const encodedMessage = encodeURIComponent(message);

    // Return a WhatsApp Click to Chat URL
    return `https://wa.me/${businessTelephone}?text=${encodedMessage}`;
};

type Address = {
    [key: string]: string;
    city: string;
    street: string;
    number: string;
    extra: string;
    postalCode: string;
};

type Order = {
    number: string;

    orderDate: Timestamp;
    orderType: string;

    clientName: string;
    status: string;
    webhook: string;

    products: OrderProduct[];
};

type OrderProduct = {
    key: string;
    price: number;
    quantity: number;
};

export type OrderItemProps = {
    order: CheckoutOrder;
    index: number;
};

export const OrderItem: React.FC<OrderItemProps> = ({ order, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="User_Order_Item" key={index}>
            <div className="Order_Item_Text">
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

                <p className="User_Order_Status">
                    {Object.values(order.status).every((status) => status === false) && (
                        <>
                            <span className="material-icons">hourglass_bottom</span>
                            Aguardando Aprovação
                        </>
                    )}
                    {order.status.confirmed === true && (
                        <>
                            <span className="material-icons">hourglass_bottom</span>
                            Confirmado
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

                <a
                    href={generateWhatsAppURL(order.orderID)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="User_Order_Status User_Order_Status_Call_Btn"
                >
                    <span className="material-icons">support_agent</span> Solicitar Atendimento
                </a>
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

export default function UserTab() {
    const firebase = useFirebase();
    const dispatch = useDispatch();

    if (!firebase) {
        throw new Error("Firebase context is not available");
    }

    const isUserTabOpen = useSelector((state: RootState) => state.interface.isUserTabOpen);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [telephone, setTelephone] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState(false);

    const [orderList, setOrderList] = useState<CheckoutOrder[]>([]);
    const orderNeedUpdate = useSelector((state: RootState) => state.user.ordersNeedUpdate);

    const [seeMore, setSeeMore] = useState(false);

    const sortedOrders = orderList.sort((a, b) => b.orderDate.toMillis() - a.orderDate.toMillis());

    const displayedOrders = seeMore ? sortedOrders : sortedOrders.slice(0, 3);

    const orderNeedsNoUpdateAction = () => {
        dispatch(setOrderNeedsUpdate(false));
    };

    const [address, setAddress] = useState<Address>({
        city: "",
        street: "",
        number: "",
        extra: "",
        postalCode: "",
    });
    const [editedAddress, setEditedAddress] = useState(address);
    const [isEditing, setIsEditing] = useState({
        city: false,
        street: false,
        number: false,
        extra: false,
        postalCode: false,
    });
    const isSomeAddressEdited = Object.entries(editedAddress).some(([key, value]) => address[key] !== value);

    const handleAddressChange = (field: string, value: string) => {
        setEditedAddress({ ...editedAddress, [field]: value });
    };

    const updateAddress = async () => {
        // Save the new address to Firestore here
        const db = getFirestore();
        const projectUID = "WIlxTvYLd20rFopeFTZT"; // Replace with your project's UID
        const userDocRef = doc(db, `projects/${projectUID}/users`, user!.uid);

        await setDoc(
            userDocRef,
            {
                address: editedAddress,
            },
            { merge: true }
        );

        // Then set the new address and exit edit mode
        setAddress(editedAddress);
    };

    const discardChanges = () => {
        setIsEditing({
            city: false,
            street: false,
            number: false,
            extra: false,
            postalCode: false,
        });
        setEditedAddress(address);
    };

    const signIn = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("User signed in:", result.user);

            if (result.user) {
                const db = getFirestore();
                const projectUID = "WIlxTvYLd20rFopeFTZT"; // Replace with your project's UID
                const userDocRef = doc(db, `projects/${projectUID}/users`, result.user.uid);

                const userDoc = await getDoc(userDocRef);
                if (!userDoc.exists()) {
                    await setDoc(
                        userDocRef,
                        {
                            address: {
                                extra: "No complement",
                                number: "No number",
                                postalCode: "No postal code",
                                street: "No street",
                                city: "No city",
                            },
                            authUID: result.user.uid,
                            email: result.user.email,
                            name: result.user.displayName,
                            isAdmin: false,
                            isMember: false,
                            isOwner: false,
                            telephone: "",
                            avatarURL: result.user.photoURL ? result.user.photoURL : "",
                        },
                        { merge: true }
                    );
                }
            }
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    const signUp = async () => {
        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User signed up:", userCredential.user);

            if (userCredential.user) {
                // Set the displayName
                await updateProfile(userCredential.user, { displayName: "No name" });

                const db = getFirestore();
                const projectUID = "WIlxTvYLd20rFopeFTZT"; // Replace with your project's UID
                const userDocRef = doc(db, `projects/${projectUID}/users`, userCredential.user.uid);

                const userDoc = await getDoc(userDocRef);
                if (!userDoc.exists()) {
                    await setDoc(
                        userDocRef,
                        {
                            address: {
                                extra: "No complement",
                                number: "No number",
                                postalCode: "No postal code",
                                street: "No street",
                                city: "No city",
                            },
                            authUID: userCredential.user.uid,
                            email: userCredential.user.email,
                            name: userCredential.user.displayName,
                        },
                        { merge: true }
                    );
                }
            }
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    const login = async () => {
        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in:", userCredential.user);
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const logout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            console.log("User signed out");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // Fetch the user's document from Firestore when the user logs in
    const fetchUserDoc = async (uid: string) => {
        const db = getFirestore();
        const projectUID = "WIlxTvYLd20rFopeFTZT"; // Replace with your project's UID
        const userDocRef = doc(db, `projects/${projectUID}/users`, uid);

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            setAddress(userDoc.data().address);
            setEditedAddress(userDoc.data().address);
            setTelephone(userDoc.data().telephone);

            if (userDoc.data().isAdmin) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        }
    };

    // Fetch the order document from Firestore with the given order UID
    const fetchOrderDoc = async (orderUID: string): Promise<Order | undefined> => {
        const db = getFirestore();
        const projectUID = "WIlxTvYLd20rFopeFTZT"; // Replace with your project's UID
        const orderDocRef = doc(db, `projects/${projectUID}/orders`, orderUID);

        const orderDoc = await getDoc(orderDocRef);
        if (orderDoc.exists()) {
            const data = orderDoc.data();
            if (data) {
                return {
                    number: data.number,
                    orderDate: data.orderDate,
                    orderType: data.orderType,
                    clientName: data.clientName,
                    status: data.status,
                    webhook: data.webhook,
                    products: data.products,
                } as Order; // assert the data as Order
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

    const t = useSimpleTranslation();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                fetchUserDoc(user.uid);
                fetchOrdersForUser(user.uid);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user && orderNeedUpdate === true) {
            console.log("Fetching new orders for user:", user.uid);
            fetchOrdersForUser(user.uid);
            orderNeedsNoUpdateAction();
        }
    }, [user, orderNeedUpdate]);

    return (
        <>
            <AnimatePresence>
                {isUserTabOpen && (
                    <m.div initial={{ x: -1000 }} animate={{ x: 0 }} exit={{ x: -1000 }} transition={{ duration: 0.5 }} className="UserTab">
                        <div className="UserTab_Content_Wrapper">
                            <h1 className="User_Page_Title">Perfil</h1>
                            {user ? (
                                <>
                                    <div className="User_Container">
                                        {user.photoURL && user.displayName && (
                                            <img className="User_Image" src={user.photoURL} alt={user.displayName} />
                                        )}
                                        {!user.photoURL && <span className="material-icons User_No_Image">person_pin</span>}

                                        <div className="User_Main_Info">
                                            <p className="User_Info_Label">Nome</p>
                                            <p className="User_Info_Detail User_Name">{user.displayName || "Nenhum Nome"}</p>
                                            <p className="User_Info_Label">Email</p>
                                            <p className="User_Info_Detail User_Email">{user.email}</p>
                                            <p className="User_Info_Label">Telefone</p>
                                            <p className="User_Info_Detail User_ID">{telephone}</p>
                                        </div>
                                    </div>

                                    {isAdmin && (
                                        <div className="User_Info_Item Control_Panel_Link">
                                            <Link href="/control-panel">
                                                <h3>Abrir Painel de Controle</h3> <span className="material-icons">tune</span>
                                            </Link>
                                        </div>
                                    )}
                                    <h2 className="User_Adress_Title User_Page_Title">Endereço</h2>
                                    <div className="User_Adress_Info">
                                        <div className="User_Info_Item">
                                            <div className="Info_Item_Text">
                                                <p className="User_Info_Label">Rua</p>
                                                {isEditing.street ? (
                                                    <input
                                                        className="User_Info_Input"
                                                        type="text"
                                                        placeholder="Nova Rua"
                                                        value={editedAddress.street}
                                                        onChange={(e) => handleAddressChange("street", e.target.value)}
                                                    />
                                                ) : (
                                                    <p className="User_Info_Detail User_City">
                                                        {editedAddress.street !== address.street ? `${editedAddress.street}*` : address.street}
                                                    </p>
                                                )}
                                            </div>

                                            {isEditing.street ? (
                                                <span
                                                    className="material-icons"
                                                    onClick={() => {
                                                        setIsEditing({ ...isEditing, street: false });
                                                    }}
                                                >
                                                    save
                                                </span>
                                            ) : (
                                                <span
                                                    className="material-icons"
                                                    onClick={() => {
                                                        setIsEditing({ ...isEditing, street: true });
                                                    }}
                                                >
                                                    edit
                                                </span>
                                            )}
                                        </div>

                                        <div className="User_Info_Item">
                                            <div className="Info_Item_Text">
                                                <p className="User_Info_Label">Número</p>
                                                {isEditing.number ? (
                                                    <input
                                                        className="User_Info_Input"
                                                        type="text"
                                                        placeholder="Novo Número"
                                                        value={editedAddress.number}
                                                        onChange={(e) => handleAddressChange("number", e.target.value)}
                                                    />
                                                ) : (
                                                    <p className="User_Info_Detail User_City">
                                                        {editedAddress.number !== address.number ? `${editedAddress.number}*` : address.number}
                                                    </p>
                                                )}
                                            </div>

                                            {isEditing.number ? (
                                                <span
                                                    className="material-icons"
                                                    onClick={() => {
                                                        setIsEditing({ ...isEditing, number: false });
                                                    }}
                                                >
                                                    save
                                                </span>
                                            ) : (
                                                <span
                                                    className="material-icons"
                                                    onClick={() => {
                                                        setIsEditing({ ...isEditing, number: true });
                                                    }}
                                                >
                                                    edit
                                                </span>
                                            )}
                                        </div>

                                        <div className="User_Info_Item">
                                            <div className="Info_Item_Text">
                                                <p className="User_Info_Label">Complemento</p>
                                                {isEditing.extra ? (
                                                    <input
                                                        className="User_Info_Input"
                                                        type="text"
                                                        placeholder="Novo Complemento"
                                                        value={editedAddress.extra}
                                                        onChange={(e) => handleAddressChange("extra", e.target.value)}
                                                    />
                                                ) : (
                                                    <p className="User_Info_Detail User_City">
                                                        {editedAddress.extra !== address.extra ? `${editedAddress.extra}*` : address.extra}
                                                    </p>
                                                )}
                                            </div>

                                            {isEditing.extra ? (
                                                <span
                                                    className="material-icons"
                                                    onClick={() => {
                                                        setIsEditing({ ...isEditing, extra: false });
                                                    }}
                                                >
                                                    save
                                                </span>
                                            ) : (
                                                <span
                                                    className="material-icons"
                                                    onClick={() => {
                                                        setIsEditing({ ...isEditing, extra: true });
                                                    }}
                                                >
                                                    edit
                                                </span>
                                            )}
                                        </div>

                                        <div className="User_Info_Item">
                                            <div className="Info_Item_Text">
                                                <p className="User_Info_Label">Cidade</p>
                                                {isEditing.city ? (
                                                    <input
                                                        className="User_Info_Input"
                                                        type="text"
                                                        placeholder="Nova Cidade"
                                                        value={editedAddress.city}
                                                        onChange={(e) => handleAddressChange("city", e.target.value)}
                                                    />
                                                ) : (
                                                    <p className="User_Info_Detail User_City">
                                                        {editedAddress.city !== address.city ? `${editedAddress.city}*` : address.city}
                                                    </p>
                                                )}
                                            </div>

                                            {isEditing.city ? (
                                                <span
                                                    className="material-icons"
                                                    onClick={() => {
                                                        setIsEditing({ ...isEditing, city: false });
                                                    }}
                                                >
                                                    save
                                                </span>
                                            ) : (
                                                <span
                                                    className="material-icons"
                                                    onClick={() => {
                                                        setIsEditing({ ...isEditing, city: true });
                                                    }}
                                                >
                                                    edit
                                                </span>
                                            )}
                                        </div>

                                        <div className="User_Info_Item">
                                            <div className="Info_Item_Text">
                                                <p className="User_Info_Label">CEP</p>
                                                {isEditing.postalCode ? (
                                                    <input
                                                        className="User_Info_Input"
                                                        type="text"
                                                        placeholder="Novo CEP"
                                                        value={editedAddress.postalCode}
                                                        onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                                                    />
                                                ) : (
                                                    <p className="User_Info_Detail User_City">
                                                        {editedAddress.postalCode !== address.postalCode
                                                            ? `${editedAddress.postalCode}*`
                                                            : address.postalCode}
                                                    </p>
                                                )}
                                            </div>

                                            {isEditing.postalCode ? (
                                                <span
                                                    className="material-icons"
                                                    onClick={() => {
                                                        setIsEditing({ ...isEditing, postalCode: false });
                                                    }}
                                                >
                                                    save
                                                </span>
                                            ) : (
                                                <span
                                                    className="material-icons"
                                                    onClick={() => {
                                                        setIsEditing({ ...isEditing, postalCode: true });
                                                    }}
                                                >
                                                    edit
                                                </span>
                                            )}
                                        </div>

                                        {isSomeAddressEdited && (
                                            <div className="User_Info_Edit_Control">
                                                <button className="Order_SeeMore_Btn" onClick={discardChanges}>
                                                    <span className="material-icons">delete_forever</span>Descartar Alterações
                                                </button>
                                                <button className="Order_SeeMore_Btn" onClick={updateAddress}>
                                                    Atualizar Informações <span className="material-icons">update</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="User_Adress_Title User_Page_Title">Pedidos</h2>

                                    <div className="User_Order_Info">
                                        {displayedOrders.map((order, index) => {
                                            return <OrderItem key={index} order={order} index={index} />;
                                        })}

                                        <div className="User_Order_SeeMore">
                                            <button
                                                className="Order_SeeMore_Btn"
                                                onClick={() => {
                                                    setSeeMore(!seeMore);
                                                }}
                                            >
                                                {(seeMore && (
                                                    <>
                                                        Ver apenas pedidos recentes
                                                        <span className="material-icons">expand_less</span>
                                                    </>
                                                )) ||
                                                    (!seeMore && (
                                                        <>
                                                            Ver todos os pedidos <span className="material-icons">more_horiz</span>
                                                        </>
                                                    ))}
                                            </button>
                                        </div>
                                    </div>

                                    <button className="User_Btn" onClick={logout}>
                                        <span className="material-icons">logout</span>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="User_Login_Container">
                                    <button onClick={signIn} className="User_Google_Login_Btn">
                                        Faça Login com Google <span className="material-icons">login</span>
                                    </button>
                                    <div className="User_Email_Login">
                                        <input
                                            className="User_Login_Input"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email"
                                        />
                                        <input
                                            className="User_Login_Input Login_Password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Senha"
                                        />
                                        <button className="User_Login_Btn Register_Btn" onClick={signUp}>
                                            Registre uma conta com este Email <span className="material-icons">person_add_alt</span>
                                        </button>
                                        <button className="User_Login_Btn" onClick={login}>
                                            Login com Email <span className="material-icons">login</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
}

/*

    const [image, setImage] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orders = await Promise.all(orderUID_List.map((uid) => fetchOrderDoc(uid)));
                const validOrders = orders.filter((order): order is Order => order !== undefined);
                setOrderList(validOrders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };

        fetchOrders();
    }, [orderUID_List]);


    <div className="User_Order_Item" key={index}>
                                                <div className="Order_Item_Text">
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

                                                    <p className="User_Order_Status">
                                                        {order.status.confirmed === false && (
                                                            <>
                                                                <span className="material-icons">hourglass_bottom</span>
                                                                Aguardando Aprovação
                                                            </>
                                                        )}
                                                        {order.status.confirmed === true && order.status.waitingPayment === true && (
                                                            <>
                                                                <span className="material-icons">request_quote</span> Aguardando Pagamento
                                                            </>
                                                        )}
                                                        {order.status.confirmed === true && order.status.inProduction === true && (
                                                            <>
                                                                <span className="material-icons">category</span> Em Produção
                                                            </>
                                                        )}
                                                        {order.status.confirmed === true && order.status.waitingForRetrieval === true && (
                                                            <>
                                                                <span className="material-icons">store</span> Aguardando Retirada
                                                            </>
                                                        )}
                                                        {order.status.confirmed === true && order.status.waitingForDelivery === true && (
                                                            <>
                                                                <span className="material-icons">conveyor_belt</span> Aguardando Entrega
                                                            </>
                                                        )}
                                                        {order.status.confirmed === true && order.status.delivered === true && (
                                                            <>
                                                                <span className="material-icons">markunread_mailbox</span> Entregue
                                                            </>
                                                        )}
                                                        {order.status.confirmed === true && order.status.cancelled === true && (
                                                            <>
                                                                <span className="material-icons">do_not_disturb</span> Cancelado
                                                            </>
                                                        )}
                                                    </p>

                                                    <a
                                                        href={generateWhatsAppURL(order.orderID)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="User_Order_Status"
                                                    >
                                                        <span className="material-icons">support_agent</span> Solicitar Atendimento
                                                    </a>
                                                </div>

                                                <span className="material-icons Order_Expand_Btn">chevron_right</span>
                                            </div>

*/
