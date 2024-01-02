import React from "react";

const commonPosterUI =
  "flex justify-center items-center border border-dashed rounded aspect-video dark:border-dark-subtle border-light-subtle cursor-pointer";
const PosterSelector = ({ name, selectedPoster, onChange, accept }) => {
  return (
    <div>
      <input
        accept={accept}
        name={name}
        id={name}
        onChange={onChange}
        type="file"
        hidden
      />
      <label htmlFor={name}>
        {selectedPoster ? (
          <img
            className={commonPosterUI + " object-cover"}
            src={selectedPoster}
            alt=""
          />
        ) : (
          <PosterUI />
        )}
      </label>
    </div>
  );
};

export default PosterSelector;

const PosterUI = () => {
  return (
    <div className={commonPosterUI}>
      <span className="dark:text-dark-subtle text-light-subtle">
        Select Poster
      </span>
    </div>
  );
};
