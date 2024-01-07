import React, { useState } from "react";
import LiveSearch from "../LiveSearch";
import { commonInputClasses } from "../../utils/theme";
import { renderItem } from "../../utils/helper";
import { useNotification, useSearch } from "../../hooks";
import { searchActor } from "../../api/actor";

//const cast = [{ actor : id, roleAs : "", leadActor : true}]

// const results = fakeProfilesData;

const defaultCastInfo = {
  profile: {},
  roleAs: "",
  leadActor: false,
};
const CastForm = ({ onSubmit }) => {
  const { updateNotification } = useNotification();
  const { handleSearch, searching, results, resetSearch } = useSearch();

  const [castInfo, setCastInfo] = useState(defaultCastInfo);
  const { leadActor, profile, roleAs } = castInfo;

  const [profiles, setProfiles] = useState([]);

  const handleOnChange = ({ target }) => {
    const { checked, name, value } = target;
    if (name === "leadActor") {
      return setCastInfo({ ...castInfo, leadActor: checked });
    }
    setCastInfo({ ...castInfo, [name]: value });
  };

  const handleProfileSelect = (profile) => {
    setCastInfo({ ...castInfo, profile });
  };

  const handleSubmit = () => {
    console.log(castInfo);
    const { profile, roleAs } = castInfo;
    if (!profile.name) {
      return updateNotification("error", "Cast Profile is missing !");
    }
    if (!roleAs.trim()) {
      return updateNotification("error", "Cast Role is missing !");
    }
    onSubmit(castInfo);
    setCastInfo({ ...defaultCastInfo, profile: { name: "" } });
    resetSearch();
    setProfiles([]);
  };

  const handleProfileChange = ({ target }) => {
    const { value } = target;
    const { profile } = castInfo;
    profile.name = value;
    setCastInfo({ ...castInfo, ...profile });
    handleSearch(searchActor, value, setProfiles);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        name="leadActor"
        className="w-4 h-4"
        value={leadActor}
        onChange={handleOnChange}
        checked={leadActor}
        title="Set As Lead Actor"
      />
      <LiveSearch
        placeholder="Search Profile"
        value={profile.name}
        results={profiles}
        onSelect={handleProfileSelect}
        renderItem={renderItem}
        onChange={handleProfileChange}
      />
      <span className="dark:text-dark-subtle text-light-subtle font-semibold">
        as
      </span>

      <div className="flex-grow">
        <input
          value={roleAs}
          onChange={handleOnChange}
          name="roleAs"
          className={commonInputClasses + " rounded p-1 text-lg border-2"}
          placeholder="Role As"
        />
      </div>

      <button
        onClick={handleSubmit}
        type="button"
        className="dark:bg-white bg-secondary dark:text-primary text-white px-1 rounded"
      >
        Add
      </button>
    </div>
  );
};

export default CastForm;
