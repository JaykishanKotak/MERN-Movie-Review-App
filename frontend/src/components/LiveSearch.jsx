import React, { forwardRef, useEffect, useRef, useState } from "react";
import { commonInputClasses } from "../utils/theme";
import { fakeProfilesData } from "../utils/fakeProfilesData";
// const results = fakeProfilesData;

const LiveSearch = ({
  value = "",
  placeholder = "",
  results = [],
  name = "",
  resultContainerStyle,
  selectedResultStyle,
  inputStyle,
  renderItem = null,
  onChange = null,
  onSelect = null,
}) => {
  const [displaySearch, setDisplaySearch] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const handleOnFocus = () => {
    if (results.length) {
      setDisplaySearch(true);
    }
  };

  const handleKeyDown = ({ key }) => {
    let nextCount;
    // console.log(key);
    const keys = ["ArrowUp", "ArrowDown", "Enter", "Escape"];
    if (!keys.includes(key)) return;

    //Move selection up and down
    if (key == "ArrowDown") {
      //To create infitine down and up effect
      nextCount = (focusedIndex + 1) % results.length;
    }

    if (key == "ArrowUp") {
      nextCount = (focusedIndex + results.length - 1) % results.length;
    }

    if (key == "Escape") {
      return closeSearch();
    }

    if (key == "Enter") {
      return handleSelection(results[focusedIndex]);
    }

    setFocusedIndex(nextCount);
  };

  const handleSelection = (selectedItem) => {
    // console.log(selectedItem);
    if (selectedItem) {
      onSelect(selectedItem);
      closeSearch();
    }
  };

  const closeSearch = () => {
    setDisplaySearch(false);
    setFocusedIndex(-1);
  };

  const handleOnBlur = () => {
    closeSearch();
  };

  const getInputStyle = () => {
    return inputStyle
      ? inputStyle
      : commonInputClasses + " border-2 rounded p-1 text-lg";
  };

  return (
    <div
      className="relative outline-none"
      tabIndex={1}
      onBlur={handleOnBlur}
      onKeyDown={handleKeyDown}
    >
      <input
        type="text"
        id={name}
        name={name}
        className={getInputStyle()}
        // placeholder="Search Profile"
        onFocus={handleOnFocus}
        // onBlur={handleOnBlur}
        // onKeyDown={handleKeyDown}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
      <SearchResults
        results={results}
        visible={displaySearch}
        focusedIndex={focusedIndex}
        onSelect={handleSelection}
        renderItem={renderItem}
        resultContainerStyle={resultContainerStyle}
        selectedResultStyle={selectedResultStyle}
      />
    </div>
  );
};

export default LiveSearch;

const SearchResults = ({
  visible,
  results = [],
  focusedIndex,
  onSelect,
  renderItem,
  resultContainerStyle,
  selectedResultStyle,
}) => {
  const resultContainer = useRef();
  //Auto Scroll into focus view
  useEffect(() => {
    resultContainer.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [focusedIndex]);

  const getSelectedClass = () => {
    return selectedResultStyle
      ? selectedResultStyle
      : "dark:bg-dark-subtle bg-light-subtle";
  };
  if (!visible) return null;
  return (
    <div className="absolute z-50 right-0 left-0 top-10 dark:bg-secondary bg-white shadow-md p-2 max-h-64 space-y-2 mt-1 overflow-auto custom-scroll-bar">
      {results.map((result, index) => {
        const { id, name, avatar } = result;
        return (
          <ResultCard
            //key={result.id}
            key={index.toString()}
            ref={index === focusedIndex ? resultContainer : null}
            item={result}
            renderItem={renderItem}
            resultContainerStyle={resultContainerStyle}
            selectedResultStyle={
              index === focusedIndex ? getSelectedClass() : ""
            }
            onMouseDown={() => onSelect(result)}
          />
        );
      })}
    </div>
  );
};

const ResultCard = forwardRef((props, ref) => {
  //Props and Refs
  const {
    item,
    renderItem,
    resultContainerStyle,
    selectedResultStyle,
    onMouseDown,
  } = props;

  const getClasses = () => {
    if (resultContainerStyle)
      return resultContainerStyle + " " + selectedResultStyle;

    return (
      selectedResultStyle +
      " cursor-pointer rounded overflow-hidden dark:hover:bg-dark-subtle hover:bg-light-subtle transition"
    );
  };
  return (
    <div ref={ref} onMouseDown={onMouseDown} className={getClasses()}>
      {renderItem(item)}
    </div>
  );
});
