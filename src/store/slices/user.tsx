import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
    name: string;
    email: string;
    tropicalID: string;

    address: {
        street: string;
        number: string;
        complement: string;
        city: string;
        state: string;
        zip: string;
    };
};

type UserState = {
    currentUser: User | null;
    ordersNeedUpdate: boolean;
    userIsAdmin: boolean;
};

const initialState: UserState = {
    currentUser: null,
    ordersNeedUpdate: false,
    userIsAdmin: false,
};

type SetCurrentUserAction = PayloadAction<User>;
type UpdateOrdersAction = PayloadAction<boolean>;

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentUser: (state, action: SetCurrentUserAction) => {
            state.currentUser = action.payload;
        },
        setOrderNeedsUpdate: (state, action: UpdateOrdersAction) => {
            state.ordersNeedUpdate = action.payload;
        },
        setUserIsAdmin: (state, action: PayloadAction<boolean>) => {
            state.userIsAdmin = action.payload;
        },
    },
});

export const { setCurrentUser, setOrderNeedsUpdate, setUserIsAdmin } = userSlice.actions;
export default userSlice.reducer;
