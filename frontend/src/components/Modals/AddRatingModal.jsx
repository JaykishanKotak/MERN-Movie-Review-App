import React from "react";
import ModalContainer from "./ModalContainer";
import RatingForm from "../form/RatingForm";
import { addReview } from "../../api/review";
import { useParams } from "react-router-dom";
import { useNotification } from "../../hooks";

const AddRatingModal = ({ visible, onClose, onSuccess }) => {
  //We renderd this component inside single movie, so we have acces of movidId params
  const { movieId } = useParams();

  const { updateNotification } = useNotification();
  const handleSubmit = async (data) => {
    // console.log(data);
    const { error, message, reviews } = await addReview(movieId, data);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    //Update the UI With latest Reviews
    onSuccess(reviews);
    onClose();
  };
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <RatingForm onSubmit={handleSubmit} />
    </ModalContainer>
  );
};

export default AddRatingModal;
