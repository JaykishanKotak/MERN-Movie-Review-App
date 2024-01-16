import React, { Fragment, useEffect, useState } from "react";
import AppInfoTitle from "./AppInfoTitle";
import { BsBoxArrowUpRight, BsPencilSquare, BsTrash } from "react-icons/bs";
import { deleteMovie, getMovieForUpdate, getMovies } from "../api/movie";
import { useMovies, useNotification } from "../hooks";
import ConfirmModal from "./modals/ConfirmModal";
import UpdateMovie from "./modals/UpdateMovie";
import MovieListItem from "./MovieListItem";

//Here page no and limit will be const becasue we only show last 5 uploaded movies in Latest uploads
const pageNo = 0;
const limit = 5;

const LatestUploads = () => {
  // const [movies, setMovies] = useState([]);
  // const [showConfirmModal, setShowConfirmModal] = useState(false);
  // const [selectedMovie, setSelectedMovie] = useState(null);
  // const [busy, setBusy] = useState(false);
  // const { updateNotification } = useNotification();
  // const [showUpdateModal, setShowUpdateModal] = useState(false);

  const { fetchLatestUpload, latestUploads } = useMovies();
  // const fetchLatestUpload = async () => {
  //   const { error, movies } = await getMovies(pageNo, limit);
  //   if (error) return updateNotification("error", error);

  //   setMovies([...movies]);
  // };

  useEffect(() => {
    fetchLatestUpload();
  }, []);

  // const handleOnDeleteClick = (movie) => {
  //   setSelectedMovie(movie);
  //   setShowConfirmModal(true);
  // };

  // const hideConfirmModal = () => {
  //   setShowConfirmModal(false);
  // };

  // const handleOnDeleteConfirm = async () => {
  //   setBusy(true);
  //   const { message, error } = await deleteMovie(selectedMovie.id);
  //   setBusy(false);
  //   if (error) return updateNotification("error", error);
  //   updateNotification("success", message);
  //   fetchLatestUpload();
  //   hideConfirmModal();
  // };

  // const handleOnEditClick = async ({ id }) => {
  //   const { movie, error } = await getMovieForUpdate(id);
  //   if (error) return updateNotification("error", error);
  //   setSelectedMovie(movie);
  //   setShowUpdateModal(true);
  // };

  // const hideUpdateModal = () => {
  //   setShowUpdateModal(false);
  // };

  // const handleOnUpdate = (movie) => {
  //   const updatedMovies = movies.map((m) => {
  //     if (m.id === movie.id) {
  //       return movie;
  //     }
  //     return m;
  //   });
  //   setMovies([...updatedMovies]);
  // };

  // const handleAfterDelete = () => fetchLatestUpload();

  const handleUIUpdate = () => {
    fetchLatestUpload();
  };
  return (
    <Fragment>
      <div className="dark:bg-secondary dark:shadow bg-white shadow p-5 rounded col-span-2">
        {/*col-span-2 will allot two grid spaces to div */}
        <AppInfoTitle title="Recent Uploads" />
        <div className="space-y-3">
          {latestUploads.map((movie) => {
            return (
              <MovieListItem
                key={movie.id}
                movie={movie}
                afterDelete={handleUIUpdate}
                afterUpdate={handleUIUpdate}
                // onDeleteClick={() => handleOnDeleteClick(movie)}
                // onEditClick={() => handleOnEditClick(movie)}
              />
            );
          })}
        </div>

        {/* <MovieListItem
      movie={{
        poster:
          "https://images.unsplash.com/photo-1682687220208-22d7a2543e88?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Consequat culpa",
        status: "public",
        genres: ["Action", "Comady"],
      }}
    />*/}
      </div>

      {/*      <ConfirmModal
        visible={showConfirmModal}
        title="Are you sure ?"
        subTitle="This action will remove this movie permanently !"
        onCancel={hideConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        busy={busy}
      />

      <UpdateMovie
        visible={showUpdateModal}
        onClose={hideUpdateModal}
        initialState={selectedMovie}
        onSuccess={handleOnUpdate}
      /> */}
    </Fragment>
  );
};

export default LatestUploads;

const MovieList = ({ movie, onOpenClick, onEditClick, onDeleteClick }) => {
  const { poster, title, genres = [], status } = movie;
  return (
    <table className="w-full border-b">
      <tbody>
        <tr>
          <td>
            <div className="w-24">
              {/*We stored images in landscape format */}
              <img className="w-full aspect-video" src={poster} alt={title} />
            </div>
          </td>
          <td className="w-full pl-5">
            {/*title and genres */}
            <div>
              <h1 className="text-lg font-semibold dark:text-white text-primary">
                {title}
              </h1>
              <div className="space-x-1">
                {genres.map((g, index) => {
                  return (
                    <span
                      key={g + index}
                      className="dark:text-white text-primary text-xs"
                    >
                      {g}
                    </span>
                  );
                })}
              </div>
            </div>
          </td>
          {/*Movie status */}
          <td className="px-5">
            <p className="dark:text-white text-primary">{status}</p>
          </td>

          {/*Buttons */}
          <td>
            <div className="flex items-center space-x-3 dark:text-white text-primary text-lg">
              <button onClick={onDeleteClick} className="" type="button">
                <BsTrash />
              </button>
              <button onClick={onEditClick} className="" type="button">
                <BsPencilSquare />
              </button>
              <button onClick={onOpenClick} className="" type="button">
                <BsBoxArrowUpRight />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
