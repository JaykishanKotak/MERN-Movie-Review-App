import React from "react";
import GridContainer from "../GridContainer";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import RatingStar from "../RatingStar";

const trimTitle = (text = "") => {
  if (text.length <= 20) {
    return text;
  }
  return text.substring(0, 20) + "..";
};

const MovieList = ({ title, movies = [] }) => {
  if (!movies.length) return null;
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-5 dark:text-white text-secondary">
        {title}
      </h1>
      <GridContainer>
        {/*Array(5)
            .fill("")
            .map((_, index) => {
                return <div className="p-5 bg-red-200" key={index}></div>;
            })*/}
        {movies.map((movie) => {
          return <ListItem movie={movie} key={movie.id} />;
        })}
      </GridContainer>
    </div>
  );
};

export default MovieList;

const ListItem = ({ movie }) => {
  const { id, title, poster, reviews } = movie;
  //We are using link here to redirection on single movie page on click
  return (
    <Link to={"/movie/" + id}>
      <img src={poster} alt={title} className="aspect-video object-cover" />
      <h1
        className="text-lg dark:text-white text-secondary font-semibold"
        title={title}
      >
        {trimTitle(title)}
      </h1>
      <RatingStar rating={reviews.ratingAvg} />
      {/*reviews.ratingAvg ? (
        <p className="text-highlight dark:text-highlight-dark flex items-center space-x-1">
          <span>{reviews.ratingAvg}</span>
          <AiFillStar />
        </p>
      ) : (
        <p className="text-highlight dark:text-highlight-dark flex items-center space-x-1">
          No Reviews
        </p>
      )*/}
    </Link>
  );
};
