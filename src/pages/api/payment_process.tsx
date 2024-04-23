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
            // Exemplo do conteúdo enviado no header x-signature
            // ts=1704908010,v1=618c85345248dd820d5fd456117c2ab2ef8eda45a0282ff693eac24131a5e839

            const [ts, signature] = headers["x-signature"].split(",");
            console.log("ts:", ts);
            console.log("signature:", signature);

            const tsValue = ts.split("=")[1];
            const signatureValue = signature.split("=")[1];

            console.log("tsValue:", tsValue);
            console.log("signatureValue:", signatureValue);

            // Criar um template com os dados recebidos na notificação
            // id:[data.id_url];request-id:[x-request-id_header];ts:[ts_header];

            /*
            Vercel Console Log

            ts: ts=1713885135727
            signature: v1=22a84e355e624848ab56060757a51dda194e4911fe811fa636dcab04bf2f1578
            signatureTemplate: id:123456;request-id:3ccaaa30-b543-4336-bb62-53a801eff92f;ts:ts=1713885135727
            generatedSignature: bb3052e7c5a716f02ccf403b7b8bd60c1aa7ff91024541b35a042e7ac79f2177
            signature: v1=22a84e355e624848ab56060757a51dda194e4911fe811fa636dcab04bf2f1578

            Nasty Bug, Invalid Signature Maybe

            */

            const signatureTemplate = `id:${body.data.id};request-id:${headers["x-request-id"]};ts:${tsValue}`;
            console.log("signatureTemplate:", signatureTemplate);

            if (typeof secret === "string") {
                const generatedSignature = crypto.createHmac("sha256", secret).update(signatureTemplate).digest("hex");
                console.log("generatedSignature:", generatedSignature);
                console.log("signature:", signature);

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
                    console.log("Nasty Bug, Invalid Signature Maybe");
                    res.status(500).json({ error: `Invalid Signature | ${secret}` });
                }
            } else {
                // handle the case where secret is undefined
                console.log("Nasty Bug, Undefined Secret");
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
