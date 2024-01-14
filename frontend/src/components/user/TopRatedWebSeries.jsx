import React, { useEffect, useState } from "react";
import { useNotification } from "../../hooks";
import MovieList from "./MovieList";
import { getTopRatedMovies } from "../../api/movie";

const TopRatedWebSeries = () => {
  const [movies, setMovies] = useState([]);
  const { updateNotification } = useNotification();
  const fetchMovies = async () => {
    const { movies, error } = await getTopRatedMovies("Web Series");
    if (error) return updateNotification("error", error);
    setMovies([...movies]);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return <MovieList movies={movies} title="Viewer's Choice (Web Series)" />;
};

export default TopRatedWebSeries;
