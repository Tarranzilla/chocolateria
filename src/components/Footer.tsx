import Link from "next/link";

import { useRouter } from "next/router";

import { useSimpleTranslation } from "@/international/useSimpleTranslation";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { toggleCartOpen } from "@/store/slices/interface";

export default function Footer() {
    const router = useRouter();
    const dispatch = useDispatch();

    const t = useSimpleTranslation();

    const changeLanguage = () => {
        const currentLocale = router.locale;
        const newLocale = currentLocale === "en" ? "pt-BR" : "en";
        const currentPath = router.asPath;
        router.push(currentPath, currentPath, { locale: newLocale });
    };

    const isCartOpen = useSelector((state: RootState) => state.interface.isCartOpen);
    const cartItems = useSelector((state: RootState) => state.cart.cartItems);

    const cartItemsTotalAmmount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const toggleCartAction = () => {
        dispatch(toggleCartOpen());
    };

    return (
        <div className="Footer">
            <div className="Footer_Content">
                <div className="Footer_Actions Desktop_Only">
                    <div className="Footer_Btn Privacy_Btn" title={t.footer.privacyBtn.label}>
                        <Link href={"/privacidade"}>
                            <span className="Footer_Icon material-icons">verified_user</span>
                        </Link>
                    </div>
                    <div className="Footer_Btn Terms_Btn" title={t.footer.termsBtn.label}>
                        <Link href="/termos-de-uso">
                            <span className="Footer_Icon material-icons">sticky_note_2</span>
                        </Link>
                    </div>
                    <div className="Footer_Btn Lang_Btn" title={t.footer.langBtn?.label} onClick={changeLanguage}>
                        <span className="Footer_Icon material-icons">language</span>
                    </div>
                </div>

                <p className="Desktop_Only">© 2024 Tropical Cacau</p>

                <div className="Footer_Actions">
                    <div
                        onClick={toggleCartAction}
                        className={isCartOpen ? "Footer_Btn Footer_Cart_Btn Active" : "Footer_Btn Footer_Cart_Btn"}
                        title={t.footer.scheduleBtn.label}
                    >
                        {cartItemsTotalAmmount > 0 && <span className="Footer_Badge">{cartItemsTotalAmmount}</span>}
                        <span className="Footer_Icon material-icons">shopping_cart</span>
                    </div>
                    <div className="Footer_Btn Phone_Btn" title={t.footer.telephoneBtn.label}>
                        <Link href="tel:+1234567890">
                            <span className="Footer_Icon material-icons">phone</span>
                        </Link>
                    </div>
                    <div className="Footer_Btn Email_Btn" title={t.footer.emailBtn.label}>
                        <Link href="mailto:example@example.com">
                            <span className="Footer_Icon material-icons">email</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
