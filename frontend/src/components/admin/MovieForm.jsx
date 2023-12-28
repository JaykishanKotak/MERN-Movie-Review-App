import React from "react";
import TagsInput from "../TagsInput";

const commonInputClasses =
  "w-full bg-transparent outline-none dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary transition dark:text-white text-primary";
const MovieForm = () => {
  //Movie form will be in 2 sections
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSubmit} className="flex space-x-3">
      {/*Section 1 */}
      <div className="w-[70%] h-5 space-y-5">
        <div>
          {/*w-full bg-transparent outline-none dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary transition dark:text-white text-primary*/}
          <Label htmlFor="title">Title</Label>
          <input
            id="title"
            type="text"
            className={commonInputClasses + " border-b-2 font-semibold text-xl"}
            placeholder="Movie Title"
          />
        </div>

        <div>
          <Label htmlFor="storyline">Story Line</Label>
          <textarea
            id="storyline"
            className={commonInputClasses + " border-b-2 resize-none h-24"}
            placeholder="Movie Storyline"
          />
        </div>

        <div>
          <TagsInput />
        </div>
      </div>

      {/*Section 2 */}
      <div className="w-[30%] h-5 bg-blue-400"></div>
    </form>
  );
};

export default MovieForm;

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
