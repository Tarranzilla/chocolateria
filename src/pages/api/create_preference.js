// SDK do Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";
// Adicione as credenciais
const client = new MercadoPagoConfig({ accessToken: "TEST-5866109528270009-031110-5662bc4f630f78b04519adecead1b55b-201803820" });

export default function handler(req, res) {
    if (req.method === "POST") {
        let cartItems = req.body.map((item) => ({
            title: item.id,
            unit_price: item.price,
            quantity: item.quantity,
        }));

        console.log(cartItems);
        const preference = new Preference(client);

        preference
            .create({
                body: {
                    items: cartItems,
                },
            })
            .then(function (response) {
                console.log(response.id);
                res.json({
                    id: response.id,
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
