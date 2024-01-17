import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPublicMovie } from "../../api/movie";
import { useNotification } from "../../hooks";
import NotFoundText from "../NotFoundText";
import MovieList from "./MovieList";
import Container from "../Container";

const SearchMovies = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("title");

  const [movies, setMovies] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(false);

  const { updateNotification } = useNotification();
  const searchMovie = async (val) => {
    const { error, results } = await searchPublicMovie(val);

    if (error) {
      return updateNotification("error", error);
    }
    if (!results.length) {
      setResultNotFound(true);
      return setMovies([]);
    }
    setResultNotFound(false);
    setMovies([...results]);
  };

  //We will call the effect when ever query changes
  useEffect(() => {
    //Call search method
    if (query.trim()) {
      searchMovie(query);
    }
  }, [query]);

  return (
    <div className="dark:bg-primary bg-dark min-h-screen py-8">
      <Container className="px-2 xl:p-0 ">
        <NotFoundText text="Record not found !" visible={resultNotFound} />
        <MovieList movies={movies} />
      </Container>
    </div>
  );
};

export default SearchMovies;
