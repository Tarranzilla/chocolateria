import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import admin from "firebase-admin";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Inicialize o Firebase Admin SDK com as credenciais do seu projeto
// Certifique-se de configurar as variáveis de ambiente ou o arquivo de configuração do Firebase antes disso.

const firebaseConfig = {
    apiKey: "AIzaSyDeiia7aGI9U1c-IYIUEgaIlh2fvXyIJ8g",
    authDomain: "pragmatas-dev.firebaseapp.com",
    projectId: "pragmatas-dev",
    storageBucket: "pragmatas-dev.appspot.com",
    messagingSenderId: "378425065259",
    appId: "1:378425065259:web:9b729d86bae46f5cdf0f6e",
    measurementId: "G-1RVSKZH43N",
};

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: "https://pragmatas-dev.firebaseio.com",
});

const secret = process.env.MERCADO_PAGO_WEBHOOK_TEST_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { body, headers } = req;

        if (typeof headers["x-signature"] === "string") {
            const [ts, signature] = headers["x-signature"].split(",");

            // Criar um template com os dados recebidos na notificação
            const signatureTemplate = `id:${body.data.id_url};request-id:${headers["x-request-id"]};ts:${ts}`;

            if (typeof secret === "string") {
                const generatedSignature = crypto.createHmac("sha256", secret).update(signatureTemplate).digest("hex");

                // Comparar a chave gerada com a chave extraída do cabeçalho
                if (signature === generatedSignature) {
                    // A assinatura é válida, agora você pode processar os dados e salvá-los no Firebase
                    const firestore = admin.firestore();
                    const projectUID = "WIlxTvYLd20rFopeFTZT"; // Replace with your project's UID
                    const orderUID = body.data.id;
                    const ordersCollectionRef = firestore.collection(`projects/${projectUID}/orders`);

                    switch (body.type) {
                        case "payment":
                            // Handle payment notification
                            const payment = body.data;

                            const orderData = {
                                mp_data: payment,
                            };

                            await ordersCollectionRef.doc(orderUID).set(orderData, { merge: true });
                            break;
                        case "plan":
                            // Handle plan notification
                            // Example: const plan = body.data;
                            break;
                        case "subscription":
                            // Handle subscription notification
                            // Example: const subscription = body.data;
                            break;
                        // Add more cases for other notification types as needed
                        default:
                            // Unknown notification type
                            // Log or handle the error
                            console.error("Unknown notification type:", body.type);
                            break;
                    }

                    // Responder ao Mercado Pago (se necessário)
                    res.status(200).json({ success: true });
                } else {
                    // A assinatura é inválida
                    res.status(401).json({ error: "Unauthorized" });
                }
            } else {
                // handle the case where secret is undefined
                res.status(500).json({ error: "Internal Server Error - Undefined secret" });
            }
        } else {
            // Método não permitido
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } else {
        // handle the case where headers['x-signature'] is an array of strings
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
