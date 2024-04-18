import Link from "next/link";

export default function CheckoutMpFailure() {
    return (
        <main className="Page_Wrapper">
            <h1>Ocorreu um erro na compra pelo mercado pago, por favor tente novamente, caso o erro persista entre em contato conosco!</h1>
            <Link href="/">Voltar à Pagina Inicial</Link>
        </main>
    );
}
