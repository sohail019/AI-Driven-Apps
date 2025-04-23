import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  User,
  updateUser,
} from "../store/slices/authSlice";
import { RootState } from "../store/store";
import { authAPI } from "../lib/api";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        dispatch(loginStart());
        const response = await authAPI.login(email, password);
        dispatch(
          loginSuccess({
            user: response.user,
            token: response.token,
          })
        );
        return response;
      } catch (error) {
        let errorMessage = "Failed to login";
        if (typeof error === "object" && error !== null && "message" in error) {
          errorMessage = String(error.message);
        }
        dispatch(loginFailure(errorMessage));
        throw error;
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (name: string, email: string, password: string, mobile: string) => {
      try {
        dispatch(loginStart());
        const response = await authAPI.register(name, email, password, mobile);
        dispatch(
          loginSuccess({
            user: response.user,
            token: response.token,
          })
        );
        return response;
      } catch (error) {
        let errorMessage = "Failed to register";
        if (typeof error === "object" && error !== null && "message" in error) {
          errorMessage = String(error.message);
        }
        dispatch(loginFailure(errorMessage));
        throw error;
      }
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
    async (userData: Partial<User>) => {
      const response = await authAPI.getCurrentUser();
      dispatch(updateUser(userData));
      return response;
    },
    [dispatch]
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };
}
