import Link from "next/link";

export default function CheckoutMpSuccess() {
    return (
        <main className="Page_Wrapper">
            <h1>Compra pelo mercado pago realizada com sucesso!</h1>
            <Link href="/">Voltar à Pagina Inicial</Link>
        </main>
    );
}
