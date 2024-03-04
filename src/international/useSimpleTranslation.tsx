import { useRouter } from "next/router";
import { WebStructure } from "@/types/WebStructure";

import portugueseWebStructure from "./portugueseWebStructure";
import englishWebStructure from "./englishWebStructure";

// import { useDispatch, useSelector } from "react-redux";
// import { setActiveLanguage } from "@/store/slices/interfaceSlice";
import { useMemo } from "react";

export function useSimpleTranslation(): WebStructure {
    // const dispatch = useDispatch();
    const router = useRouter();
    const { locale } = router;

    const t = useMemo(() => {
        let defaultLang = englishWebStructure; // Default to English if locale is undefined
        if (locale === "pt-BR" || locale === "pt") {
            defaultLang = portugueseWebStructure;
            // dispatch(setActiveLanguage("pt-BR"));
            console.log("Lang: pt-BR");
        } else {
            // dispatch(setActiveLanguage("en"));
            console.log("Lang: en");
        }
        return defaultLang;
    }, [locale]);

    return t;
}
