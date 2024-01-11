import React from "react";

const NotFoundText = ({ text, visible }) => {
  if (!visible) return null;
  return (
    <h1 className="font-semibold text-3xl dark:text-white text-secondary text-center py-5 opacity-40">
      {text}
    </h1>
  );
};

export default NotFoundText;
