import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    token: string;
    image?: string;
}

interface AuthState {
    userInfo: UserInfo | null;
}

const initialState: AuthState = {
    userInfo: typeof window !== "undefined" && localStorage.getItem("adminUserInfo")
        ? JSON.parse(localStorage.getItem("adminUserInfo")!)
        : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload;
            localStorage.setItem("adminUserInfo", JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem("adminUserInfo");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
