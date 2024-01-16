import React, { useEffect, useState } from "react";
import { getSingleMovie } from "../../api/movie";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth, useNotification } from "../../hooks";
import Container from "../Container";
import RatingStar from "../RatingStar";
import RelatedMovies from "../RelatedMovies";

//To handle review count if its more then 999
const convertReviewCount = (count) => {
  if (count <= 999) {
    return count;
  }
  //Ex   parseFloat(1222 / 1000).toFixed(2) => 1.22;
  //If reviews if more then 999 we will add to K formate ex : 1222 -> 1.22k with last 2 digits
  return parseFloat(count / 1000).toFixed(2) + "k";
};

//To conver release date
const convertDate = (date = "") => {
  return date.split("T")[0];
};
const SingleMovie = () => {
  const [movie, setMovie] = useState({});
  const [ready, setReady] = useState(false);

  const { isLoggedIn } = useAuth();

  const navigate = useNavigate();

  const { updateNotification } = useNotification();
  const { movieId } = useParams();
  const fetchMovie = async () => {
    setReady(false);
    const { movie, error } = await getSingleMovie(movieId);
    if (error) return updateNotification("error", error);
    setReady(true);
    setMovie(movie);
  };

  useEffect(() => {
    if (movieId) fetchMovie();
  }, []);

  if (!ready)
    return (
      <div className="h-screen flex justify-center items-center dark:bg-primary bg-white">
        <p className="text-light-subtle dark:text-dark-subtle animate-pulse ">
          Please Wait ....
        </p>
      </div>
    );

  const handleOnRateMovie = () => {
    if (!isLoggedIn) return navigate("/auth/signin");
  };
  const {
    trailer,
    poster,
    title,
    storyLine,
    language,
    releseDate,
    type,
    id,
    director = {},
    writers = [],
    reviews = [],
    cast = [],
    genres = [],
  } = movie;
  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <Container>
        <video src={trailer} poster={poster} controls />
        <div className="flex justify-between">
          <h1 className="text-4xl text-highlight dark:text-highlight-dark font-semibold py-3">
            {title}
          </h1>
          <div className="flex flex-col items-end">
            <RatingStar rating={reviews.ratingAvg} />
            <Link
              className="text-highlight dark:text-highlight-dark hover:underline"
              to={"/movie/reviews/" + id}
            >
              {convertReviewCount(reviews.reviewsCount)} Reviews
            </Link>
            <button
              type="button"
              className="text-highlight dark:text-highlight-dark hover:underline"
              onClick={handleOnRateMovie}
            >
              Rate The Movie
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-light-subtle dark:text-dark-subtle">{storyLine}</p>

          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Director :
            </p>
            <p className="text-highlight dark:text-highlight-dark hover:underline cursor-pointer">
              {director.name}
            </p>
          </div>

          <div className="flex">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold mr-2">
              Writers :
            </p>
            <div className="flex space-x-2">
              {writers.map((w) => {
                return (
                  <p
                    key={w.id}
                    className="text-highlight dark:text-highlight-dark hover:underline cursor-pointer"
                  >
                    {w.name}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="flex">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold mr-2">
              Cast :
            </p>
            <div className="flex space-x-2">
              {/*We will only display lead actors here */}
              {cast.map((c) => {
                return c.leadActor ? (
                  <p
                    key={c.profile.id}
                    className="text-highlight dark:text-highlight-dark hover:underline cursor-pointer"
                  >
                    {c.profile.name}
                  </p>
                ) : null;
              })}
            </div>
          </div>

          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Language :
            </p>
            <p className="text-highlight dark:text-highlight-dark">
              {language}
            </p>
          </div>

          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Release Date :
            </p>
            <p className="text-highlight dark:text-highlight-dark">
              {convertDate(releseDate)}
            </p>
          </div>

          <div className="flex">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold mr-2">
              Genres :
            </p>
            <div className="flex space-x-2">
              {genres.map((g) => {
                return (
                  <p
                    key={g}
                    className="text-highlight dark:text-highlight-dark"
                  >
                    {g}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Type :
            </p>
            <p className="text-highlight dark:text-highlight-dark">{type}</p>
          </div>
        </div>

        <div className="mt-5">
          {" "}
          <h1 className="text-light-subtle dark:text-dark-subtle font-semibold text-2xl mb-2">
            Cast :{" "}
          </h1>
          <div className="grid grid-cols-10 mt-5 ">
            {cast.map((c) => {
              return (
                <div className="flex flex-col items-center">
                  <img
                    key={c.profile.id}
                    className="w-24 h-24 aspect-square object-cover rounded-full"
                    src={c.profile.avatar}
                    alt={c.profile.name}
                  />
                  <p className="text-highlight dark:text-highlight-dark hover:underline cursor-pointer">
                    {c.profile.name}
                  </p>
                  <span className="text-light-subtle dark:text-dark-subtle text-sm">
                    as
                  </span>
                  <p className="text-light-subtle dark:text-dark-subtle">
                    {c.roleAs}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3">
          <RelatedMovies movieId={movieId} />
        </div>
      </Container>
    </div>
  );
};

export default SingleMovie;
