import React, { createContext, useEffect, useState } from "react";
import { getIsAuth, signInUser } from "../api/auth";
import { useNotification } from "../hooks";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  //For Login and Logout Part
  const defaultAuthInfo = {
    profile: null,
    isLoggedIn: false,
    isPending: false,
    error: "",
  };
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });

  const { updateNotification } = useNotification();
  //For Login
  const handleLogin = async (email, password) => {
    setAuthInfo({ ...authInfo, isPending: true });
    const { error, user } = await signInUser({ email, password });
    if (error) {
      updateNotification("error", error);
      return setAuthInfo({ ...authInfo, isPending: false, error: error });
    }
    //Update User Profile
    setAuthInfo({
      profile: { ...user },
      isPending: false,
      isLoggedIn: true,
      error: "",
    });

    // console.log("auth", user);
    //Set token in localstorage
    localStorage.setItem("auth-token", user.token);
  };
  // handleLogout, isAuth

  const isAuth = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      return;
    }
    setAuthInfo({ ...authInfo, isPending: true });

    //Sent token  to backend to verify the token

    const { error, user } = await getIsAuth(token);
    if (error) {
      updateNotification("error", error);
      return setAuthInfo({ ...authInfo, isPending: false, error: error });
    }

    setAuthInfo({
      profile: { ...user },
      isPending: false,
      isLoggedIn: true,
      error: "",
    });
  };

  //For logout
  const handleLogout = () => {
    //Remove token from localstorage
    localStorage.removeItem("auth-token");
    //Set auth info to  its default state
    setAuthInfo({ ...defaultAuthInfo });
  };
  useEffect(() => {
    isAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ authInfo, handleLogin, isAuth, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
