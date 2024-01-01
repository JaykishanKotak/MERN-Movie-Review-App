import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNotification } from "../../hooks";
import { uploadTrailer } from "../../api/movie";
import MovieForm from "./MovieForm";

const MovieUpload = () => {
  const { updateNotification } = useNotification();
  const [uploadProgress, setUploadProgress] = useState(0);

  const [videoInfo, setVideoInfo] = useState({});

  const handleUploadTrailer = async (data) => {
    //Process will be handled in background
    const { error, url, public_id } = await uploadTrailer(
      data,
      setUploadProgress
    );
    if (error) updateNotification("error", error);
    setVideoUploaded(true);
    setVideoInfo({
      url,
      public_id,
    });
  };
  const handleChange = (file) => {
    console.log(file);
    const formData = new FormData();
    formData.append("video", file);
    //url, public_id
    setVideoSelected(true);
    handleUploadTrailer(formData);
  };
  console.log("videoInfo", videoInfo);
  const handleTypeError = (error) => {
    console.log(error);
    updateNotification("error", error);
  };

  const [videoSelected, setVideoSelected] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);

  const getUploadProgressValue = () => {
    // `Upload Progress ${uploadProgress}%... `
    if (!videoUploaded && uploadProgress >= 100) {
      return "Processing ...";
    }
    return `Upload Progress ${uploadProgress}%...`;
  };
  return (
    <div className="fixed inset-0 dark:bg-white dark:bg-opacity-50 bg-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      {/* syntex to use custom value in tailwind css h-[40rem]*/}
      <div className="dark:bg-primary bg-white rounded w-[45rem] h-[40rem] overflow-auto custom-scroll-bar p-2">
        {/*<UploadProgress
          visible={!videoUploaded && videoSelected}
          message={getUploadProgressValue()}
          width={uploadProgress}
        />
        <TrailerSelector
          visible={!videoSelected}
          onTypeError={handleTypeError}
          handleChange={handleChange}
        />*/}
        <MovieForm />
      </div>
    </div>
  );
};

export default MovieUpload;

const TrailerSelector = ({ visible, onTypeError, handleChange }) => {
  if (!visible) return null;

  return (
    <div className="flex items-center justify-center h-full">
      <FileUploader
        handleChange={handleChange}
        onTypeError={onTypeError}
        types={["mp4", "avi"]}
      >
        <div className="w-48 h-48 border border-dashed dark:border-dark-subtle border-light-subtle rounded-full flex flex-col items-center justify-center dark:text-dark-subtle text-light-subtle cursor-pointer">
          <AiOutlineCloudUpload size={80} />
          <p>Drop Your File Here</p>
        </div>
      </FileUploader>
    </div>
  );
};

// Upload UploadProgress Indicator
const UploadProgress = ({ message, width, visible }) => {
  if (!visible) return null;

  return (
    <div className="dark:bg-secondary bg-white drop-shadow-lg rounded p-3">
      <div className="relative h-3 dark:bg-dark-subtle bg-light-subtle overflow-hidden">
        <div
          style={{
            width: width + "%",
          }}
          className="h-full absolute left-0 dark:bg-white bg-secondary d"
        />
      </div>
      <p className="font-semibold dark:text-dark-subtle text-light-subtle animate-pulse mt-1">
        {message}{" "}
      </p>
    </div>
  );
};
