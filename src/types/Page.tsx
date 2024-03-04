export type Page = {
    title: string;
    subTitle: string;
    description: string;
    keywords: string[];
    language: string;

    pageIndex: number;
    pageKey: string;
    name: string;
    path: string;

    // propriedades opcionais para páginas em geral
    subpages?: Page[];
    images?: string[];
    paragraphs?: string[];

    // propriedades opcionais para páginas específicas
    // projects?: Project[];
    // products?: Product[];
    // services?: Service[];
    // references?: Reference[];
    magic_content?: any[]; // o magic artefact type é um coringa que pode ser usado para qualquer coisa
};
