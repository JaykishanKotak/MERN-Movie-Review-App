import React, { useEffect, useState } from "react";
import GridContainer from "../GridContainer";
import { getTopRatedMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieList from "./MovieList";

const TopRatedMovies = () => {
  const [movies, setMovies] = useState([]);
  const { updateNotification } = useNotification();
  const fetchMovies = async () => {
    const { movies, error } = await getTopRatedMovies();
    if (error) return updateNotification("error", error);
    setMovies([...movies]);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return <MovieList movies={movies} title="Viewer's Choice (Movies)" />;
};

export default TopRatedMovies;
