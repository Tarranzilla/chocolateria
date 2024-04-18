import Link from "next/link";

export default function CheckoutMpPending() {
    return (
        <main className="Page_Wrapper">
            <h1>Compra pelo mercado pago ainda está sendo processada!</h1>
            <Link href="/">Voltar à Pagina Inicial</Link>
        </main>
    );
}
