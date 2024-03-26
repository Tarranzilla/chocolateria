import { configureStore } from "@reduxjs/toolkit";

import cart from "./slices/cart";
import interface_slice from "./slices/interface";
import user_slice from "./slices/user";

import mercado_pago from "./slices/mercado_pago";

export const store = configureStore({
    reducer: {
        cart: cart,
        interface: interface_slice,
        mercadoPago: mercado_pago,
        user: user_slice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
