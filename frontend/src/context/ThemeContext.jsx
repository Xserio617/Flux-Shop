import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 1. Daha önce seçilen temayı hafızadan (localStorage) oku, yoksa 'light' yap.
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // 2. HTML etiketine 'data-theme="dark"' özelliğini ekle/çıkar
    document.documentElement.setAttribute('data-theme', theme);
    // 3. Seçimi kaydet ki sayfa yenilenince gitmesin
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Temayı değiştiren fonksiyon
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}