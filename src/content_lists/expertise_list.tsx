import { Expertise } from "@/types/Expertise";

export const expertiseList: Expertise[] = [
    {
        key: "ovos-de-pascoa",
        title: "Ovos de Páscoa",
        description: "Feitos com chocolate orgânico e recheados com creme de avelã e frutas.",
        metadescription: "Feitos com chocolate orgânico e recheados com creme de avelã e frutas.",
        imgSrc: "/product_imgs/produto_ovos_pascoa_thumb.png",
        size: {
            width: 740,
            height: 420,
        },
        pageLink: "/expertise/direito_do_trabalho",
        subitems: [
            {
                key: "legislacao_trabalhista",
                title: "Legislação Trabalhista",
                description: "Conjunto de leis que regulam as relações de trabalho.",
            },
            {
                key: "relacoes_empregaticias",
                title: "Relações Empregatícias",
                description: "Questões relacionadas a contratos de trabalho, rescisões, etc.",
            },
            {
                key: "direitos_deveres_empregado",
                title: "Direitos e Deveres do Empregado",
                description: "Obrigações e prerrogativas do trabalhador.",
            },
            {
                key: "direitos_deveres_empregador",
                title: "Direitos e Deveres do Empregador",
                description: "Obrigações e prerrogativas do empregador.",
            },
            {
                key: "rescisao_contrato_trabalho",
                title: "Rescisão de Contrato de Trabalho",
                description: "Procedimentos e direitos envolvidos na rescisão do contrato de trabalho.",
            },
            {
                key: "acidentes_trabalho",
                title: "Acidentes de Trabalho",
                description: "Questões relacionadas a acidentes e doenças ocupacionais.",
            },
            {
                key: "normas_coletivas",
                title: "Normas Coletivas",
                description: "Convenções e acordos coletivos de trabalho.",
            },
        ],
    },
    {
        key: "tropical-amazonas",
        title: "Tropical Amazonas",
        description: "Barra de chocolate ao leite feita com 45% de cacau orgânico.",
        metadescription:
            "Com expertise em Direito Previdenciário, nosso escritório fornece assistência abrangente em questões relacionadas à Previdência Social, incluindo aposentadorias, benefícios por incapacidade, pensões e revisões de benefícios.",
        imgSrc: "/product_imgs/produto_tropical_amazonas_thumb.png",
        pageLink: "/expertise/direito_previdenciario",
        size: {
            width: 300,
            height: 200,
        },
        subitems: [
            {
                key: "beneficios_previdenciarios",
                title: "Benefícios Previdenciários",
                description:
                    "Modalidades de benefícios oferecidas pela previdência social, como aposentadoria, pensão por morte, auxílio-doença, etc.",
            },
            {
                key: "requisitos_concessao_beneficios",
                title: "Requisitos para Concessão de Benefícios",
                description: "Critérios necessários para obter os benefícios previdenciários.",
            },
            {
                key: "processo_administrativo_previdenciario",
                title: "Processo Administrativo Previdenciário",
                description: "Trâmites e procedimentos para requerer benefícios junto à previdência social.",
            },
            {
                key: "recursos_administrativos_judiciais",
                title: "Recursos Administrativos e Judiciais",
                description: "Possibilidades de recurso em caso de negativa ou revisão de benefícios previdenciários.",
            },
        ],
    },
    {
        key: "tropical-rio",
        title: "Tropical Rio",
        description: "Chocolate intenso ao leite feito com 55% de cacau orgânico.",
        metadescription:
            "Especializados em Direito Tributário, oferecemos suporte legal em questões fiscais, incluindo planejamento tributário, contestação de autuações, recuperação de tributos e defesa em processos administrativos e judiciais.",
        imgSrc: "/product_imgs/produto_tropical_rio_thumb.png",
        pageLink: "/expertise/direito_tributario",
        size: {
            width: 300,
            height: 200,
        },
        subitems: [
            {
                key: "impostos",
                title: "Impostos",
                description: "Diferentes tipos de impostos, como IRPF, IRPJ, ICMS, IPI, ISS, etc.",
            },
            {
                key: "taxas_contribuicoes",
                title: "Taxas e Contribuições",
                description: "Taxas e contribuições devidas aos entes federativos.",
            },
            {
                key: "planejamento_tributario",
                title: "Planejamento Tributário",
                description: "Estratégias para otimizar a carga tributária de empresas e pessoas físicas.",
            },
            {
                key: "contencioso_tributario",
                title: "Contencioso Tributário",
                description: "Atuação em processos administrativos e judiciais relacionados a questões tributárias.",
            },
            {
                key: "consultoria_tributaria",
                title: "Consultoria Tributária",
                description: "Assessoria especializada na interpretação e aplicação da legislação tributária.",
            },
        ],
    },
    {
        key: "tropical-minas",
        title: "Tropical Minas",
        description: "Chocolate feito com doce de leite e 35% de cacau orgânico.",
        metadescription:
            "Com vasta experiência em Direito Civil, nossa equipe oferece assistência em diversas áreas, como contratos, responsabilidade civil, direitos reais, sucessões, obrigações e questões relacionadas à propriedade.",
        imgSrc: "/product_imgs/produto_tropical_minas_thumb.png",
        pageLink: "/expertise/direito_civil",
        size: {
            width: 300,
            height: 200,
        },
        subitems: [
            {
                key: "direito_sucessoes",
                title: "Direito das Sucessões",
                description: "Regulamenta a transmissão dos bens e direitos de uma pessoa falecida aos seus herdeiros.",
            },
            {
                key: "direito_familia",
                title: "Direito de Família",
                description: "Regula as relações familiares, como casamento, divórcio, guarda de filhos, pensão alimentícia, etc.",
            },
            {
                key: "direito_imobiliario",
                title: "Direito Imobiliário",
                description: "Atuação nas questões relacionadas a bens imóveis, como compra e venda, locação, usucapião, etc.",
            },
            {
                key: "responsabilidade_civil",
                title: "Responsabilidade Civil",
                description: "Trata das consequências jurídicas decorrentes da prática de atos ilícitos que causam danos a terceiros.",
            },
            {
                key: "contratos_civis",
                title: "Contratos Civis",
                description: "Regula as relações contratuais entre as partes, estabelecendo direitos e obrigações recíprocas.",
            },
            {
                key: "direito_consumidor",
                title: "Direito do Consumidor",
                description:
                    "Protege os direitos dos consumidores nas relações de consumo, garantindo qualidade e segurança nos produtos e serviços.",
            },
            {
                key: "direito_obrigacoes",
                title: "Direito das Obrigações",
                description: "Estabelece as normas sobre os vínculos jurídicos de natureza patrimonial entre as pessoas.",
            },
            {
                key: "direito_coisas",
                title: "Direito das Coisas",
                description: "Regulamenta os direitos reais sobre bens corpóreos e incorpóreos.",
            },
        ],
    },
    {
        key: "tropical-sampa",
        title: "Tropical Sampa",
        description: "Chocolate feito com café e 40% de cacau orgânico.",
        metadescription:
            "Especializados em Direito de Família, prestamos suporte legal em questões como divórcio, pensão alimentícia, guarda de filhos, inventários, adoções, investigação de paternidade e outras questões familiares delicadas.",
        imgSrc: "/product_imgs/produto_tropical_sampa_thumb.png",
        pageLink: "/expertise/direito_familia",
        size: {
            width: 300,
            height: 200,
        },
        subitems: [
            {
                key: "divorcio",
                title: "Divórcio",
                description: "Processo legal que dissolve o vínculo matrimonial entre um casal.",
            },
            {
                key: "uniao_estavel",
                title: "União Estável",
                description:
                    "Reconhecimento jurídico da convivência duradoura, pública e contínua entre duas pessoas, com o objetivo de constituir família.",
            },
            {
                key: "guarda_filhos",
                title: "Guarda de Filhos",
                description: "Definição sobre quem terá a responsabilidade legal pelos cuidados e decisões relacionadas aos filhos menores.",
            },
            {
                key: "pensao_alimenticia",
                title: "Pensão Alimentícia",
                description:
                    "Valor pago por uma pessoa para prover as necessidades básicas de sustento de outra, como filhos, ex-cônjuge ou companheiro.",
            },
            {
                key: "partilha_bens",
                title: "Partilha de Bens",
                description: "Divisão dos bens adquiridos durante o casamento ou união estável em caso de separação ou divórcio.",
            },
            {
                key: "adoção",
                title: "Adoção",
                description:
                    "Processo legal pelo qual uma pessoa ou um casal assume legalmente a responsabilidade de cuidar e educar uma criança como seu(s) filho(s).",
            },
            {
                key: "investigacao_paternidade",
                title: "Investigação de Paternidade",
                description: "Processo judicial para determinar a filiação de uma pessoa a um pai biológico.",
            },
        ],
    },
    {
        key: "tropical-bahia",
        title: "Tropical Bahia",
        description: "Chocolate intenso feito com 70% de cacau orgânico.",
        metadescription:
            "Com expertise em Direito das Sucessões, oferecemos assistência em processos de inventário, partilha de bens, testamentos, planejamento sucessório e questões relacionadas à herança e patrimônio.",
        imgSrc: "/product_imgs/produto_tropical_bahia_thumb.png",
        pageLink: "/expertise/direito_sucessoes",
        size: {
            width: 300,
            height: 200,
        },
        subitems: [
            {
                key: "inventario_partilha_bens",
                title: "Inventário e Partilha de Bens",
                description: "Processo judicial ou extrajudicial para apurar e dividir os bens do falecido entre os herdeiros.",
            },
            {
                key: "testamento",
                title: "Testamento",
                description: "Documento pelo qual uma pessoa expressa suas vontades sobre a destinação de seus bens após o falecimento.",
            },
            {
                key: "planejamento_sucessorio",
                title: "Planejamento Sucessório",
                description:
                    "Conjunto de medidas jurídicas adotadas em vida para organizar a sucessão patrimonial e evitar conflitos entre herdeiros.",
            },
            {
                key: "itcmd",
                title: "Imposto sobre Transmissão Causa Mortis (ITCMD)",
                description: "Imposto estadual incidente sobre a transmissão de bens ou direitos decorrentes de sucessão hereditária.",
            },
            {
                key: "heranca_digital",
                title: "Herança Digital",
                description: "Trata da sucessão dos bens e dados digitais de uma pessoa após o seu falecimento.",
            },
        ],
    },
    {
        key: "tropical-parana",
        title: "Tropical Paraná",
        description: "Chocolate Branco com 35% de cacau orgânico",
        metadescription:
            "Fornecemos suporte legal em transações imobiliárias, contratos de locação, regularização de propriedades, litígios envolvendo imóveis, condomínios e questões relacionadas ao direito de propriedade.",
        imgSrc: "/product_imgs/produto_tropical_parana_thumb.png",
        pageLink: "/expertise/direito_imobiliario",
        size: {
            width: 300,
            height: 200,
        },
        subitems: [
            {
                key: "usucapiao",
                title: "Usucapião",
                description: "Aquisição da propriedade de um bem imóvel pela posse prolongada e ininterrupta, conforme determina a lei.",
            },
            {
                key: "reintegracao_posse",
                title: "Reintegração de Posse",
                description: "Ação judicial utilizada para recuperar a posse de um imóvel que foi indevidamente ocupado por terceiros.",
            },
            {
                key: "contratos_imobiliarios",
                title: "Contratos Imobiliários",
                description: "Acordos firmados entre as partes envolvidas na compra, venda, locação ou arrendamento de imóveis.",
            },
            {
                key: "condominio",
                title: "Condomínio",
                description:
                    "Regulamenta a forma de organização e administração dos condomínios, seja horizontal, vertical, residencial ou comercial.",
            },
            {
                key: "iptu",
                title: "Imposto sobre a Propriedade Predial e Territorial Urbana (IPTU)",
                description: "Imposto municipal incidente sobre a propriedade de imóveis urbanos.",
            },
            {
                key: "bem_de_familia",
                title: "Bem de Família",
                description:
                    "Proteção legal concedida a um imóvel residencial utilizado como moradia da família, impedindo sua penhora em processos judiciais.",
            },
        ],
    },
];

export default expertiseList;
