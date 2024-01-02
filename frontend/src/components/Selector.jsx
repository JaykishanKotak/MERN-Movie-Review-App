import React from "react";

const Selector = ({ name, value, options, label, onChange }) => {
  return (
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="border-2 dark:bg-primary bg-white dark:border-dark-subtle border-light-subtle p-1 pr-10 dark:focus:border-white focus:border-primary outline-none transition rounded bg-transparent dark:text-dark-subtle text-light-subtle dark:focus:text-white focus:text-primary"
    >
      <option value="">{label}</option>
      {options.map(({ title, value }) => {
        return (
          <option key={title} value={value}>
            {title}
          </option>
        );
      })}
    </select>
  );
};

export default Selector;
