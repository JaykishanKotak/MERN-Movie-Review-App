import React, { Fragment, useEffect, useState } from "react";
import MovieListItem from "../MovieListItem";
import { deleteMovie, getMovieForUpdate, getMovies } from "../../api/movie";
import { useMovies, useNotification } from "../../hooks";
import NextAndPrevButton from "../NextAndPrevButton";
import UpdateMovie from "../Modals/UpdateMovie";
import ConfirmModal from "../Modals/ConfirmModal";

const limit = 5;
let currentPageNo = 0;
const Movies = () => {
  // const [movies, setMovies] = useState([]);
  // const [reachedToEnd, setReachedToEnd] = useState(false);
  // const [showUpdateModal, setShowUpdateModal] = useState(false);
  // const [selectedMovie, setSelectedMovie] = useState(null);
  // const [showConfirmModal, setShowConfirmModal] = useState(false);
  // const [busy, setBusy] = useState(false);

  // const { updateNotification } = useNotification();

  const {
    fetchMovies,
    movies: newMovies,
    fetchNextPage,
    fetchPrevPage,
  } = useMovies();

  // const fetchMovies = async (pageNo) => {
  //   const { error, movies } = await getMovies(pageNo, limit);
  //   if (error) return updateNotification("error", error);

  //   if (!movies.length) {
  //     currentPageNo = pageNo - 1;
  //     return setReachedToEnd(true);
  //   }
  //   setMovies([...movies]);
  // };

  useEffect(() => {
    fetchMovies(currentPageNo);
  }, []);

  // const handleOnNextClick = () => {
  //   //If we are on last page
  //   if (reachedToEnd) return;
  //   currentPageNo += 1;
  //   fetchMovies(currentPageNo);
  // };

  // const handleOnPrevClick = () => {
  //   //If we are on first page
  //   if (currentPageNo <= 0) return;

  //   //If we alredy at first page - reset the reachedToEnd Flag
  //   //Modern JS will allow single line conditions without {}
  //   if (reachedToEnd) setReachedToEnd(false);
  //   currentPageNo -= 1;
  //   fetchMovies(currentPageNo);
  // };

  // const handleOnEditClick = async ({ id }) => {
  //   const { movie, error } = await getMovieForUpdate(id);
  //   if (error) return updateNotification("error", error);

  //   setSelectedMovie(movie);
  //   setShowUpdateModal(true);
  // };

  // const handleOnUpdate = (movie) => {
  //   const updatedMovies = movies.map((m) => {
  //     //If a movie is updated - return new info
  //     if (m.id === movie.id) {
  //       return movie;
  //     }
  //     //Else return old info
  //     return m;
  //   });
  //   setMovies([...updatedMovies]);
  // };

  // const hideUpdateForm = () => {
  //   setShowUpdateModal(false);
  // };

  // const hideConfrimModal = () => {
  //   setShowConfirmModal(false);
  // };

  // const handleOnDeleteClick = (movie) => {
  //   setSelectedMovie(movie);
  //   setShowConfirmModal(true);
  // };

  // const handleDeleteConfirm = async () => {
  //   setBusy(true);
  //   const { message, error } = await deleteMovie(selectedMovie.id);
  //   setBusy(false);
  //   if (error) return updateNotification("error", error);
  //   updateNotification("success", message);
  //   hideConfirmModal();
  //   fetchMovies(currentPageNo);
  // };

  // const hideConfirmModal = () => {
  //   setShowConfirmModal(false);
  // };

  // const handleAfterDelete = () => {
  //   //Page number will be handled by movie provider
  //   fetchMovies();
  // };

  const handleUIUpdate = () => {
    fetchMovies();
  };

  return (
    <Fragment>
      <div className="space-y-3 p-5">
        {newMovies.map((movie) => {
          return (
            <MovieListItem
              key={movie.id}
              movie={movie}
              afterDelete={handleUIUpdate}
              afterUpdate={handleUIUpdate}
              // onEditClick={() => handleOnEditClick(movie)}
              // onDeleteClick={() => handleOnDeleteClick(movie)}
            />
          );
        })}

        <NextAndPrevButton
          onNextClick={fetchNextPage}
          onPrevClick={fetchPrevPage}
          className="mt-5"
        />
      </div>

      {/*  <ConfirmModal
        title="Are you sure ?"
        subTitle="This action will remove this movie permanently !"
        visible={showConfirmModal}
        onConfirm={handleDeleteConfirm}
        onCancel={hideConfrimModal}
        busy={busy}
      />
      <UpdateMovie
        visible={showUpdateModal}
        initialState={selectedMovie}
        onSuccess={handleOnUpdate}
        onClose={hideUpdateForm}
      /> */}
    </Fragment>
  );
};

export default Movies;
