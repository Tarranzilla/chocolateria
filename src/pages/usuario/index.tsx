import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getAuth, User, signOut, updateProfile } from "firebase/auth";
import { useState, useEffect } from "react";

import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc, DocumentData, Timestamp } from "firebase/firestore";

import { useFirebase } from "@/components/FirebaseContext";

import Head from "next/head";
import { useSimpleTranslation } from "@/international/useSimpleTranslation";

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

export default function Usuario() {
    const firebase = useFirebase();

    if (!firebase) {
        throw new Error("Firebase context is not available");
    }

    const { auth, firestore, storage } = firebase;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState<User | null>(null);

    const [orderUID_List, setOrderUID_List] = useState<string[]>([]);
    const [orderList, setOrderList] = useState<Order[]>([]);

    const [address, setAddress] = useState<Address>({
        city: "",
        street: "",
        number: "",
        extra: "",
        postalCode: "",
    });

    const [isEditing, setIsEditing] = useState({
        city: false,
        street: false,
        number: false,
        extra: false,
        postalCode: false,
    });

    const [editedAddress, setEditedAddress] = useState(address);
    const [isAddressEdited, setIsAddressEdited] = useState(false);

    const isSomeAddressEdited = Object.entries(editedAddress).some(([key, value]) => address[key] !== value);

    const handleAddressChange = (field: string, value: string) => {
        setEditedAddress({ ...editedAddress, [field]: value });
        setIsAddressEdited(true);
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
        setIsAddressEdited(false);
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
        setIsAddressEdited(false);
    };

    const [image, setImage] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
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

            setOrderUID_List(userDoc.data().orders);
        }
    };

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

    const t = useSimpleTranslation();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                fetchUserDoc(user.uid);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <>
            <Head>
                <title>Perfil | Tropical Cacau</title>
                <meta name="description" content={t.common.customDescription} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <meta property="og:title" content="Perfil | Tropical Cacau" />
                <meta property="og:description" content={t.common.customDescription} />
                <meta property="og:image" content="https://chocolateria.vercel.app/brand_imgs/Icone_TC_512.png" />
                <meta property="og:url" content="https://chocolateria.vercel.app/" />

                <meta name="author" content="https://pragmata.ninja/"></meta>

                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="Page_Wrapper">
                <h1 className="User_Page_Title">Perfil</h1>
                {user ? (
                    <>
                        <div className="User_Container">
                            {user.photoURL && user.displayName && <img className="User_Image" src={user.photoURL} alt={user.displayName} />}
                            {!user.photoURL && <span className="material-icons User_No_Image">person_pin</span>}

                            <div className="User_Main_Info">
                                <p className="User_Info_Label">Nome</p>
                                <p className="User_Info_Detail User_Name">{user.displayName || "Nenhum Nome"}</p>
                                <p className="User_Info_Label">Email</p>
                                <p className="User_Info_Detail User_Email">{user.email}</p>
                                <p className="User_Info_Label">Tropical ID</p>
                                <p className="User_Info_Detail User_ID">{user.uid}</p>
                            </div>
                        </div>
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
                                            setIsAddressEdited(true);
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
                                            setIsAddressEdited(true);
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
                                            setIsAddressEdited(true);
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
                                            setIsAddressEdited(true);
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
                                            {editedAddress.postalCode !== address.postalCode ? `${editedAddress.postalCode}*` : address.postalCode}
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
                                            setIsAddressEdited(true);
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
                            {orderList.map((order, index) => {
                                return (
                                    <div className="User_Order_Item" key={index}>
                                        <div className="Order_Item_Text">
                                            <h3 className="User_Info_Label">Pedido Nº</h3>
                                            <h3 className="User_Order_Number">#{order.number}</h3>

                                            <p className="User_Info_Detail User_Order_Date">
                                                {new Intl.DateTimeFormat("pt-BR", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }).format(order.orderDate.toDate())}
                                            </p>

                                            <p className="User_Order_Status">{order.status === "pending" ? "Aguardando Pagamento" : "Concluído"}</p>
                                        </div>

                                        <p className="User_Order_Price">
                                            R${order.products.reduce((total, product) => total + product.price * product.quantity, 0)},00
                                        </p>

                                        <span className="material-icons">chevron_right</span>
                                    </div>
                                );
                            })}

                            <div className="User_Order_SeeMore">
                                <button className="Order_SeeMore_Btn">
                                    Ver Mais Antigos <span className="material-icons">more_horiz</span>
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
        </>
    );
}
