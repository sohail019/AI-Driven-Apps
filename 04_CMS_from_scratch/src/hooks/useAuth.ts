import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logout as logoutAction,
  setRefreshToken,
  updateAdminInfo,
  login as loginAction,
} from "../store/slices/authSlice";
import { RootState } from "../store/store";
import { authAPI } from "../lib/api/auth";

export function useAuth() {
  const dispatch = useDispatch();
  const { token, isAuthenticated, userType, adminInfo } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authAPI.login(email, password);
      const { fullName, email: adminEmail } = response.data.admin;
      dispatch(
        loginAction({
          ...response.data,
          ...{ userType: "Admin", adminInfo: { fullName, email: adminEmail } },
        })
      );

      // dispatch(
      //   setRefreshToken({
      //     newToken: response.data.token,
      //     newRefreshToken: response.data.refreshToken,
      //     newExpiryDate: response.data.tokenExpiryDate,
      //   })
      // );
      return response;
    },
    [dispatch]
  );

  const superAdminLogin = useCallback(
    async (email: string, password: string) => {
      const response = await authAPI.superAdminLogin(email, password);
      const { fullName, email: superAdminEmail } = response.data.superAdmin;
      dispatch(
        loginAction({
          ...response.data,
          ...{
            userType: "SuperAdmin",
            adminInfo: { fullName, email: superAdminEmail },
          },
        })
      );
      return response;
    },
    [dispatch]
  );

  const register = useCallback(
    async (name: string, email: string, password: string, mobile: string) => {
      const response = await authAPI.register(name, email, password, mobile);
      dispatch(
        setRefreshToken({
          newToken: response.data.token,
          newRefreshToken: response.data.refreshToken,
          newExpiryDate: response.data.tokenExpiryDate,
        })
      );
      return response;
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      // Try to hit the logout endpoint if the user is authenticated
      if (isAuthenticated) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Always dispatch logout action even if the API call fails
      dispatch(logoutAction());
    }
  }, [dispatch, isAuthenticated]);

  const updateProfile = useCallback(
    async (userData: { fullName: string; email: string }) => {
      const response = await authAPI.getCurrentUser();
      dispatch(updateAdminInfo(userData));
      return response;
    },
    [dispatch]
  );

  return {
    token,
    isAuthenticated,
    userType,
    adminInfo,
    login,
    superAdminLogin,
    register,
    logout,
    updateProfile,
  };
}
