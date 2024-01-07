import React from "react";
import AuthProvider from "./AuthProvider";
import NotificationProvider from "./NotificationProvider";
import ThemeProvider from "./ThemeProvider";
import SearchProvider from "./SearchProvider";

export default function ContextProviders({ children }) {
  return (
    <NotificationProvider>
      <SearchProvider>
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </SearchProvider>
    </NotificationProvider>
  );
}
