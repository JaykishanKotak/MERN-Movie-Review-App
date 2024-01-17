import React, { useEffect, useState } from "react";
import ModalContainer from "./ModalContainer";
import { getActorProfile } from "../../api/actor";
import { useNotification } from "../../hooks";

const ProfileModal = ({ visible, profileId, onClose }) => {
  const [profile, setProfile] = useState({});
  const { updateNotification } = useNotification();
  const fetchActorProfile = async () => {
    const { error, actor } = await getActorProfile(profileId);
    if (error) return updateNotification("error", error);
    setProfile(actor);
  };

  useEffect(() => {
    if (profileId) fetchActorProfile();
  }, [profileId]);

  const { avatar, name, about } = profile;
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <div className=" flex flex-col items-center p-5 bg-white dark:bg-primary w-72 rounded space-y-3">
        <img className="w-28 h-28 rounded-full" src={avatar} alt={name} />
        <h1 className="dark:text-white text-primary font-semibold">{name}</h1>
        <p className="dark:text-dark-subtle text-light-subtle">{about}</p>
      </div>
    </ModalContainer>
  );
};

export default ProfileModal;
