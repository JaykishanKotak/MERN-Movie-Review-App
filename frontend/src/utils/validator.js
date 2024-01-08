export const validateMovie = (movieInfo) => {
  const {
    title,
    storyLine,
    language,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
  } = movieInfo;

  if (!title.trim()) {
    return { error: "Title is missing !" };
  }

  if (!storyLine.trim()) {
    return { error: "Storyline is missing !" };
  }

  if (!language.trim()) {
    return { error: "Language is missing !" };
  }

  if (!releseDate.trim()) {
    return { error: "Release Date is missing !" };
  }

  if (!status.trim()) {
    return { error: "Status is missing !" };
  }

  if (!type.trim()) {
    return { error: "Type is missing !" };
  }

  //Validation for Genres - we are checking if genres is array or not
  if (!genres.length) {
    return { error: "Genres are missing !" };
  }

  // genres need to filled with string value
  for (let gen of genres) {
    if (!gen.trim()) {
      return { error: "Invalid Genres !" };
    }
  }

  //Validation for Tags - we are checking if tags is array or not
  if (!tags.length) {
    return { error: "Tags are missing !" };
  }
  // tags need to filled with string value
  for (let tag of tags) {
    if (!tag.trim()) {
      return { error: "Invalid Tags !" };
    }
  }

  //Validation for Cast - we are checking if cast is array or not
  if (!cast.length) {
    return { error: "Cast and Crew are missing !" };
  }
  // tags need to filled with object value
  for (let c of cast) {
    if (typeof c !== "object") {
      return { error: "Invalid Cast !" };
    }
  }

  return { error: null };
};
