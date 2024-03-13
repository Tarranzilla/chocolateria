import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import Product from "@/types/Product";
import productList from "@/content_lists/product_list";

export type CartItem = {
    id: string;
    price: number;
    quantity: number;
    bannerImage?: string;
    variant: {
        key: string;
        name: string;
    };
};

type Variant = {
    key: string;
    name: string;
};

type CartState = {
    cartItems: CartItem[];
    cartTotal: number;
};

const initialCartState: CartState = {
    cartItems: [],
    cartTotal: 0,
};

type AddCartItemAction = PayloadAction<{ cartItemId: string; variant: Variant }>;
type RemoveCartItemAction = PayloadAction<{ cartItemId: string; variant: Variant }>;
type DecrementCartItemAction = PayloadAction<{ cartItemId: string; variant: Variant }>;

export const findProductByKey = (searchKey: string, products: Product[]): Product | undefined => {
    for (const prod of products) {
        const matchingProduct = products.find((product) => product.key === searchKey);
        if (matchingProduct) return matchingProduct;
    }

    return undefined;
};

const cartSlice = createSlice({
    name: "cart",
    initialState: initialCartState,
    reducers: {
        addCartItem: (state, action: AddCartItemAction) => {
            const { cartItemId, variant } = action.payload;
            const existingCartItem = state.cartItems.find(
                (item) => item.id === cartItemId && (item.variant.key === variant.key || variant.key === "default")
            );

            if (existingCartItem) {
                existingCartItem.quantity += 1;
            } else {
                const product = findProductByKey(cartItemId, productList);

                if (product) {
                    state.cartItems.push({
                        id: product.key,
                        price: product.price,
                        quantity: 1,
                        bannerImage: product.imgSrc,
                        variant,
                    });
                }
            }

            state.cartTotal = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        },
        decrementCartItem: (state, action: DecrementCartItemAction) => {
            const { cartItemId, variant } = action.payload;
            const existingCartItem = state.cartItems.find((item) => item.id === cartItemId && item.variant.key === variant.key);

            if (existingCartItem) {
                existingCartItem.quantity -= 1;
                if (existingCartItem.quantity <= 0) {
                    state.cartItems = state.cartItems.filter((item) => item.id !== cartItemId || item.variant.key !== variant.key);
                }
            }

            state.cartTotal = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        },
        removeCartItem: (state, action: RemoveCartItemAction) => {
            const { cartItemId, variant } = action.payload;
            state.cartItems = state.cartItems.filter((item) => item.id !== cartItemId || item.variant.key !== variant.key);
            state.cartTotal = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        },
    },
});

export const { addCartItem, decrementCartItem, removeCartItem } = cartSlice.actions;
export default cartSlice.reducer;