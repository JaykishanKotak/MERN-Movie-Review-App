import React, { useState } from "react";
import LiveSearch from "./LiveSearch";
import { renderItem } from "../utils/helper";
import { searchActor } from "../api/actor";
import { useSearch } from "../hooks";

const WriterSelector = ({ onSelect }) => {
  const { handleSearch, searching, results, resetSearch } = useSearch();
  const [value, setValue] = useState("");
  const [profiles, setProfiles] = useState([]);

  const handleOnChange = ({ target }) => {
    const { value } = target;
    setValue(value);
    handleSearch(searchActor, value, setProfiles);
  };

  const handleOnSelect = (profile) => {
    setValue("");
    onSelect(profile);
    setProfiles([]);
    resetSearch();
  };
  return (
    <LiveSearch
      name="writers"
      // value={director.name}
      results={profiles}
      placeholder="Search Profiles..."
      renderItem={renderItem}
      onSelect={handleOnSelect}
      onChange={handleOnChange}
      value={value}
    />
  );
};

export default WriterSelector;
