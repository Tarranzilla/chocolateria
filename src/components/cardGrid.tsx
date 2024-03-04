import { Expertise } from "@/types/Expertise";
import Product from "@/types/Product";
import Image from "next/image";
import Link from "next/link";

import { motion as m, AnimatePresence } from "framer-motion";

type CardGridProps = {
    content: Expertise[] | Product[];
    order?: string;
};

export default function CardGrid({ content, order }: CardGridProps) {
    return (
        <div className={order ? "Card_Grid " + order : "Card_Grid"}>
            <AnimatePresence mode="popLayout">
                {content.map((item, index) => (
                    <m.div
                        key={index + item.key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href={item.pageLink} className="Card_Link" key={item.key} title={"Saiba mais sobre " + item.title}>
                            <div className="Card Expertise_Card">
                                <Image src={item.imgSrc} alt={item.title} width={item.size.width} height={item.size.height} />
                                <h2 className="Card_Title">{item.title}</h2>
                                <p className="Card_Description">{item.description}</p>
                            </div>
                        </Link>
                    </m.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
