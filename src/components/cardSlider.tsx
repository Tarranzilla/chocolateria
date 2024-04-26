import { Expertise } from "@/types/Expertise";
import Product from "@/types/Product";
import Image from "next/image";
import Link from "next/link";

import { motion as m, AnimatePresence } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { addCartItem } from "@/store/slices/cart";
import { RootState } from "@/store/store";

type CardListProps = {
    content: Product[];
    order?: string;
};

export default function CardList({ content, order }: CardListProps) {
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
        <div className={order ? "Card_List " + order : "Card_List"}>
            {content.map((item, index) => (
                <m.div
                    key={index + item.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="Card_List_Card"
                >
                    <Image
                        className="Card_Img"
                        src={item.imgSrc[0].src}
                        alt={item.imgSrc[0].alt}
                        width={item.imgSrc[0].width}
                        height={item.imgSrc[0].height}
                    />
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
                            Adicionar à Cesta
                            <span className="material-icons">shopping_basket</span>
                            {getCartItemAmmount(item.key) > 0 ? ` (${getCartItemAmmount(item.key)})` : ""}
                        </button>
                    </div>

                    <Link className="Card_Btn Card_Btn_More_Info" href={item.pageLink}>
                        <span className="material-icons">style</span>
                        Mais Informações
                    </Link>
                </m.div>
            ))}
        </div>
    );
}
