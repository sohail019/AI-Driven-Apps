import { createContext, useContext, useEffect, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setTheme, ThemeMode } from "../store/slices/settingsSlice";

type ThemeContextType = {
  theme: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  isDarkMode: boolean;
};

const defaultContext: ThemeContextType = {
  theme: "system",
  toggleTheme: () => {},
  setThemeMode: () => {},
  isDarkMode: false,
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.settings);

  // Initial sync with system preference
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    // Apply the theme on initial load
    applyTheme(theme);

    // Listen for changes in system color scheme
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (theme === "system") {
        if (event.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    darkModeMediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  const applyTheme = (themeMode: ThemeMode) => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else if (themeMode === "light") {
      document.documentElement.classList.remove("dark");
    } else if (themeMode === "system") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (systemPrefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    dispatch(setTheme(newTheme));
    applyTheme(newTheme);
  };

  const setThemeMode = (mode: ThemeMode) => {
    dispatch(setTheme(mode));
    applyTheme(mode);
  };

  const isDarkMode =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setThemeMode,
        isDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
