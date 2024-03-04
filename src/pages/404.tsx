import Link from "next/link";

export default function Custom404() {
    return (
        <div className="Page_Wrapper">
            <div className="Error">
                <span className="material-icons Error_Icon">error</span>
                <h1 className="Error_Title">Erro 404</h1>
                <h1 className="Error_SubTitle">Página não encontrada</h1>
                <Link className="Error_Btn" href="/">
                    Voltar para o início
                </Link>
            </div>
        </div>
    );
}
