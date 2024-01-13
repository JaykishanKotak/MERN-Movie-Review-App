import React, { createContext, useState } from "react";
import { getMovies } from "../api/movie";
import { useNotification } from "../hooks";

export const MovieContext = createContext();
const limit = 5;
let currentPageNo = 0;
const MoviesProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [latestUploads, setLatestUploads] = useState([]);

  const { updateNotification } = useNotification();
  const fetchMovies = async (pageNo = currentPageNo) => {
    const { error, movies } = await getMovies(pageNo, limit);
    if (error) return updateNotification("error", error);

    if (!movies.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }
    setMovies([...movies]);
  };

  const fetchNextPage = () => {
    //If we are on last page
    if (reachedToEnd) return;
    currentPageNo += 1;
    fetchMovies(currentPageNo);
  };

  const fetchPrevPage = () => {
    //If we are on first page
    if (currentPageNo <= 0) return;

    //If we alredy at first page - reset the reachedToEnd Flag
    //Modern JS will allow single line conditions without {}
    if (reachedToEnd) setReachedToEnd(false);
    currentPageNo -= 1;
    fetchMovies(currentPageNo);
  };

  const fetchLatestUpload = async (qty = 5) => {
    const { error, movies } = await getMovies(0, qty);
    if (error) return updateNotification("error", error);

    setLatestUploads([...movies]);
  };
  return (
    <MovieContext.Provider
      value={{
        movies,
        fetchMovies,
        fetchNextPage,
        fetchPrevPage,
        latestUploads,
        fetchLatestUpload,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export default MoviesProvider;
