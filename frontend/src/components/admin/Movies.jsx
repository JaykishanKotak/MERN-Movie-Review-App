import React, { useEffect, useState } from "react";
import MovieListItem from "../MovieListItem";
import { getMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import NextAndPrevButton from "../NextAndPrevButton";

const limit = 5;
let currentPageNo = 0;
const Movies = () => {
  const [movies, setMovies] = useState([]);

  const [reachedToEnd, setReachedToEnd] = useState(false);
  const { updateNotification } = useNotification();

  const fetchMovies = async (pageNo) => {
    const { error, movies } = await getMovies(pageNo, limit);
    if (error) return updateNotification("error", error);

    if (!movies.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }
    setMovies([...movies]);
  };
  useEffect(() => {
    fetchMovies(currentPageNo);
  }, []);

  const handleOnNextClick = () => {
    //If we are on last page
    if (reachedToEnd) return;
    currentPageNo += 1;
    fetchMovies(currentPageNo);
  };

  const handleOnPrevClick = () => {
    //If we are on first page
    if (currentPageNo <= 0) return;

    //If we alredy at first page - reset the reachedToEnd Flag
    //Modern JS will allow single line conditions without {}
    if (reachedToEnd) setReachedToEnd(false);
    currentPageNo -= 1;
    fetchMovies(currentPageNo);
  };
  return (
    <div className="space-y-3 p-5">
      {movies.map((movie) => {
        return <MovieListItem key={movie.id} movie={movie} />;
      })}

      <NextAndPrevButton
        onNextClick={handleOnNextClick}
        onPrevClick={handleOnPrevClick}
        className="mt-5"
      />
    </div>
  );
};

export default Movies;
