import React, { Fragment, useEffect, useState } from "react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { deleteActor, getActors, searchActor } from "../../api/actor";
import { useNotification, useSearch } from "../../hooks";
import NextAndPrevButton from "../NextAndPrevButton";
import UpdateActor from "../modals/UpdateActor";
import AppSearchForm from "../form/AppSearchForm";
import NotFoundText from "../NotFoundText";
import ConfirmModal from "../modals/ConfirmModal";

let currentPageNo = 0;
const limit = 20; //Fixed limit
const Actors = () => {
  const { updateNotification } = useNotification();

  const [actors, setActors] = useState([]);
  const [results, setResults] = useState([]);

  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [busy, setBusy] = useState(false);

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { handleSearch, resetSearch, resultNotFound } = useSearch();
  const fetchActors = async (pageNo) => {
    const { profiles, error } = await getActors(pageNo, limit);
    if (error) return updateNotification("error", error);

    //If fetched all data from Db and no actors were left
    if (!profiles.length) {
      //Reset page No to prev page no. so that we will be on last page where data is exists
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }
    setActors([...profiles]);
    console.log(profiles);
  };

  useEffect(() => {
    fetchActors(currentPageNo);
  }, []);

  const handleOnPrevClick = () => {
    //For First Page
    if (currentPageNo <= 0) return;

    //If we alredy at first page - reset the reachedToEnd Flag
    if (reachedToEnd) setReachedToEnd(false);
    //Decrease Page No
    currentPageNo -= 1;
    fetchActors(currentPageNo);
  };

  const handleOnNextClick = () => {
    //For Last Page
    if (reachedToEnd) return;
    //Increase Page No
    currentPageNo += 1;
    fetchActors(currentPageNo);
  };

  const handleOnEditClick = (profile) => {
    setShowUpdateModal(true);
    setSelectedProfile(profile);
    console.log(profile);
  };

  const handleOnDeleteClick = (profile) => {
    setSelectedProfile(profile);
    setShowConfirmModal(true);
  };

  const handleOnDeleteConfirm = async () => {
    // setBusy(true);
    // const { error, message } = await deleteActor(selectedProfile.id);
    // if (error) {
    //   return updateNotification("error", error);
    // }
    // setBusy(false);
    // updateNotification("success", message);
    // hideConfirmModal();
    // fetchActors(currentPageNo);
    setBusy(true);
    hideConfirmModal();
    setBusy(false);
    updateNotification(
      "warning",
      "We can't delete actors now because it's mapped to the movies !"
    );
    fetchActors(currentPageNo);
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const hideUpdateModal = () => {
    setShowUpdateModal(false);
  };

  //To handle actors infos updated on update actor
  const handleOnActorUpdate = (profile) => {
    const updateActors = actors.map((actor) => {
      //If we find updated actor id, we return new updated profile
      if (profile.id === actor.id) {
        return profile;
      }
      return actor;
    });
    setActors([...updateActors]);
  };

  const handleOnSearchSumbit = async (value) => {
    await handleSearch(searchActor, value, setResults);
  };

  const handleSearchFormReset = () => {
    resetSearch();
    setResults([]);
  };
  return (
    <Fragment>
      <div className="p-5">
        <div className=" flex justify-end mb-5">
          <AppSearchForm
            onReset={handleSearchFormReset}
            onSubmit={handleOnSearchSumbit}
            showResetIcon={results.length || resultNotFound}
            placeholder="Search Actors ..."
          />
        </div>
        {/*Record not found */}
        <NotFoundText text="Record not found" visible={resultNotFound} />
        <div className="grid grid-cols-4 gap-5 p-5">
          {results.length || resultNotFound
            ? results.map((actor) => (
                <ActorProfile
                  onEditClick={() => handleOnEditClick(actor)}
                  onDeleteClick={() => handleOnDeleteClick(actor)}
                  key={actor.id}
                  profile={actor}
                />
              ))
            : actors.map((actor) => (
                <ActorProfile
                  onEditClick={() => handleOnEditClick(actor)}
                  onDeleteClick={() => handleOnDeleteClick(actor)}
                  key={actor.id}
                  profile={actor}
                />
              ))}
        </div>
        {!results.length && !resultNotFound ? (
          <NextAndPrevButton
            onNextClick={handleOnNextClick}
            onPrevClick={handleOnPrevClick}
            className="mt-5"
          />
        ) : null}
      </div>

      {/*We can't add close functionlity becasue delete is a async task */}
      <ConfirmModal
        visible={showConfirmModal}
        busy={busy}
        title="Are you sure ?"
        subTitle="This action will remove profile permanently !"
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
      />
      <UpdateActor
        onClose={hideUpdateModal}
        visible={showUpdateModal}
        initialState={selectedProfile}
        onSuccess={handleOnActorUpdate}
      />
    </Fragment>
  );
};

export default Actors;

const ActorProfile = ({ profile, onEditClick, onDeleteClick }) => {
  const [showOptions, setShowOptions] = useState(false);
  const acceptedNameLength = 15;
  const handleOnMouseEnter = () => {
    setShowOptions(true);
  };

  const handleOnMouseLeave = () => {
    setShowOptions(false);
  };

  if (!profile) return null;

  const { name, about = "", avatar } = profile;

  const getName = (name) => {
    if (name.length <= acceptedNameLength) return name;
    return name.substring(0, acceptedNameLength) + "..";
  };
  return (
    <div className="dark:bg-secondary dark:shadow bg-white shadow h-20 rounded overflow-hidden">
      <div
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className="flex cursor-pointer relative"
      >
        <img
          className="w-20 aspect-square object-cover"
          // src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          src={avatar}
          alt={name}
        />
        <div className="px-2">
          {/*whitespace-nowrap to avoide text overlap - not allow to go to next line */}
          <h1 className="text-xl text-primary dark:text-white font-semibold whitespace-nowrap">
            {getName(name)}
          </h1>
          {/*We only select first 50 chars of about */}
          <p className="text-primary dark:text-white opacity-70">
            {about.substring(0, 50)}
          </p>
        </div>
        <Options
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          visible={showOptions}
        />
      </div>
    </div>
  );
};

const Options = ({ visible, onDeleteClick, onEditClick }) => {
  if (!visible) return null;
  {
    /*to cover entire width and height we pass inset-0 */
  }
  return (
    <div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex justify-center items-center space-x-5">
      <button
        onClick={onDeleteClick}
        className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition"
        type="button"
      >
        <BsTrash />
      </button>
      <button
        onClick={onEditClick}
        className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition"
        type="button"
      >
        <BsPencilSquare />
      </button>
    </div>
  );
};

{
  /*      <ActorProfile
    profile={{
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "JOhn Doe",
      about:
        "Amet ea aliqua consectetur voluptate nisi veniam voluptate magna. Occaecat commodo officia do qui cupidatat commodo esse quis mollit. Non est excepteur dolor anim proident elit reprehenderit reprehenderit exercitation aliquip est laboris nisi eu. Voluptate ipsum et laboris incididunt deserunt ex enim ut labore exercitation ea. Dolore ad nostrud excepteur cillum. Labore excepteur ea consequat proident minim aute Lorem consectetur. Lorem sint esse ex consectetur ea exercitation cupidatat fugiat.",
    }}
  />*/
}
