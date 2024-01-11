import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
const AppSearchForm = ({ placeholder, onSubmit, showResetIcon, onReset }) => {
  const [value, setValue] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  const handleReset = () => {
    setValue("");
    onReset();
  };
  return (
    <form onSubmit={handleOnSubmit} className="relative">
      <input
        type="text"
        className="border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary  transition bg-transparent rounded text-lg p-1 outline-none dark:text-white"
        placeholder={placeholder}
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />
      {showResetIcon ? (
        <button
          onClick={handleReset}
          type="button"
          className="absolute top-1/2 -translate-y-1/2 right-2 dark:text-white text-secondary"
        >
          <AiOutlineClose />
        </button>
      ) : null}
    </form>
  );
};

export default AppSearchForm;
