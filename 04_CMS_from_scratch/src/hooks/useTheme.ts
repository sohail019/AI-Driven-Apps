import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setTheme, ThemeMode } from "../store/slices/settingsSlice";

export function useTheme() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    // Apply theme to document when it changes
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (theme === "system") {
      // Check system preference
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (systemPrefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  const changeTheme = (newTheme: ThemeMode) => {
    dispatch(setTheme(newTheme));
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    dispatch(setTheme(newTheme));
  };

  return {
    theme,
    changeTheme,
    toggleTheme,
    isDarkMode:
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  };
}
