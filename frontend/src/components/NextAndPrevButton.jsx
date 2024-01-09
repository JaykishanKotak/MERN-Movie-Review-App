import React from "react";

const NextAndPrevButton = ({ onNextClick, onPrevClick, className = "" }) => {
  //To avoide conflict to existing class name
  const getClasses = () => {
    return "flex justify-end items-center space-x-3 ";
  };
  return (
    <div className={getClasses() + className}>
      <Button onClick={onPrevClick} title="Prev" />
      <Button onClick={onNextClick} title="Next" />
    </div>
  );
};

export default NextAndPrevButton;

const Button = ({ title, onClick }) => {
  return (
    <button
      className="dark:text-white text-primary hover:underline"
      type="button"
      onClick={onClick}
    >
      {title}
    </button>
  );
};
