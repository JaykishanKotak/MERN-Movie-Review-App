import React, { useEffect, useState } from "react";
import { commonInputClasses } from "../../utils/theme";
import PosterSelector from "../PosterSelector";
import Selector from "../Selector";
import { useNotification } from "../../hooks";
import { ImSpinner3 } from "react-icons/im";

const defaultActorInfo = {
  name: "",
  about: "",
  gender: "",
  avatar: null,
};

const genderOptions = [
  { title: "Male", value: "male" },
  { title: "Female", value: "female" },
  { title: "Other", value: "other" },
];

const validateActor = ({ avatar, name, about, gender }) => {
  if (!name.trim()) {
    return { error: "Actor name is missing !" };
  }
  if (!about.trim()) {
    return { error: "About section is empty !" };
  }
  if (!gender.trim()) {
    return { error: "Actor gender is empty !" };
  }
  //Avatar is optional field
  if (avatar && !avatar.type?.startsWith("image")) {
    return { error: "Invalid Image / Avatar File !" };
  }
  return { error: null };
};
const ActorForm = ({ title, btnTitle, busy, onSubmit, initialState }) => {
  const [actorInfo, setActorInfo] = useState({ ...defaultActorInfo });

  const [selectedAvatarForUI, setSelectedAvatarForUI] = useState("");

  const { updateNotification } = useNotification();

  const handleChange = ({ target }) => {
    const { value, files, name } = target;
    if (name === "avatar") {
      const file = files[0];
      updatePosterForUI(file);
      return setActorInfo({ ...actorInfo, avatar: file });
    }
    setActorInfo({ ...actorInfo, [name]: value });
  };

  const updatePosterForUI = (file) => {
    const url = URL.createObjectURL(file);
    setSelectedAvatarForUI(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = validateActor(actorInfo);
    if (error) {
      return updateNotification("error", error);
    }
    // console.log(actorInfo);
    //Submit Form
    const formData = new FormData();
    for (let key in actorInfo) {
      if (key) {
        formData.append(key, actorInfo[key]);
      }
    }
    onSubmit(formData);
  };
  const { name, about, gender } = actorInfo;

  //For Update Actors
  useEffect(() => {
    if (initialState) {
      setActorInfo({ ...initialState, avatar: null });
      setSelectedAvatarForUI(initialState.avatar);
    }
  }, [initialState]);
  return (
    <form
      onSubmit={handleSubmit}
      className="dark:bg-primary bg-white p-3 w-[35rem] rounded"
    >
      {/*Form Elements */}

      <div className="flex justify-between items-center mb-3">
        <h1 className="font-semibold text-xl dark:text-white text-primary">
          {title}
        </h1>
        <button
          type="submit"
          className="h-8 w-24 dark:bg-white bg-primary dark:text-primary text-white hover:opacity-80 transition rounded flex items-center justify-center"
        >
          {busy ? <ImSpinner3 className="animate-spin" /> : btnTitle}
        </button>
      </div>

      {/*<img
          src="https://images.unsplash.com/photo-1657299143228-f971e4887268?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxMXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
          alt=""
          className="w-36 h-36 aspect-square object-cover rounded"
        />*/}
      <div className="flex space-x-2">
        <PosterSelector
          selectedPoster={selectedAvatarForUI}
          className="w-36 h-36 aspect-square object-cover rounded"
          name="avatar"
          onChange={handleChange}
          accept="image/jpeg, image/jpg, image/png"
          label="Select Avatar"
        />
        <div className="flex flex-grow flex-col space-y-2">
          <input
            placeholder="Enter Name"
            className={commonInputClasses + " border-b-2"}
            name="name"
            onChange={handleChange}
            value={name}
          />
          <textarea
            placeholder="About"
            className={commonInputClasses + " border-b-2 resize-none h-full"}
            name="about"
            onChange={handleChange}
            value={about}
          />
        </div>
      </div>
      <div className="mt-3">
        {" "}
        <Selector
          options={genderOptions}
          label="Gender"
          value={gender}
          onChange={handleChange}
          name="gender"
        />
      </div>
    </form>
  );
};

export default ActorForm;
