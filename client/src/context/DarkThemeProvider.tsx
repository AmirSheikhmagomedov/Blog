import {
  useMemo,
  createContext,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface IDarkThemeContext {
  isDarkTheme: boolean;
  toggleDarkTheme: () => void;
}

export const DarkThemeContext = createContext<IDarkThemeContext>({
  isDarkTheme: false,
  toggleDarkTheme: () => {},
});

export function DarkThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkTheme, setIsDarkTheme] = useLocalStorage('isDarkTheme', false);

  const toggleDarkTheme = useCallback(() => {
    setIsDarkTheme(!isDarkTheme);
  }, [isDarkTheme, setIsDarkTheme]);

  useEffect(() => {
    if (isDarkTheme) document.body.classList.add('dark-theme');
    if (!isDarkTheme) document.body.classList.remove('dark-theme');
  }, [isDarkTheme, toggleDarkTheme]);

  const DarkThemeProviderValue = useMemo(
    () => ({
      isDarkTheme,
      toggleDarkTheme,
    }),
    [isDarkTheme, toggleDarkTheme]
  );

  return (
    <DarkThemeContext.Provider value={DarkThemeProviderValue}>
      {children}
    </DarkThemeContext.Provider>
  );
}
