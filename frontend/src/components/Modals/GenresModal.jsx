import React, { useEffect, useState } from "react";
import ModalContainer from "./ModalContainer";
import genres from "../../utils/genres";
import Submit from "../form/Submit";

const GenresModal = ({ visible, onClose, onSubmit, previousSelection }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const handleGenresSelector = (gen) => {
    let newGenres = [];

    //Remove if Genre is alredy selected
    if (selectedGenres.includes(gen)) {
      newGenres = selectedGenres.filter((genre) => genre !== gen);
    } else {
      newGenres = [...selectedGenres, gen];
    }

    setSelectedGenres([...newGenres]);
  };

  const handleSubmit = () => {
    onSubmit(selectedGenres);
    onClose();
  };

  const handleClose = () => {
    setSelectedGenres(previousSelection);
    onClose();
  };

  //Load Previous selected genres
  useEffect(() => {
    setSelectedGenres(previousSelection);
  }, []);

  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <h1 className="dark:text-white text-primary text-2xl font-semibold text-center">
            Select Genres
          </h1>
          <div className="space-y-3">
            {genres.map((gen) => {
              return (
                <Genre
                  onClick={() => handleGenresSelector(gen)}
                  key={gen}
                  selected={selectedGenres.includes(gen)}
                >
                  {gen}
                </Genre>
              );
            })}
          </div>
        </div>
        <div className="w-56 self-end">
          <Submit type="button" value="Select" onClick={handleSubmit} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default GenresModal;

const Genre = ({ children, selected, onClick }) => {
  const getSelectedStyle = () => {
    return selected
      ? "dark:bg-white bg-light-subtle dark:text-primary text-white"
      : "dark:text-white text-primary";
  };
  return (
    <button
      onClick={onClick}
      className={
        getSelectedStyle() +
        " border-2 dark:border-dark-subtle border-light-subtle p-1 rounded mr-3"
      }
    >
      {children}
    </button>
  );
};
