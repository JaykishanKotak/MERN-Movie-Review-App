import React from "react";
import AppInfoTitle from "./AppInfoTitle";

const AppInfoBox = ({ title, subTitle }) => {
  return (
    <div className="dark:bg-secondary dark:shadow bg-white shadow p-5 rounded">
      <AppInfoTitle title={title} />
      <p className="text-xl mb-2 dark:text-white text-primary ">{subTitle}</p>
    </div>
  );
};

export default AppInfoBox;
