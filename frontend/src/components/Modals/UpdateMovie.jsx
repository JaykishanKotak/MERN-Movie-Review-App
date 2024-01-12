import React, { useState } from "react";
import ModalContainer from "./ModalContainer";
import MovieForm from "../admin/MovieForm";
import { updateMovie } from "../../api/movie";
import { useNotification } from "../../hooks";

const UpdateMovie = ({ visible, initialState, onSuccess, onClose }) => {
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();
  const handleSubmit = async (data) => {
    setBusy(true);
    console.log(data);
    const { message, movie, error } = await updateMovie(initialState.id, data);
    setBusy(false);

    if (error) {
      return updateNotification("error", error);
    }
    updateNotification("success", message);
    //For update main Movie UI
    onSuccess(movie);
    onClose();
  };
  return (
    <ModalContainer visible={visible}>
      <MovieForm
        initialState={initialState}
        btnTitle="Update"
        onSubmit={!busy ? handleSubmit : null}
        busy={busy}
      />
    </ModalContainer>
  );
};

export default UpdateMovie;
