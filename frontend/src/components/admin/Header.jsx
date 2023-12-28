import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsFillSunFill } from "react-icons/bs";
import { useTheme } from "../../hooks";

const Header = ({ onAddMovieClick, onAddActorClick }) => {
  const [showOptions, setShowOptions] = useState(false);

  const { toggleTheme } = useTheme();

  const options = [
    { title: "Add Movie", onClick: onAddMovieClick },
    { title: "Add Actor", onClick: onAddActorClick },
  ];
  return (
    <div className="flex items-center justify-between relative">
      <input
        type="text"
        className="border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary  transition bg-transparent rounded text-lg p-1 outline-none dark:text-white"
        placeholder="Search Movies..."
      />
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleTheme}
          className="dark:text-white text-light-subtle"
        >
          <BsFillSunFill size={24} />
        </button>
        <button
          onClick={() => setShowOptions(true)}
          className="flex items-center space-x-2 dark:border-dark-subtle border-light-subtle dark:text-dark-subtle text-light-subtle hover:opacity-80 transition font-semibold border-2 rounded text-lg px-3 py-1"
        >
          {" "}
          <span>Create</span> <AiOutlinePlus />
        </button>

        <CreateOptions
          visible={showOptions}
          onClose={() => setShowOptions(false)}
          options={options}
        />
      </div>
    </div>
  );
};

export default Header;

const CreateOptions = ({ options, visible, onClose }) => {
  const container = useRef();
  const containerID = "options-container";

  const handleAnimationEnd = (e) => {
    //Unmount component from DOM
    if (e.target.classList.contains("animate-scale-reverse")) onClose();

    e.target.classList.remove("animate-scale");
  };
  useEffect(() => {
    const handleClose = (e) => {
      //If component is not renderd
      if (!visible) return;

      const { parentElement, id } = e.target;
      console.log(parentElement, id);

      if (parentElement.id === containerID || id === containerID) return;
      //To show hide container animation

      // Old Code (Before React 18)
      // container.current.classList.remove("animate-scale");
      // container.current.classList.add("animate-scale-reverse");

      // New Update
      if (container.current) {
        if (!container.current.classList.contains("animate-scale"))
          container.current.classList.add("animate-scale-reverse");
      }
    };
    document.addEventListener("click", handleClose);
    //Clean up when unmount the component -> Cleanuop function
    return () => {
      document.removeEventListener("click", handleClose);
    };
  }, [visible]);
  if (!visible) return null;
  return (
    <div
      id={containerID}
      ref={container}
      className="absolute right-0 top-12 flex flex-col space-y-3 p-5 dark:bg-secondary bg-white drop-shadow-lg rounded animate-scale"
      onAnimationEnd={handleAnimationEnd}
    >
      {options.map(({ title, onClick }) => {
        return <Option onClick={onClick}>{title}</Option>;
      })}
    </div>
  );
};

const Option = ({ children, onClick }) => {
  return (
    <button
      className="dark:text-white text-secondary hover:opacity-80 transition"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
