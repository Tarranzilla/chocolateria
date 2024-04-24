// SDK do Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";
// Adicione as credenciais
const client = new MercadoPagoConfig({ accessToken: "TEST-5866109528270009-031110-5662bc4f630f78b04519adecead1b55b-201803820" });

export default function preferenceHandler(req, res) {
    if (req.method === "POST") {
        let cartItems = req.body.map((item) => ({
            title: item.id,
            unit_price: item.price,
            quantity: item.quantity,
        }));

        // console.log(cartItems);
        const preference = new Preference(client);

        preference
            .create({
                body: {
                    items: cartItems,
                    back_urls: {
                        success: "https://chocolateria.vercel.app/checkout_mp_success",
                        failure: "https://chocolateria.vercel.app/checkout_mp_failure",
                        pending: "https://chocolateria.vercel.app/checkout_mp_pending",
                    },
                    external_reference: "pagamento_teste",
                },
            })
            .then(function (response) {
                console.log(response.id);
                console.log("full response:", response);
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
