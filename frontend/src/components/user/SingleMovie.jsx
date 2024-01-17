import React, { useEffect, useState } from "react";
import { getSingleMovie } from "../../api/movie";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth, useNotification } from "../../hooks";
import Container from "../Container";
import RatingStar from "../RatingStar";
import RelatedMovies from "../RelatedMovies";
import AddRatingModal from "../modals/AddRatingModal";
import CustomButtonLink from "../CustomButtonLink";
import ProfileModal from "../modals/ProfileModal";

//To handle review count if its more then 999
const convertReviewCount = (count = 0) => {
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
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState({});

  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
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
    setShowRatingModal(true);
  };

  const hideRatingModal = () => {
    setShowRatingModal(false);
  };

  const handleOnRatingSuccess = (reviews) => {
    setMovie({ ...movie, reviews: { ...reviews } });
  };

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  const hideProfileModal = () => {
    setShowProfileModal(false);
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
      <Container className="xl:px-0 px-2 ">
        <video src={trailer} poster={poster} controls />
        <div className="flex justify-between">
          <h1 className="xl:text-4xl lg:text-3xl text-2xl text-highlight dark:text-highlight-dark font-semibold py-3">
            {title}
          </h1>
          <div className="flex flex-col items-end">
            <RatingStar rating={reviews.ratingAvg} />
            {/*<Link
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
          </button>*/}
            <CustomButtonLink
              label={convertReviewCount(reviews.reviewsCount) + " Reviews"}
              onClick={() => navigate("/movie/reviews/" + id)}
            />

            <CustomButtonLink
              label="Rate The Movie"
              onClick={handleOnRateMovie}
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-light-subtle dark:text-dark-subtle">{storyLine}</p>
          {/*This is a refector code, Check old code down for ref */}
          <ListWithLabel label="Director :">
            <CustomButtonLink
              label={director.name}
              onClick={() => handleProfileClick(director)}
            />
          </ListWithLabel>

          <ListWithLabel label="Writers :">
            {writers.map((w) => {
              return <CustomButtonLink label={w.name} key={w.id} />;
            })}
          </ListWithLabel>

          <ListWithLabel label="Cast :">
            {/*We will only display lead actors here */}

            {cast.map(({ id, profile, leadActor }) => {
              return leadActor ? (
                <CustomButtonLink label={profile.name} key={id} />
              ) : null;
            })}
          </ListWithLabel>

          <ListWithLabel label="Language :">
            <CustomButtonLink label={language} clickable={false} />
          </ListWithLabel>

          <ListWithLabel label="Release Date :">
            <CustomButtonLink
              label={convertDate(releseDate)}
              clickable={false}
            />
          </ListWithLabel>

          <ListWithLabel label="Genres :">
            {genres.map((g) => {
              return <CustomButtonLink label={g} key={g} clickable={false} />;
            })}
          </ListWithLabel>

          <ListWithLabel label="Type :">
            <CustomButtonLink label={type} clickable={false} />
          </ListWithLabel>

          <CastProfiles cast={cast} />
          <RelatedMovies movieId={movieId} />
        </div>
      </Container>

      <ProfileModal
        visible={showProfileModal}
        onClose={hideProfileModal}
        profileId={selectedProfile.id}
      />

      <AddRatingModal
        visible={showRatingModal}
        onClose={hideRatingModal}
        onSuccess={handleOnRatingSuccess}
      />
    </div>
  );
};

export default SingleMovie;

const ListWithLabel = ({ children, label }) => {
  return (
    <div className="flex space-x-2">
      <p className="text-light-subtle dark:text-dark-subtle font-semibold">
        {label}
      </p>
      {children}
    </div>
  );
};

const CastProfiles = ({ cast }) => {
  return (
    <div className="">
      <h1 className="text-light-subtle dark:text-dark-subtle font-semibold text-2xl mb-2">
        Cast :
      </h1>
      <div className="flex flex-wrap space-x-4">
        {cast.map(({ profile, id, roleAs }) => {
          return (
            <div
              key={id}
              className="flex flex-col items-center text-center basis-28 mb-4"
            >
              <img
                className="w-24 h-24 aspect-square object-cover rounded-full"
                src={profile.avatar}
                alt={profile.name}
              />

              <CustomButtonLink label={profile.nam} />
              {/*              <p className="text-highlight dark:text-highlight-dark hover:underline cursor-pointer">
                {c.profile.name}
          </p>*/}
              <span className="text-light-subtle dark:text-dark-subtle text-sm">
                as
              </span>
              <p className="text-light-subtle dark:text-dark-subtle">
                {roleAs}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
/**
 * Old Code
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
 */
