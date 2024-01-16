import React, { useState } from "react";
import ModalContainer from "../modals/ModalContainer";
import ActorForm from "../form/ActorForm";
import { createActor, updateActor } from "../../api/actor";
import { useNotification } from "../../hooks";

const UpdateActor = ({ visible, onClose, initialState, onSuccess }) => {
  const { updateNotification } = useNotification();

  const [busy, setBusy] = useState(false);
  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, actor } = await updateActor(initialState.id, data);
    setBusy(false);
    if (error) {
      return updateNotification("error", error);
    }
    console.log(actor);
    onSuccess(actor);
    updateNotification("success", "Actor updated Successfully !");
    onClose();
  };
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <ActorForm
        title="Update Actor"
        btnTitle="Update"
        onSubmit={!busy ? handleSubmit : null}
        busy={busy}
        initialState={initialState}
      />
    </ModalContainer>
  );
};

export default UpdateActor;
