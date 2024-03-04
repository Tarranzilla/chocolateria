export type Expertise = {
    key: string;
    title: string;
    description: string;
    metadescription: string;
    imgSrc: string;
    size: {
        width: number;
        height: number;
    };
    pageLink: string;
    subitems?: Expertise_Subitem[];
};

export type Expertise_Subitem = {
    key: string;
    title: string;
    description: string;

    // Optional properties
    metadescription?: string;
    imgSrc?: string;
    size?: {
        width: number;
        height: number;
    };
    pageLink?: string;
};
