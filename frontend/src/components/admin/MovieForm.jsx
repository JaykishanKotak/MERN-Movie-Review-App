import React, { Fragment, useState } from "react";
import TagsInput from "../TagsInput";
import LiveSearch from "../LiveSearch";
import { commonInputClasses } from "../../utils/theme";
import { fakeProfilesData } from "../../utils/fakeProfilesData";
import Submit from "../form/Submit";
import { useNotification } from "../../hooks";
import ModalContainer from "../Modals/ModalContainer";
import WritersModal from "../Modals/WritersModal";

const results = fakeProfilesData;

const defaultMovieInfo = {
  title: "",
  storyLine: "",
  tags: [],
  cast: [],
  director: {},
  writers: [],
  releseDate: "",
  poster: null,
  genres: [],
  type: "",
  language: "",
  status: "",
};
const MovieForm = () => {
  //Movie form will be in 2 sections

  const { updateNotification } = useNotification();

  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });

  //For Test
  const [showWritersModal, setShowWritersModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(movieInfo);
  };

  const renderItem = (result) => {
    return (
      <div className="flex rounded overflow-hidden">
        <img
          src={result.avatar}
          alt={result.name}
          className="h-16 w-16 object-cover"
        />
        <p className="dark:text-white font-semibold">{result.name}</p>
      </div>
    );
  };

  const { title, storyLine, director, writers } = movieInfo;

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setMovieInfo({ ...movieInfo, [name]: value });
  };

  const updateTags = (tags) => {
    setMovieInfo({ ...movieInfo, tags });
  };

  const updateDirector = (profile) => {
    setMovieInfo({ ...movieInfo, director: profile });
  };

  const updateWriters = (profile) => {
    const { writers } = movieInfo;
    for (let writer of writers) {
      if (writer.id === profile.id) {
        return updateNotification(
          "warning",
          "This profile is alredy selected !"
        );
      }
    }
    setMovieInfo({ ...movieInfo, writers: [...writers, profile] });
  };

  const displayWritersModal = () => {
    setShowWritersModal(true);
  };

  const hideWritersModal = () => {
    setShowWritersModal(false);
  };

  const handleWriterRemove = (profileId) => {
    const { writers } = movieInfo;
    //Exclude removed profile id from writersw
    const newWriters = writers.filter(({ id }) => id !== profileId);
    if (!newWriters.length) {
      hideWritersModal();
    }
    setMovieInfo({ ...movieInfo, writers: [...newWriters] });
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit} className="flex space-x-3">
        {/*Section 1 */}
        <div className="w-[70%] h-5 space-y-5">
          <div>
            {/*w-full bg-transparent outline-none dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary transition dark:text-white text-primary*/}
            <Label htmlFor="title">Title</Label>
            <input
              value={title}
              onChange={handleChange}
              name="title"
              id="title"
              type="text"
              className={
                commonInputClasses + " border-b-2 font-semibold text-xl"
              }
              placeholder="Movie Title"
            />
          </div>

          <div>
            <Label htmlFor="storyline">Story Line</Label>
            <textarea
              value={storyLine}
              onChange={handleChange}
              name="storyLine"
              id="storyLine"
              className={commonInputClasses + " border-b-2 resize-none h-24"}
              placeholder="Movie Storyline"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <TagsInput onChange={updateTags} name="tags" />
          </div>

          <div>
            <Label htmlFor="director">Director</Label>
            <LiveSearch
              name="director"
              value={director.name}
              results={results}
              placeholder="Search Profiles..."
              renderItem={renderItem}
              onSelect={updateDirector}
            />
          </div>

          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={writers.length} htmlFor="writers">
                Writers
              </LabelWithBadge>
              <button
                onClick={displayWritersModal}
                className="dark:text-white text-primary hover:underline transition"
              >
                View All
              </button>
            </div>
            <LiveSearch
              name="writers"
              // value={director.name}
              results={results}
              placeholder="Search Profiles..."
              renderItem={renderItem}
              onSelect={updateWriters}
            />
          </div>
          <Submit value="Upload" />
        </div>

        {/*Section 2 */}
        <div className="w-[30%] h-5 bg-blue-400"></div>
      </form>
      {/*<ModalContainer onClose={() => setShowWritersModal(false)} visible={showModal}>
        <div className="p-20 bg-red-200"></div>
      </ModalContainer> */}

      <WritersModal
        profiles={writers}
        onRemoveClick={handleWriterRemove}
        onClose={hideWritersModal}
        visible={showWritersModal}
      />
    </Fragment>
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

const LabelWithBadge = ({ children, htmlFor, badge }) => {
  const renderBadge = () => {
    return (
      <span className="dark:bg-dark-subtle bg-light-subtle text-white absolute translate-x-2 translate-y-1 text-xs top-0 right-0 w-5 h-5 rounded-full flex justify-center items-center">
        {badge <= 9 ? badge : "9+"}
      </span>
    );
  };
  return (
    <div className="relative">
      <Label htmlFor={htmlFor}>{children}</Label>
      {renderBadge()}
    </div>
  );
};
