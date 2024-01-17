import React, { useEffect, useState } from "react";
import { useNotification } from "../../hooks";
import MovieList from "./MovieList";
import { getTopRatedMovies } from "../../api/movie";

const TopRatedWebSeries = () => {
  const [movies, setMovies] = useState([]);
  const { updateNotification } = useNotification();
  const fetchMovies = async (signal) => {
    const { movies, error } = await getTopRatedMovies("Web Series", signal);
    if (error) return updateNotification("error", error);
    setMovies([...movies]);
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchMovies(ac.signal);
    return () => {
      ac.abort();
    };
  }, []);

  return <MovieList movies={movies} title="Viewer's Choice (Web Series)" />;
};

export default TopRatedWebSeries;
