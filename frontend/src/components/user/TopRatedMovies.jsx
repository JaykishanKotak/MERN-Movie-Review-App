import React, { useEffect, useState } from "react";
import GridContainer from "../GridContainer";
import { getTopRatedMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieList from "./MovieList";

const TopRatedMovies = () => {
  const [movies, setMovies] = useState([]);
  const { updateNotification } = useNotification();
  const fetchMovies = async (signal) => {
    const { movies, error } = await getTopRatedMovies(null, signal);
    if (error) return updateNotification("error", error);
    setMovies([...movies]);
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchMovies(ac.signal);
    //Clean up = use to abort async tasks to avoid unwanted errors
    return () => {
      ac.abort();
    };
  }, []);

  return <MovieList movies={movies} title="Viewer's Choice (Movies)" />;
};

export default TopRatedMovies;
