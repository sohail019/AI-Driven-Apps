import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  tokenExpiryDate: string | null;
  isAuthenticated: boolean;
  userType: "admin" | "super-admin" | null;
  adminInfo: {
    fullName: string;
    email: string;
  } | null;
}

interface RefreshTokenState {
  newToken: string;
  newRefreshToken: string;
  newExpiryDate: string;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  tokenExpiryDate: localStorage.getItem("tokenExpiryDate"),
  isAuthenticated: !!localStorage.getItem("token"),
  userType: localStorage.getItem("userType") as "admin" | "super-admin" | null,
  adminInfo: JSON.parse(localStorage.getItem("adminInfo") || "{}"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        tokenExpiryDate: string;
        userType: "admin" | "super-admin";
        adminInfo: { fullName: string; email: string };
      }>
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.tokenExpiryDate = action.payload.tokenExpiryDate;
      state.isAuthenticated = true;
      state.userType = action.payload.userType;
      state.adminInfo = action.payload.adminInfo;

      // Save data in localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem(
        "refreshToken",
        action.payload.refreshToken || "refreshToken"
      );
      localStorage.setItem(
        "tokenExpiryDate",
        action.payload.tokenExpiryDate || "tokenExpiryDate"
      );
      localStorage.setItem("userType", action.payload.userType);
      localStorage.setItem(
        "adminInfo",
        JSON.stringify(action.payload.adminInfo || {})
      );
    },
    setRefreshToken: (state, action: PayloadAction<RefreshTokenState>) => {
      state.refreshToken = action.payload.newRefreshToken;
      state.token = action.payload.newToken;
      state.tokenExpiryDate = action.payload.newExpiryDate;

      // Save data in localStorage
      localStorage.setItem("token", action.payload.newToken);
      localStorage.setItem("refreshToken", action.payload.newRefreshToken);
      localStorage.setItem("tokenExpiryDate", action.payload.newExpiryDate);
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.tokenExpiryDate = null;
      state.isAuthenticated = false;
      // state.userType = null;
      state.adminInfo = null;

      // Clear data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiryDate");
      localStorage.removeItem("userType");
      localStorage.removeItem("adminInfo");
    },
    updateAdminInfo: (
      state,
      action: PayloadAction<{ fullName: string; email: string }>
    ) => {
      state.adminInfo = action.payload;

      // Update localStorage
      localStorage.setItem("adminInfo", JSON.stringify(action.payload));
    },
  },
});

export const { login, logout, updateAdminInfo, setRefreshToken } =
  authSlice.actions;
export default authSlice.reducer;
