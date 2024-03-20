import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getAuth, User, signOut } from "firebase/auth";
import { useState, useEffect } from "react";

import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default function Usuario() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState<User | null>(null);

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
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    const signUp = async () => {
        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User signed up:", userCredential.user);

            if (userCredential.user && image) {
                const storage = getStorage();
                const storageRef = ref(storage, `profilePictures/${userCredential.user.uid}`);
                await uploadBytes(storageRef, image);

                const db = getFirestore();
                const userDoc = doc(db, "users", userCredential.user.uid);
                await setDoc(userDoc, { photoURL: storageRef.fullPath }, { merge: true });
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

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
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
                                <p className="User_Info_Detail User_Street">Rua das Flores, 123</p>
                            </div>

                            <span className="material-icons">edit</span>
                        </div>

                        <div className="User_Info_Item">
                            <div className="Info_Item_Text">
                                <p className="User_Info_Label">Complemento</p>
                                <p className="User_Info_Detail User_Street">Ap 161B</p>
                            </div>

                            <span className="material-icons">edit</span>
                        </div>

                        <div className="User_Info_Item">
                            <div className="Info_Item_Text">
                                <p className="User_Info_Label">Cidade</p>
                                <p className="User_Info_Detail User_City">São Paulo</p>
                            </div>

                            <span className="material-icons">edit</span>
                        </div>

                        <div className="User_Info_Item">
                            <div className="Info_Item_Text">
                                <p className="User_Info_Label">CEP</p>
                                <p className="User_Info_Detail User_Zip">12345-678</p>
                            </div>

                            <span className="material-icons">edit</span>
                        </div>
                    </div>

                    <h2 className="User_Adress_Title User_Page_Title">Pedidos</h2>

                    <div className="User_Order_Info">
                        <div className="User_Order_Item">
                            <div className="Order_Item_Text">
                                <p className="User_Info_Label">Pedido #12345</p>
                                <p className="User_Info_Detail User_Order_Date">12/12/2024</p>
                            </div>

                            <span className="material-icons">chevron_right</span>
                        </div>

                        <div className="User_Order_Item">
                            <div className="Order_Item_Text">
                                <p className="User_Info_Label">Pedido #12345</p>
                                <p className="User_Info_Detail User_Order_Date">12/12/2023</p>
                            </div>

                            <span className="material-icons">chevron_right</span>
                        </div>

                        <div className="User_Order_Item">
                            <div className="Order_Item_Text">
                                <p className="User_Info_Label">Pedido #12345</p>
                                <p className="User_Info_Detail User_Order_Date">12/12/2022</p>
                            </div>

                            <span className="material-icons">chevron_right</span>
                        </div>

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
    );
}
