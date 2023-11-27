import React, { createContext, useEffect } from "react";

export const ThemeContext = createContext();

const defaultTheme = "light";
const darkTheme = "dark";

export default function ThemeProvider({ children }) {
  const toggleTheme = () => {
    //Check for old theme
    const oldTheme = getTheme();

    //If default is light, change it into dark when toggle theme called
    const newTheme = oldTheme === defaultTheme ? darkTheme : defaultTheme;

    updateTheme(newTheme, oldTheme);
    //console.log("From Theme Provider", document.documentElement);
  };

  //Fetch theme class name from localstorage
  useEffect(() => {
    const theme = getTheme();
    //If no theme selected
    if (!theme) {
      updateTheme(defaultTheme);
    } else {
      updateTheme(theme);
    }
  }, []);
  // What we will pass in valu, we can use it as a context
  return (
    <ThemeContext.Provider
      value={{ /*theme: "Just for testing"*/ toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

const getTheme = () => localStorage.getItem("theme");

const updateTheme = (theme, themeToRemove) => {
  //Remove old theme
  if (themeToRemove) {
    document.documentElement.classList.remove(themeToRemove);
  }
  // Apply New Theme and store in local storage
  document.documentElement.classList.add(theme);
  //Store new theme in loaclstorege
  localStorage.setItem("theme", theme);
};
