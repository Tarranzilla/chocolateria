import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import admin, { ServiceAccount } from "firebase-admin";

// Inicialize o Firebase Admin SDK com as credenciais do seu projeto
// Certifique-se de configurar as variáveis de ambiente ou o arquivo de configuração do Firebase antes disso.

if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("The FIREBASE_PRIVATE_KEY environment variable is not defined");
}

const serviceAccount: admin.ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
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
                    res.status(500).json({ error: `Invalid Signature | ${secret}` });
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
