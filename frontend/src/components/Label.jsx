import React from "react";

const Label = ({ children, htmlFor }) => {
  return (
    <label
      className="dark:text-dark-subtle text-light-subtle font-semibold"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
};

export default Label;
