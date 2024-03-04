import ParagraphsWithTitle from "./ParagraphsWithTitle";

export type TeamMember = {
    name: string;
    role: string;
    OAB_number: string;
    OAB_Link: string;
    picture: string;

    cellphone: string;
    telephone: string;
    email: string;
    description: string[];
    professionalExperience?: ParagraphsWithTitle[];
    complementaryEducation?: ParagraphsWithTitle[];
    academicBackground?: ParagraphsWithTitle[];
    academicProduction?: ParagraphsWithTitle[];
};
