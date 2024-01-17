import React, { useState } from "react";
import ModalContainer from "./ModalContainer";
import RatingForm from "../form/RatingForm";
import { useNotification } from "../../hooks";
import { updateReview } from "../../api/review";

const EditRatingModal = ({ visible, onClose, onSuccess, initialState }) => {
  const { updateNotification } = useNotification();
  const [busy, setBusy] = useState();
  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, message } = await updateReview(initialState.id, data);
    setBusy(false);
    if (error) return updateNotification("error", error);
    onSuccess({ ...data });
    updateNotification("success", message);
    onClose();
  };
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <RatingForm onSubmit={handleSubmit} initialState={initialState} />
    </ModalContainer>
  );
};

export default EditRatingModal;
