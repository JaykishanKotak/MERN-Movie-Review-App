import React, { Fragment, useState } from "react";
import TagsInput from "../TagsInput";
import LiveSearch from "../LiveSearch";
import { commonInputClasses } from "../../utils/theme";
import { fakeProfilesData } from "../../utils/fakeProfilesData";
import Submit from "../form/Submit";
import { useNotification, useSearch } from "../../hooks";
import ModalContainer from "../Modals/ModalContainer";
import WritersModal from "../Modals/WritersModal";
import CastForm from "../form/CastForm";
import CastModal from "../Modals/CastModal";
import PosterSelector from "../PosterSelector";
import GenresSelector from "../GenresSelector";
import GenresModal from "../Modals/GenresModal";
import Selector from "../Selector";
import {
  languageOptions,
  statusOptions,
  typeOptions,
} from "../../utils/options";
import DirectorSelector from "../DirectorSelector";
import Label from "../Label";
import WriterSelector from "../WriterSelector";
import ViewAllButton from "../ViewAllButton";
import LabelWithBadge from "../LabelWithBadge";
import { validateMovie } from "../../utils/validator";
import { useEffect } from "react";
// const results = fakeProfilesData;

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

const MovieForm = ({ onSubmit, busy, btnTitle, initialState }) => {
  //Movie form will be in 2 sections

  const { updateNotification } = useNotification();

  const [movieInfo, setMovieInfo] = useState({ ...defaultMovieInfo });

  //For Test
  const [showWritersModal, setShowWritersModal] = useState(false);

  const [showCastModal, setShowCastModal] = useState(false);

  const [showGenresModal, setShowGenresModal] = useState(false);

  const [seletedPosterForUI, setSeletedPosterForUI] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = validateMovie(movieInfo);
    if (error) return updateNotification("error", error);
    const { tags, genres, cast, writers, director, poster } = movieInfo;

    //cast tags genres writer
    const formData = new FormData();
    const finalMovieInfo = { ...movieInfo };
    finalMovieInfo.tags = JSON.stringify(tags);
    finalMovieInfo.genres = JSON.stringify(genres);

    //We only need ids of cast
    /*
    cast: [
      {
        actor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Actor",
        },
        roleAs: { type: String },
        leadActor: { type: Boolean },
      },
    ],
    */
    const finalCast = cast.map((c) => ({
      actor: c.profile.id,
      roleAs: c.roleAs,
      leadActor: c.leadActor,
    }));
    finalMovieInfo.cast = JSON.stringify(finalCast);

    //Writer is optional field
    if (writers.length) {
      //We only need ids of writers
      const finalWriters = writers.map((w) => w.id);
      finalMovieInfo.writers = JSON.stringify(finalWriters);
    }

    if (director.id) {
      //We only need ids of director
      finalMovieInfo.director = director.id;
    }

    if (poster) {
      finalMovieInfo.poster = poster;
    }

    for (let key in finalMovieInfo) {
      formData.append(key, finalMovieInfo[key]);
    }
    onSubmit(formData);
  };

  const {
    title,
    storyLine,
    writers,
    cast,
    tags,
    genres,
    type,
    language,
    status,
    releseDate,
  } = movieInfo;

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSeletedPosterForUI(url);
  };

  const handleChange = ({ target }) => {
    const { value, name, files } = target;
    if (name === "poster") {
      const poster = files[0];
      updatePosterForUI(poster);
      return setMovieInfo({ ...movieInfo, poster });
    }

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

  const displayGenresModal = () => {
    setShowGenresModal(true);
  };

  const hideGenresModal = () => {
    setShowGenresModal(false);
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

  const updateCast = (castInfo) => {
    const { cast } = movieInfo;

    setMovieInfo({ ...movieInfo, cast: [...cast, castInfo] });
  };

  const updateGenres = (genres) => {
    setMovieInfo({ ...movieInfo, genres });
  };

  const displayCastModal = () => {
    setShowCastModal(true);
  };

  const hideCastModal = () => {
    setShowCastModal(false);
  };

  const handleCastRemove = (profileId) => {
    const { cast } = movieInfo;
    //Exclude removed profile id from writersw
    const newCast = cast.filter(({ profile }) => profile.id !== profileId);
    if (!newCast.length) {
      hideCastModal();
    }
    setMovieInfo({ ...movieInfo, cast: [...newCast] });
  };

  // const handleProfileChange = ({ target }) => {
  //   console.log(target.value);
  //   const { name, value } = target;
  //   if (name === "director") {
  //     //We need to pass method as well as query in handle search
  //     setMovieInfo({ ...movieInfo, director: { name: value } });

  //     //Pass director search state updaterFun to update only directors results
  //     handleSearch(searchActor, value, setDirectorsProfille);
  //   }
  //   if (name == "writers") {
  //     setWriterName(value);
  //     handleSearch(searchActor, value, setWritersProfille);
  //   }
  // };

  //For Update Part
  useEffect(() => {
    if (initialState) {
      //Update movie info and poster
      setMovieInfo({
        ...initialState,
        poster: null,
        releseDate: initialState.releseDate.split("T")[0],
      });
      setSeletedPosterForUI(initialState.poster);
      console.log(initialState);
    }
  }, [initialState]);

  return (
    <Fragment>
      <div className="flex space-x-3">
        {/*Section 1 */}
        <div className="w-[70%] space-y-5">
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
            <TagsInput value={tags} name="tags" onChange={updateTags} />
          </div>

          <DirectorSelector onSelect={updateDirector} />

          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={writers.length} htmlFor="writers">
                Writers
              </LabelWithBadge>
              <ViewAllButton
                visible={writers.length}
                onClick={displayWritersModal}
              >
                View All
              </ViewAllButton>
            </div>
            <WriterSelector onSelect={updateWriters} />
          </div>

          <div>
            <div className="flex justify-between">
              <LabelWithBadge badge={cast.length}>
                Add Cast & Crew
              </LabelWithBadge>
              <ViewAllButton visible={cast.length} onClick={displayCastModal}>
                View All
              </ViewAllButton>
            </div>
            <CastForm onSubmit={updateCast} />
          </div>

          <input
            type="date"
            name="releseDate"
            //className={commonInputClasses + " border-2 rounded p-1 w-auto"}
            className="bg-transparent outline-none dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary transition dark:text-white text-primary border-2 rounded p-1 w-auto"
            onChange={handleChange}
            value={releseDate}
          />
          <Submit
            busy={busy}
            type="button"
            onClick={handleSubmit}
            value={btnTitle}
          />
        </div>

        {/*Section 2 */}
        <div className="w-[30%] space-y-5">
          <PosterSelector
            name="poster"
            onChange={handleChange}
            selectedPoster={seletedPosterForUI}
            accept="image/jpeg, image/jpg, image/png"
            label="Select Poster"
          />
          <GenresSelector badge={genres.length} onClick={displayGenresModal} />

          <Selector
            onChange={handleChange}
            name="type"
            label="Type"
            value={type}
            options={typeOptions}
          />
          <Selector
            onChange={handleChange}
            name="language"
            label="Language"
            value={language}
            options={languageOptions}
          />
          <Selector
            onChange={handleChange}
            name="status"
            label="Status"
            value={status}
            options={statusOptions}
          />
        </div>
      </div>
      {/*<ModalContainer onClose={() => setShowWritersModal(false)} visible={showModal}>
        <div className="p-20 bg-red-200"></div>
      </ModalContainer> */}

      <WritersModal
        profiles={writers}
        onRemoveClick={handleWriterRemove}
        onClose={hideWritersModal}
        visible={showWritersModal}
      />

      <CastModal
        casts={cast}
        onRemoveClick={handleCastRemove}
        onClose={hideCastModal}
        visible={showCastModal}
      />

      <GenresModal
        visible={showGenresModal}
        onClose={hideGenresModal}
        onSubmit={updateGenres}
        previousSelection={genres}
      />
    </Fragment>
  );
};

export default MovieForm;
