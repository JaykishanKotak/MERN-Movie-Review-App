import React, { createContext, useState } from "react";

export const NotificationContext = createContext();

let timeoutId;
export default function NotificationProvider({ children }) {
  // const [notification, setNotification] = useState({
  //   type: "",
  //   value: "",
  // });

  const [notification, setNotification] = useState("");

  //For Color according to type of error
  const [classes, setClasses] = useState("");

  //Method to update any kind of notification
  const updateNotification = (type, value) => {
    //Clear timeout to run only a error till 3 second delay
    if (timeoutId) clearTimeout(timeoutId);

    switch (type) {
      case "error":
        setClasses("bg-red-500");
        break;
      case "success":
        setClasses("bg-green-500");
        break;
      case "warning":
        setClasses("bg-orange-500");
        break;
      default:
        setClasses("bg-red-500");
    }
    setNotification(value);
    //Remove notification after 3 seconds
    //Settimeout and setinterval returns id
    timeoutId = setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ updateNotification }}>
      {children}
      {notification && (
        <div className="fixed left-1/2 -translate-x-1/2 top-24">
          <div className="bounce-custom shadow-md shadow-gray-400 rounded">
            <p className={classes + " text-white px-4 py-2 font-semibold"}>
              {notification}
            </p>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
