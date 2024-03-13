import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MercadoPagoState {
    publicKey: string;
    accessToken: string;
    preferenceId: string;
    orderData: any;
}

const initialState: MercadoPagoState = {
    publicKey: "No public key defined.",
    accessToken: "No access token defined.",
    preferenceId: "No preference ID defined.",
    orderData: {},
};

const mercadoPagoSlice = createSlice({
    name: "mercadoPago",
    initialState,
    reducers: {
        setPublicKey: (state, action: PayloadAction<string>) => {
            state.publicKey = action.payload;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setPreferenceId: (state, action: PayloadAction<string>) => {
            state.preferenceId = action.payload;
        },
        setOrderData: (state, action: PayloadAction<any>) => {
            state.orderData = action.payload;
        },
    },
});

export const { setPublicKey, setAccessToken, setPreferenceId, setOrderData } = mercadoPagoSlice.actions;
export default mercadoPagoSlice.reducer;
