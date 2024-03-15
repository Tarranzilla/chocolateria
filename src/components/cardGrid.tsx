import { Expertise } from "@/types/Expertise";
import Product from "@/types/Product";
import Image from "next/image";
import Link from "next/link";

import { motion as m, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { addCartItem } from "@/store/slices/cart";
import { RootState } from "@/store/store";

type CardGridProps = {
    content: Product[];
    order?: string;
};

export default function CardGrid({ content, order }: CardGridProps) {
    const dispatch = useDispatch();

    const cartItems = useSelector((state: RootState) => state.cart.cartItems);

    const getCartItemAmmount = (itemId: string) => {
        const cartItem = cartItems.find((item) => item.id === itemId);
        return cartItem ? cartItem.quantity : 0;
    };

    const addToCartAction = (item: Product) => {
        dispatch(addCartItem({ cartItemId: item.key, variant: { key: "default", name: "default" } }));
    };

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
                        <div className="Card Expertise_Card">
                            <Image src={item.imgSrc} alt={item.title} width={item.size.width} height={item.size.height} />
                            <div className="Card_Header">
                                <h2 className="Card_Title">{item.title}</h2>

                                <div className="Card_Header_Info">
                                    <h3 className="Card_Weight">{item.weight}</h3>
                                    <h3 className="Card_Weight">R$ {item.price},00</h3>
                                </div>
                            </div>

                            <p className="Card_Description">{item.description}</p>

                            <div className="Card_Footer">
                                <button
                                    className="Card_Btn"
                                    onClick={() => {
                                        addToCartAction(item as Product);
                                    }}
                                >
                                    Adicionar ao Carrinho
                                    {getCartItemAmmount(item.key) > 0 ? ` (${getCartItemAmmount(item.key)})` : ""}
                                </button>
                            </div>

                            <Link className="Card_Btn Card_Btn_More_Info" href={item.pageLink}>
                                Mais Informações
                            </Link>
                        </div>
                    </m.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
