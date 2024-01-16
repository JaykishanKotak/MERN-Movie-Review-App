import React, { useState } from "react";
import ModalContainer from "../modals/ModalContainer";
import ActorForm from "../form/ActorForm";
import { createActor } from "../../api/actor";
import { useNotification } from "../../hooks";

const ActorUpload = ({ visible, onClose }) => {
  const { updateNotification } = useNotification();

  const [busy, setBusy] = useState(false);
  const handleSubmit = async (data) => {
    // console.log(data);
    setBusy(true);
    const { error, actor } = await createActor(data);
    setBusy(false);
    if (error) {
      return updateNotification("error", error);
    }
    console.log(actor);
    updateNotification("success", "Actor created Successfully !");
    onClose();
  };
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <ActorForm
        title="Create New Actor"
        btnTitle="Create"
        onSubmit={!busy ? handleSubmit : null}
        busy={busy}
      />
    </ModalContainer>
  );
};

export default ActorUpload;
