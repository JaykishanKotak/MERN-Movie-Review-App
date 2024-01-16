import React, { useState } from "react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import Submit from "./Submit";

//Arrray to render rating starts
const ratings = new Array(10).fill("");
const RatingForm = ({ onSubmit, busy }) => {
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [content, setContent] = useState("");

  const handleMouseEnter = (index) => {
    //console.log(index);
    //Index is zero based, so we need to increase by 1
    const ratings = new Array(index + 1).fill(index);
    // console.log(ratings);
    setSelectedRatings([...ratings]);
  };

  const handleOnChange = ({ target }) => {
    setContent(target.value);
  };

  const handleSubmit = (e) => {
    if (!selectedRatings.length) return;
    const data = {
      rating: selectedRatings.length,
      content: content,
    };

    onSubmit(data);
  };
  return (
    <div>
      <div className="p-5 bg-white dark:bg-primary rounded space-y-3">
        <div className="flex items-center text-highlight dark:text-highlight-dark relative">
          <StarsOutlined ratings={ratings} onMouseEnter={handleMouseEnter} />

          <div className="flex absolute top-1/2 -translate-y-1/2 items-center">
            <StarsFilled
              ratings={selectedRatings}
              onMouseEnter={handleMouseEnter}
            />
          </div>
        </div>
        <textarea
          value={content}
          onChange={handleOnChange}
          className="h-24 w-full border-2 p-2 text-primary dark:text-white rounded outline-none bg-transparent resize-none"
        ></textarea>
        <Submit busy={busy} onClick={handleSubmit} value="Rate This Movie" />
      </div>
    </div>
  );
};

export default RatingForm;

const StarsOutlined = ({ ratings, onMouseEnter }) => {
  return ratings.map((_, index) => {
    return (
      <AiOutlineStar
        onMouseEnter={() => onMouseEnter(index)}
        className="cursor-pointer"
        key={index}
        size={24}
      />
    );
  });
};

const StarsFilled = ({ ratings, onMouseEnter }) => {
  return ratings.map((_, index) => {
    return (
      <AiFillStar
        onMouseEnter={() => onMouseEnter(index)}
        className="cursor-pointer"
        key={index}
        size={24}
      />
    );
  });
};
