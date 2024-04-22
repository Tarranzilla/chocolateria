import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { getFirestore, doc, setDoc, getDoc, getDocs, DocumentData, Timestamp, collection, query, where } from "firebase/firestore";

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

export default function CheckoutMpSuccess() {
    const router = useRouter();

    const [orderID, setOrderID] = useState<string | undefined>(undefined); // Get the order ID from the query params
    const [order, setOrder] = useState<Order | undefined>(undefined);

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
        } else {
            console.log("No such document!");
        }
    };

    useEffect(() => {
        const {
            collection_id,
            collection_status,
            payment_id,
            status,
            external_reference,
            payment_type,
            merchant_order_id,
            preference_id,
            site_id,
            processing_mode,
            merchant_account_id,
        } = router.query;

        setOrderID(preference_id as string);
        console.log("orderID", orderID);

        console.log("collection_id", collection_id);
        console.log("collection_status", collection_status);
        console.log("payment_id", payment_id);
        console.log("status", status);
        console.log("external_reference", external_reference);
        console.log("payment_type", payment_type);
        console.log("merchant_order_id", merchant_order_id);
        console.log("preference_id", preference_id);
        console.log("site_id", site_id);
        console.log("processing_mode", processing_mode);
        console.log("merchant_account_id", merchant_account_id);

        // Now you can use these variables in your code
        // ...
    }, [router.query]);

    useEffect(() => {
        if (orderID) {
            fetchOrderDoc(orderID).then((order) => {
                setOrder(order);
                console.log("order", order);
            });
        }
    }, [orderID]);

    return (
        <main className="Page_Wrapper">
            <h1>Compra pelo mercado pago realizada com sucesso!</h1>
            <div className="Payment_Info_Card">
                <h2>Detalhes do pagamento</h2>
                <p>collection_id: {router.query.collection_id}</p>
                <p>collection_status: {router.query.collection_status}</p>
                <p>payment_id: {router.query.payment_id}</p>
                <p>status: {router.query.status}</p>
                <p>external_reference: {router.query.external_reference}</p>
                <p>payment_type: {router.query.payment_type}</p>
                <p>merchant_order_id: {router.query.merchant_order_id}</p>
                <p>preference_id: {router.query.preference_id}</p>
                <p>site_id: {router.query.site_id}</p>
                <p>processing_mode: {router.query.processing_mode}</p>
                <p>merchant_account_id: {router.query.merchant_account_id}</p>
            </div>
            <Link href="/">Voltar à Pagina Inicial</Link>
        </main>
    );
}
