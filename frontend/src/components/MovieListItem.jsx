import React, { Fragment, useState } from "react";
import { BsBoxArrowUpRight, BsPencilSquare, BsTrash } from "react-icons/bs";
import ConfirmModal from "./modals/ConfirmModal";
import { useNotification } from "../hooks";
import { deleteMovie } from "../api/movie";
import UpdateMovie from "./modals/UpdateMovie";

const MovieListItem = ({ movie, afterDelete, afterUpdate }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const { updateNotification } = useNotification();
  const handleDeleteConfirm = async () => {
    setBusy(true);
    const { message, error } = await deleteMovie(movie.id);
    setBusy(false);
    if (error) return updateNotification("error", error);

    hideConfirmModal();
    updateNotification("success", message);
    afterDelete(movie);
  };

  const displayConfirmModal = () => setShowConfirmModal(true);

  const hideConfirmModal = () => setShowConfirmModal(false);

  const handleOnEditClick = () => {
    setSelectedMovieId(movie.id);
    setShowUpdateModal(true);
  };

  const hideUpdateForm = () => setShowUpdateModal(false);

  const handleOnUpdate = (movie) => {
    afterUpdate(movie);
    setShowUpdateModal(false);
    setSelectedMovieId(null);
  };
  const { poster, title, genres = [], status } = movie;

  return (
    <Fragment>
      <MovieCard
        movie={movie}
        onDeleteClick={displayConfirmModal}
        onEditClick={handleOnEditClick}
      />
      <div className="p-0">
        <ConfirmModal
          title="Are you sure ?"
          subTitle="This action will remove this movie permanently !"
          visible={showConfirmModal}
          onConfirm={handleDeleteConfirm}
          onCancel={hideConfirmModal}
          busy={busy}
        />

        <UpdateMovie
          visible={showUpdateModal}
          movieId={selectedMovieId}
          onSuccess={handleOnUpdate}
          onClose={hideUpdateForm}
        />
      </div>
    </Fragment>
  );
};

const MovieCard = ({ movie, onOpenClick, onEditClick, onDeleteClick }) => {
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
export default MovieListItem;
