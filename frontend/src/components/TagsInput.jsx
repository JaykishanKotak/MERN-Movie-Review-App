import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const TagsInput = ({ name, onChange, value }) => {
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);

  const input = useRef();

  const tagsInput = useRef();

  useEffect(() => {
    //Scroll Ref :- https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
    input.current.scrollIntoView();
  }, [tag]);

  const handleOnChange = ({ target }) => {
    const { value } = target;
    if (value != ",") {
      setTag(value);
      onChange(tags);
    }
  };

  useEffect(() => {
    onChange(tags);
  }, [tags]);

  useEffect(() => {
    if (value.length) setTags(value);
  }, [value]);

  const handleKeyDown = ({ key }) => {
    // console.log(key);
    //Only accepts on comma and enter keys
    if (key === "," || key === "Enter") {
      if (!tag) return;

      //prevent repetation on tags
      if (tags.includes(tag)) return setTag("");

      setTags([...tags, tag]);
      //Reset input fields
      setTag("");
    }

    //We added !tag as condition here to handle backspace while typing the tag values
    if (key === "Backspace" && !tag && tags.length) {
      //Remove last tag - Filter excludes last items of tags
      const newTags = tags.filter((_, index) => index !== tags.length - 1);
      setTags([...newTags]);
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags([...newTags]);
  };

  const handleOnFocus = () => {
    tagsInput.current.classList.remove(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.add("dark:border-white", "border-primary");
  };

  const handleOnBlur = () => {
    tagsInput.current.classList.add(
      "dark:border-dark-subtle",
      "border-light-subtle"
    );
    tagsInput.current.classList.remove("dark:border-white", "border-primary");
  };

  return (
    <div
      ref={tagsInput}
      className="border-2 bg-transparent dark:border-dark-subtle border-light-subtle  px-2 h-10 rounded w-full text-white flex items-center space-x-2 overflow-x-auto custom-scroll-bar transition"
      onKeyDown={handleKeyDown}
    >
      {tags.map((t) => (
        <Tag key={t} onClick={() => removeTag(t)}>
          {t}
        </Tag>
      ))}

      <input
        ref={input}
        type="text"
        className="h-full flex-grow bg-transparent outline-none dark:text-white text-primary"
        placeholder="Tag one ,Tag Two ,Tag Three "
        id={name}
        value={tag}
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      />
    </div>
  );
};

export default TagsInput;

const Tag = ({ children, onClick }) => {
  {
    /* to make whole contect in single line - whitespace-nowrap*/
  }
  return (
    <span className="dark:bg-white bg-primary dark:text-primary text-white flex items-center text-sm px-1 whitespace-nowrap">
      {children}
      <button type="button" onClick={onClick}>
        <AiOutlineClose size={12} />
      </button>
    </span>
  );
};
