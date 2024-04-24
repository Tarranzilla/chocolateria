import { NextApiRequest, NextApiResponse } from "next";
import admin, { ServiceAccount } from "firebase-admin";
import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";

if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("The FIREBASE_PRIVATE_KEY environment variable is not defined");
}

const serviceAccount: admin.ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

// SDK do Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pragmatas-dev.firebaseio.com",
});

// Função para gerar um ID de pedido - Leitura Intensa, talvez devemos apenas gerar um UUID
function generateOrderID() {
    let customOrderID = uuidv4();
    console.log(customOrderID);
    return customOrderID;
}

async function incrementCounter() {
    const firestore = admin.firestore();
    const projectUID = "WIlxTvYLd20rFopeFTZT";
    const counterRef = firestore.doc(`projects/${projectUID}/metadata/counter`);

    await firestore.runTransaction(async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        const newCount = (counterDoc.data()?.count ?? 0) + 1;

        transaction.update(counterRef, { count: newCount });
    });
}

// Adicione as credenciais
const client = new MercadoPagoConfig({ accessToken: "TEST-5866109528270009-031110-5662bc4f630f78b04519adecead1b55b-201803820" });

export default function preferenceHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        let cartItems = req.body.map((item: any) => ({
            title: item.id,
            unit_price: item.price,
            quantity: item.quantity,
        }));

        // console.log(cartItems);
        const preference = new Preference(client);
        const customID = generateOrderID();

        preference
            .create({
                body: {
                    items: cartItems,
                    back_urls: {
                        success: "https://chocolateria.vercel.app/checkout_mp_success",
                        failure: "https://chocolateria.vercel.app/checkout_mp_failure",
                        pending: "https://chocolateria.vercel.app/checkout_mp_pending",
                    },
                    external_reference: customID,
                },
            })
            .then(function (response) {
                console.log(response.id);
                console.log("full response:", response);
                res.json({
                    id: response.id,
                    custom_reference: customID,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    } else if (req.method === "GET") {
        res.status(200).send("OK");
    } else {
        // Handle any other HTTP method
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
