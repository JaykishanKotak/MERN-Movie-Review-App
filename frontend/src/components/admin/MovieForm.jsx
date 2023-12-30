import React from "react";
import TagsInput from "../TagsInput";
import LiveSearch from "../LiveSearch";
import { commonInputClasses } from "../../utils/theme";
import { fakeProfilesData } from "../../utils/fakeProfilesData";

const results = fakeProfilesData;

const MovieForm = () => {
  //Movie form will be in 2 sections
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const renderItem = (result) => {
    return (
      <div className="flex rounded overflow-hidden">
        <img
          src={result.avatar}
          alt="avatar"
          className="h-16 w-16 object-cover"
        />
        <p className="dark:text-white font-semibold">{result.name}</p>
      </div>
    );
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
          <Label htmlFor="tags">Tags</Label>w
          <TagsInput name="tags" />
        </div>

        <LiveSearch
          results={results}
          placeholder="Search Profiles..."
          renderItem={renderItem}
          onSelect={(result) => console.log(result)}
        />
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
