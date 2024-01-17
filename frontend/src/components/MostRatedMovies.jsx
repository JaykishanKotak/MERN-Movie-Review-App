import React, { useEffect, useState } from "react";
import { useNotification } from "../hooks";
import { getMostRatedMovies } from "../api/admin";
import AppInfoTitle from "./AppInfoTitle";
import RatingStar from "./RatingStar";
import { convertReviewCount } from "../utils/helper";

const MostRatedMovies = () => {
  const [movies, setMovies] = useState([]);
  const { updateNotificaion } = useNotification();

  const fetchMostRatedMovies = async () => {
    const { error, movies } = await getMostRatedMovies();
    if (error) return updateNotificaion("error", error);
    setMovies([...movies]);
  };

  useEffect(() => {
    fetchMostRatedMovies();
  }, []);

  return (
    <div className="dark:bg-secondary dark:shadow bg-white shadow p-5 rounded">
      <AppInfoTitle title="Most Rated Movies" />

      <ul className="space-y-3">
        {" "}
        {movies.map((movie) => {
          return (
            <li key={movie.id}>
              <h1 className="dark:text-white text-secondary font-semibold">
                {movie.title}
              </h1>
              <div className="flex space-x-2">
                <RatingStar rating={movie.reviews.ratingAvg} />
                <p className="dark:text-dark-subtle text-light-subtle">
                  {convertReviewCount(movie.reviews.reviewsCount)} Reviews
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MostRatedMovies;
