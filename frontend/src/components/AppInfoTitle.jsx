import React from "react";

const AppInfoTitle = ({ title }) => {
  return (
    <h1 className="font-semibold text-2xl mb-2 dark:text-white text-primary">
      {title}
    </h1>
  );
};

export default AppInfoTitle;
