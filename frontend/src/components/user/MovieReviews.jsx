import React, { useEffect, useState } from "react";
import Container from "../Container";
import CustomButtonLink from "../CustomButtonLink";
import RatingStar from "../RatingStar";
import { useParams } from "react-router-dom";
import { deleteReview, getReviewsByMovie } from "../../api/review";
import { useAuth, useNotification } from "../../hooks";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import ConfirmModal from "../modals/ConfirmModal";
import NotFoundText from "../NotFoundText";
import EditRatingModal from "../modals/EditRatingModal";
const getNameInitial = (name = "") => {
  return name[0].toUpperCase();
};

const MovieReviews = () => {
  const { movieId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  //To show loggendin user's reviews
  const [profileOwnersReview, setProfileOwnersReview] = useState(null);
  const { authInfo } = useAuth();
  const profileId = authInfo.profile?.id;

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();
  const fetchReviews = async () => {
    const { movie, error } = await getReviewsByMovie(movieId);
    if (error) return updateNotification("error", error);
    setReviews([...movie.reviews]);
    setMovieTitle(movie.title);
  };

  useEffect(() => {
    if (movieId) fetchReviews();
  }, [movieId]);

  const findProfileOwnersReview = () => {
    //To handle alredy selected reviews-
    if (profileOwnersReview) return setProfileOwnersReview(null);

    //Find owner's review by mathing profileId with ower id
    const matched = reviews.find((review) => review.owner.id === profileId);
    if (!matched)
      return updateNotification("error", "You don't have any reviews !");
    setProfileOwnersReview(matched);
  };

  const displayConfirmModal = () => setShowConfirmModal(true);

  const hideConfirmModal = () => setShowConfirmModal(false);

  const handleDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteReview(profileOwnersReview.id);
    setBusy(false);
    if (error) return updateNotification("error", error);
    updateNotification("success", message);
    //Update UI
    const updatedReviews = reviews.filter(
      (r) => r.id !== profileOwnersReview.id
    );
    setReviews([...updatedReviews]);
    setProfileOwnersReview(null);
    hideConfirmModal();
  };

  const handleOnEditClick = () => {
    const { id, content, rating } = profileOwnersReview;
    setSelectedReview({
      id,
      content,
      rating,
    });

    setShowEditModal(true);
  };

  const hideEditModal = () => {
    setShowEditModal(false);
    setSelectedReview(null);
  };

  const handleOnReviewUpdate = (review) => {
    //For Find My Reviews
    //Here we're only update content and rating fields
    const updatedReview = {
      ...profileOwnersReview,
      rating: review.rating,
      content: review.content,
    };
    setProfileOwnersReview({ ...updatedReview });

    //For View All
    const newReviews = reviews.map((r) => {
      if (r.id == updatedReview.id) {
        return updatedReview;
      }
      return r;
    });
    setReviews([...newReviews]);
  };
  return (
    <div className="dark:bg-primary bg-white min-h-screen pb-10">
      <Container className="xl:px-0 px-2 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold dark:text-white text-secondary">
            <span className="text-light-subtle dark:text-dark-subtle font-normal">
              Reviews For :{" "}
            </span>
            {movieTitle}
          </h1>

          {/*To toggle user's review */}
          {profileId ? (
            <CustomButtonLink
              label={profileOwnersReview ? "View All" : "Find My Review "}
              onClick={findProfileOwnersReview}
            />
          ) : null}
        </div>

        {/*If no reviews */}
        <NotFoundText text="No Reviews !" visible={!reviews.length} />

        {/*Review card */}
        {profileOwnersReview ? (
          <div className="space-y-3 mt-3">
            <ReviewCard
              review={profileOwnersReview}
              key={profileOwnersReview.id}
            />
            <div className="flex space-x-3 dark:text-white text-primary text-xl p-3">
              <button onClick={displayConfirmModal} type="button">
                <BsTrash />
              </button>
              <button onClick={handleOnEditClick} type="button">
                <BsPencilSquare />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mt-3">
            {reviews.map((review) => (
              <ReviewCard review={review} key={review.id} />
            ))}
          </div>
        )}
      </Container>

      <ConfirmModal
        visible={showConfirmModal}
        onCancel={hideConfirmModal}
        onConfirm={handleDeleteConfirm}
        busy={busy}
        title="Are you sure ?"
        subTitle="This action will delete this review permanebtly. "
      />

      <EditRatingModal
        visible={showEditModal}
        initialState={selectedReview}
        onSuccess={handleOnReviewUpdate}
        onClose={hideEditModal}
      />
    </div>
  );
};

export default MovieReviews;

const ReviewCard = ({ review }) => {
  if (!review) return null;

  const { owner, content, rating } = review;
  return (
    <div className="flex space-x-3">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-light-subtle dark:bg-dark-subtle text-white text-xl select-none">
        {/*We dont't accepct profile avatar currently so we will genert first letter of name as profile avatar*/}
        {getNameInitial(owner.name)}
      </div>
      <div>
        <h1 className="dark:text-white text-secondary font-semibold text-lg  ">
          {owner.name}
        </h1>
        <RatingStar rating={rating} />
        <p className="dark:text-dark-subtle text-light-subtle">{content}</p>
      </div>
    </div>
  );
};
