import React from "react";
import { AiFillStar } from "react-icons/ai";

const RatingStar = ({ rating }) => {
  if (!rating)
    return (
      <p className="text-highlight dark:text-highlight-dark flex items-center space-x-1">
        No Reviews
      </p>
    );
  return (
    <p className="text-highlight dark:text-highlight-dark flex items-center space-x-1">
      {/*To use custom text color in tailwind text-[#1f1f1f] */}
      <span>{rating}</span>
      <AiFillStar />
    </p>
  );
};

export default RatingStar;
