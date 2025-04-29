import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface User {
//   id: string;
//   email: string;
//   role: string;
//   name?: string;
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   isAuthenticated: false,
//   isLoading: false,
//   error: null,
// };

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  tokenExpiryDate: string | null;
  isAuthenticated: boolean;
  userType: "Admin" | "SuperAdmin" | null;
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
  userType: localStorage.getItem("userType") as "Admin" | "SuperAdmin" | null,
  adminInfo: JSON.parse(localStorage.getItem("adminInfo") || "null"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // loginStart: (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // },
    // loginSuccess: (
    //   state,
    //   action: PayloadAction<{ user: User; token: string }>
    // ) => {
    //   state.user = action.payload.user;
    //   state.token = action.payload.token;
    //   state.isAuthenticated = true;
    //   state.isLoading = false;
    //   state.error = null;
    // },
    login: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        tokenExpiryDate: string;
        userType: "Admin" | "SuperAdmin";
        adminInfo: { fullName: string; email: string };
      }>
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.tokenExpiryDate = action.payload.tokenExpiryDate;
      state.isAuthenticated = true;
      state.userType = action.payload.userType;
      state.adminInfo = action.payload.adminInfo;

      console.log("action.payload", action.payload);

      // Save data in localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      localStorage.setItem("tokenExpiryDate", action.payload.tokenExpiryDate);
      localStorage.setItem("userType", action.payload.userType);
      localStorage.setItem(
        "adminInfo",
        JSON.stringify(action.payload.adminInfo)
      );
    },
    // loginFailure: (state, action: PayloadAction<string>) => {
    //   state.isLoading = false;
    //   state.error = action.payload;
    // },
    setRefreshToken: (state, action: PayloadAction<RefreshTokenState>) => {
      state.refreshToken = action.payload.newRefreshToken;
      state.token = action.payload.newToken;
      state.tokenExpiryDate = action.payload.newExpiryDate;

      // Save data in localStorage
      localStorage.setItem("token", action.payload.newToken);
      localStorage.setItem("refreshToken", action.payload.newRefreshToken);
      localStorage.setItem("tokenExpiryDate", action.payload.newExpiryDate);
    },
    // logout: (state) => {
    //   state.user = null;
    //   state.token = null;
    //   state.isAuthenticated = false;
    //   state.error = null;
    // },
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
    // clearErrors: (state) => {
    //   state.error = null;
    // },
    // setCredentials: (
    //   state,
    //   action: PayloadAction<{ user: User; token: string }>
    // ) => {
    //   state.user = action.payload.user;
    //   state.token = action.payload.token;
    //   state.isAuthenticated = true;
    // },
  },
});

// export const {
//   loginStart,
//   loginSuccess,
//   loginFailure,
//   logout,
//   clearErrors,
//   setCredentials,
// } = authSlice.actions;

export const { login, setRefreshToken, logout, updateAdminInfo } =
  authSlice.actions;

export default authSlice.reducer;
