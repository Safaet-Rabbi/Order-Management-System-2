import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a Context for the theme
const ThemeContext = createContext();

// Create a custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Create the Theme Provider component
export const ThemeProvider = ({ children }) => {
  // Get the initial theme from local storage or default to 'light'
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  // Use an effect to update the `data-theme` attribute on the `body` element
  // whenever the `theme` state changes. This is how the CSS applies the theme.
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    // Save the current theme to local storage for persistence
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle between 'light' and 'dark' themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Provide the theme state and toggle function to all children components
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};